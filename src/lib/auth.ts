import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { query, queryOne, transaction } from "@/lib/db";
import { SESSION_COOKIE, type Role } from "@/lib/auth.shared";

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
) => Promise<Buffer>;

export { SESSION_COOKIE };
export type { Role };

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  must_change_password: boolean;
  disabled_at: string | null;
  created_at: string;
  last_login_at: string | null;
};

const SESSION_DAYS = 14;

/* ── PASSWORDS ────────────────────────────────────────────────────────
 * scrypt from node:crypto, not bcrypt or argon2 from npm.
 *
 * Both of those are native addons that have to compile for the deployment
 * target, which is the usual reason a Node build breaks on a host it was
 * not tested on. scrypt is in the standard library, is memory-hard in the
 * way bcrypt is not, and is what Node's own documentation points at for
 * password storage. The cost parameters below are Node's defaults
 * (N=16384, r=8, p=1) at a 64-byte key.
 *
 * The stored format is `scrypt$<salt-hex>$<key-hex>` so the algorithm is
 * named in the hash itself; changing parameters later can then re-hash on
 * next login instead of invalidating every password at once.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, keyHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !keyHex) return false;
  const key = await scrypt(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(keyHex, "hex");
  // Lengths must match before timingSafeEqual, which throws otherwise —
  // and throwing on a wrong-length hash would itself leak information.
  if (key.length !== expected.length) return false;
  return timingSafeEqual(key, expected);
}

/**
 * Rejects the passwords that actually get chosen when someone is handed an
 * admin panel. Deliberately short: a rule nobody can satisfy gets worked
 * around with "Password1!" every time.
 */
export function passwordProblem(password: string): string | null {
  if (password.length < 10) return "Password must be at least 10 characters.";
  if (/^\d+$/.test(password)) return "Password cannot be only numbers.";
  const common = ["password", "12345678", "qwerty", "healthylook", "admin123"];
  if (common.some((c) => password.toLowerCase().includes(c))) {
    return "That password contains a word attackers guess first. Choose another.";
  }
  return null;
}

/* ── SESSIONS ─────────────────────────────────────────────────────────
 * The cookie carries a 32-byte random token; the database stores only its
 * SHA-256. A stolen database backup therefore contains no usable session.
 * SHA-256 rather than scrypt here on purpose: the token already has 256
 * bits of entropy, so there is nothing to brute-force and no reason to
 * pay a memory-hard hash on every single request.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string, userAgent?: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await transaction(async (q) => {
    await q(
      `INSERT INTO sessions (token_hash, user_id, expires_at, user_agent)
       VALUES ($1, $2, $3, $4)`,
      [hashToken(token), userId, expires, userAgent?.slice(0, 500) ?? null],
    );
    await q(`UPDATE users SET last_login_at = now() WHERE id = $1`, [userId]);
    // Opportunistic cleanup. A cron job for this would be one more moving
    // part for a table that gains a handful of rows a week.
    await q(`DELETE FROM sessions WHERE expires_at < now()`);
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
  return token;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await query(`DELETE FROM sessions WHERE token_hash = $1`, [hashToken(token)]);
  }
  store.delete(SESSION_COOKIE);
}

/**
 * The signed-in user, or null.
 *
 * Joins rather than doing two queries so that a session belonging to a
 * disabled account resolves to null in the same round trip — disabling an
 * editor takes effect on their next request, not at their next login.
 */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  return queryOne<User>(
    `SELECT u.id, u.email, u.name, u.role, u.must_change_password,
            u.disabled_at, u.created_at, u.last_login_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1
        AND s.expires_at > now()
        AND u.disabled_at IS NULL`,
    [hashToken(token)],
  );
}

/** For server components and actions that must not run for a guest. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}

/* ── AUDIT ────────────────────────────────────────────────────────────
 * Deliberately never throws. An audit write failing must not be able to
 * roll back the action it was recording — a lost log line is a smaller
 * problem than a save that appears to fail after it succeeded.
 */
export async function audit(
  userId: string | null,
  action: string,
  subject?: string,
  detail?: unknown,
): Promise<void> {
  try {
    await query(
      `INSERT INTO audit_log (user_id, action, subject, detail) VALUES ($1, $2, $3, $4)`,
      [userId, action, subject ?? null, detail ? JSON.stringify(detail) : null],
    );
  } catch {
    /* ignore */
  }
}

/* ── LOGIN THROTTLE ───────────────────────────────────────────────────
 * Counts failures already in the audit log rather than keeping a separate
 * attempts table or an in-memory map. In-memory would be useless here:
 * every serverless invocation is a fresh process, so a counter in one
 * cannot see attempts handled by another.
 */
const MAX_FAILURES = 8;
const WINDOW_MINUTES = 15;

export async function tooManyFailures(email: string): Promise<boolean> {
  const rows = await query<{ count: string }>(
    `SELECT count(*) FROM audit_log
      WHERE action = 'login.failed'
        AND subject = $1
        AND created_at > now() - ($2 || ' minutes')::interval`,
    [email.toLowerCase(), String(WINDOW_MINUTES)],
  );
  return Number(rows[0]?.count ?? 0) >= MAX_FAILURES;
}
