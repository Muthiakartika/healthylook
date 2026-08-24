"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query, queryOne, transaction } from "@/lib/db";
import {
  audit,
  destroySession,
  getCurrentUser,
  hashPassword,
  passwordProblem,
  requireAdmin,
  requireUser,
  verifyPassword,
  type Role,
} from "@/lib/auth";

export async function signOut() {
  const user = await getCurrentUser();
  await destroySession();
  if (user) await audit(user.id, "logout", user.email);
  redirect("/admin/login");
}

/* ── TEAM ─────────────────────────────────────────────────────────────
 * Only an admin reaches any of these. requireAdmin() throws rather than
 * returning a flag so a missing check is a crash, not a silent bypass.
 */

export type TeamState = { error?: string; ok?: string };

function randomPassword(): string {
  // Human-typeable: no l/I/1/O/0, since this gets read off a screen and
  // typed into a phone by the person receiving it.
  const alphabet = "abcdefghjkmnpqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint32Array(14);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function createUser(
  _prev: TeamState,
  formData: FormData,
): Promise<TeamState> {
  const admin = await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "editor") as Role;

  if (!email.includes("@")) return { error: "Enter a valid email address." };
  if (!name) return { error: "Enter the person's name." };
  if (role !== "admin" && role !== "editor") return { error: "Pick a role." };

  const existing = await queryOne(`SELECT id FROM users WHERE lower(email) = $1`, [email]);
  if (existing) return { error: "Someone already has that email address." };

  const temporary = randomPassword();

  await query(
    `INSERT INTO users (email, name, password_hash, role, must_change_password, created_by)
     VALUES ($1, $2, $3, $4, true, $5)`,
    [email, name, await hashPassword(temporary), role, admin.id],
  );
  await audit(admin.id, "user.created", email, { role });

  revalidatePath("/admin/users");

  // The password is returned once, here, and never stored in readable
  // form. There is no "resend" — an admin resets it, which issues a new
  // one. That is deliberate: a password that can be retrieved later is a
  // password sitting in a database in plain text.
  return {
    ok:
      `${name} can now sign in as ${email} with the temporary password ` +
      `${temporary} — they will be asked to change it immediately. ` +
      `This password is shown once; if it is lost, reset it from the team list.`,
  };
}

export async function setUserRole(userId: string, role: Role) {
  const admin = await requireAdmin();
  if (userId === admin.id) throw new Error("You cannot change your own role.");
  if (role !== "admin" && role !== "editor") throw new Error("Unknown role.");

  await query(`UPDATE users SET role = $2 WHERE id = $1`, [userId, role]);
  await audit(admin.id, "user.role_changed", userId, { role });
  revalidatePath("/admin/users");
}

export async function setUserDisabled(userId: string, disabled: boolean) {
  const admin = await requireAdmin();
  if (userId === admin.id) throw new Error("You cannot disable your own account.");

  await transaction(async (q) => {
    await q(`UPDATE users SET disabled_at = $2 WHERE id = $1`, [
      userId,
      disabled ? new Date() : null,
    ]);
    // Disabling has to end the sessions they already hold, or it does
    // nothing until their cookie happens to expire.
    if (disabled) await q(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
  });

  await audit(admin.id, disabled ? "user.disabled" : "user.enabled", userId);
  revalidatePath("/admin/users");
}

export async function resetUserPassword(userId: string): Promise<string> {
  const admin = await requireAdmin();
  const temporary = randomPassword();

  await transaction(async (q) => {
    await q(
      `UPDATE users SET password_hash = $2, must_change_password = true WHERE id = $1`,
      [userId, await hashPassword(temporary)],
    );
    await q(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
  });

  await audit(admin.id, "user.password_reset", userId);
  revalidatePath("/admin/users");
  return temporary;
}

/* ── OWN PASSWORD ─────────────────────────────────────────────────────
 * Any signed-in user, admin or editor. Requires the current password even
 * though they are already authenticated, so a walked-away-from laptop
 * cannot be used to lock the real owner out.
 */
export async function changeOwnPassword(
  _prev: TeamState,
  formData: FormData,
): Promise<TeamState> {
  const user = await requireUser();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next !== confirm) return { error: "The two new passwords do not match." };

  const problem = passwordProblem(next);
  if (problem) return { error: problem };

  const row = await queryOne<{ password_hash: string }>(
    `SELECT password_hash FROM users WHERE id = $1`,
    [user.id],
  );
  if (!row || !(await verifyPassword(current, row.password_hash))) {
    return { error: "Your current password is not right." };
  }
  if (await verifyPassword(next, row.password_hash)) {
    return { error: "Choose a password you have not just been using." };
  }

  await query(
    `UPDATE users SET password_hash = $2, must_change_password = false WHERE id = $1`,
    [user.id, await hashPassword(next)],
  );
  await audit(user.id, "password.changed", user.email);

  redirect("/admin");
}
