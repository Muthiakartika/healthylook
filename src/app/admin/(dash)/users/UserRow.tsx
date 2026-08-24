"use client";

import { useState, useTransition } from "react";
import {
  resetUserPassword,
  setUserDisabled,
  setUserRole,
} from "../../actions";
import type { Role, User } from "@/lib/auth";

export default function UserRow({
  user,
  isSelf,
}: {
  user: User & { created_by_name?: string | null };
  isSelf: boolean;
}) {
  const [pending, start] = useTransition();
  const [temporary, setTemporary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const disabled = Boolean(user.disabled_at);

  const run = (fn: () => Promise<unknown>) =>
    start(async () => {
      setError(null);
      try {
        await fn();
      } catch (e) {
        // Server actions reject with a plain Error; surfacing its message
        // beats a silent no-op when an admin tries to demote themselves.
        setError(e instanceof Error ? e.message : "That did not work.");
      }
    });

  return (
    <li className={`py-5 ${disabled ? "opacity-55" : ""}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div>
          <span className="font-sans text-copy text-ink">{user.name}</span>
          {isSelf && (
            <span className="ml-2 font-sans text-micro uppercase tracking-caps text-primary-strong">
              you
            </span>
          )}
          <span className="mt-0.5 block font-sans text-label text-text-secondary">
            {user.email}
          </span>
        </div>

        <div className="text-right font-sans text-caption uppercase tracking-caps text-muted">
          {disabled
            ? "Disabled"
            : user.last_login_at
              ? `Last in ${new Date(user.last_login_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}`
              : "Never signed in"}
          {user.must_change_password && !disabled && (
            <span className="mt-0.5 block text-primary-strong">
              Temporary password
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {/* Role: a select rather than a toggle, because there are two now
            and a third would otherwise mean rebuilding the control. */}
        <label className="flex items-center gap-2">
          <span className="font-sans text-micro uppercase tracking-caps text-muted">
            Role
          </span>
          <select
            value={user.role}
            disabled={isSelf || pending}
            onChange={(e) => run(() => setUserRole(user.id, e.target.value as Role))}
            className="border-b border-hairline bg-transparent py-1 font-sans text-label text-ink outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(async () => setTemporary(await resetUserPassword(user.id)))
          }
          className="font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary disabled:opacity-50"
        >
          Reset password
        </button>

        <button
          type="button"
          disabled={isSelf || pending}
          onClick={() => run(() => setUserDisabled(user.id, !disabled))}
          className="font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary disabled:opacity-50"
        >
          {disabled ? "Re-enable" : "Disable"}
        </button>
      </div>

      {temporary && (
        <p
          role="status"
          className="mt-4 border-l-2 border-primary bg-wash py-3 pl-4 pr-3 font-sans text-label leading-relaxed text-ink"
        >
          New temporary password for {user.name}:{" "}
          <strong className="[word-break:break-all]">{temporary}</strong> — shown
          once. They will be asked to change it when they sign in, and their
          existing sessions have been ended.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 font-sans text-label text-primary-strong">
          {error}
        </p>
      )}
    </li>
  );
}
