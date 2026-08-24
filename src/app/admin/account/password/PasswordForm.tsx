"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changeOwnPassword, type TeamState } from "../../actions";

const inputClass =
  "mt-2 w-full border-b border-hairline bg-transparent py-2.5 font-sans text-copy text-ink outline-none transition-colors focus:border-primary";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-8 inline-flex w-full items-center justify-center rounded-brand bg-primary-strong px-6 py-3.5 font-sans text-caption font-semibold uppercase tracking-caps-wide text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save password"}
    </button>
  );
}

export default function PasswordForm({ forced }: { forced: boolean }) {
  const [state, formAction] = useActionState<TeamState, FormData>(changeOwnPassword, {});

  return (
    <form action={formAction}>
      <label className="block">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          {forced ? "Temporary password" : "Current password"}
        </span>
        <input
          name="current"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className={inputClass}
        />
      </label>

      <label className="mt-7 block">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          New password
        </span>
        <input
          name="next"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          className={inputClass}
        />
        <span className="mt-2 block font-sans text-micro text-muted">
          At least 10 characters. A short phrase you can remember beats a short
          word with symbols in it.
        </span>
      </label>

      <label className="mt-7 block">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          Repeat new password
        </span>
        <input
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          className={inputClass}
        />
      </label>

      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="mt-6 border-l-2 border-primary bg-wash py-3 pl-4 font-sans text-label leading-relaxed text-ink"
        >
          {state.error}
        </p>
      )}

      <Submit />

      {!forced && (
        <Link
          href="/admin"
          className="mt-5 block text-center font-sans text-caption uppercase tracking-caps text-muted transition-colors hover:text-primary"
        >
          Back to the dashboard
        </Link>
      )}
    </form>
  );
}
