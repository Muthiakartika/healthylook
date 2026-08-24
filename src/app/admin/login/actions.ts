"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { queryOne } from "@/lib/db";
import {
  audit,
  createSession,
  tooManyFailures,
  verifyPassword,
} from "@/lib/auth";

export type LoginState = { error?: string };

/**
 * Sign in.
 *
 * ── WHY EVERY FAILURE RETURNS THE SAME SENTENCE ───────────────────────
 * "No account with that email" and "wrong password" are two different
 * facts, and telling them apart turns the login form into a tool for
 * finding out who has an account. Both paths return one message.
 *
 * The unknown-email path also runs a dummy hash comparison. Without it,
 * a missing account answers noticeably faster than a wrong password, and
 * the timing alone leaks the same thing the message would have.
 */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "") || "/admin";

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (await tooManyFailures(email)) {
    return {
      error:
        "Too many failed attempts for this email. Wait 15 minutes and try again.",
    };
  }

  const user = await queryOne<{
    id: string;
    password_hash: string;
    disabled_at: string | null;
  }>(
    `SELECT id, password_hash, disabled_at FROM users WHERE lower(email) = $1`,
    [email],
  );

  const GENERIC = "That email and password do not match an account.";

  if (!user) {
    // Constant-ish work for an account that does not exist.
    await verifyPassword(
      password,
      "scrypt$00000000000000000000000000000000$" + "0".repeat(128),
    );
    await audit(null, "login.failed", email, { reason: "no_such_user" });
    return { error: GENERIC };
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    await audit(user.id, "login.failed", email, { reason: "bad_password" });
    return { error: GENERIC };
  }

  if (user.disabled_at) {
    await audit(user.id, "login.failed", email, { reason: "disabled" });
    return { error: "This account has been disabled. Ask an admin to re-enable it." };
  }

  const agent = (await headers()).get("user-agent") ?? undefined;
  await createSession(user.id, agent);
  await audit(user.id, "login.success", email);

  // Only ever redirect inside this site. An open redirect here would let a
  // phishing link send someone to /admin/login?next=https://evil.example
  // and land them off-site immediately after they typed a password.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/admin");
}
