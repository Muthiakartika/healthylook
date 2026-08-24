"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";

function SubmitButton() {
  // useFormStatus has to live in a child of the <form>, not beside it —
  // it reads the status of the nearest form ancestor.
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-8 inline-flex w-full items-center justify-center rounded-brand bg-primary-strong px-6 py-3.5 font-sans text-caption font-semibold uppercase tracking-caps-wide text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          Email
        </span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          className="mt-2 w-full border-b border-hairline bg-transparent py-2.5 font-sans text-copy text-ink outline-none transition-colors focus:border-primary"
        />
      </label>

      <label className="mt-7 block">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border-b border-hairline bg-transparent py-2.5 font-sans text-copy text-ink outline-none transition-colors focus:border-primary"
        />
      </label>

      {state.error && (
        /* aria-live so a screen reader announces the failure. Without it
           the only signal is a colour change the user cannot perceive. */
        <p
          role="alert"
          aria-live="polite"
          className="mt-6 border-l-2 border-primary bg-wash py-3 pl-4 font-sans text-label leading-relaxed text-ink"
        >
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
