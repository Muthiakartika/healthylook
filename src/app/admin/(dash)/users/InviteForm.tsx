"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createUser, type TeamState } from "../../actions";

const inputClass =
  "mt-2 w-full border-b border-hairline bg-transparent py-2.5 font-sans text-copy text-ink outline-none transition-colors focus:border-primary";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-8 inline-flex w-full items-center justify-center rounded-brand bg-primary-strong px-6 py-3 font-sans text-caption font-semibold uppercase tracking-caps-wide text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Creating…" : "Create account"}
    </button>
  );
}

export default function InviteForm() {
  const [state, formAction] = useActionState<TeamState, FormData>(createUser, {});

  return (
    <form action={formAction}>
      <label className="block">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          Name
        </span>
        <input name="name" type="text" required className={inputClass} />
      </label>

      <label className="mt-6 block">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="off"
          className={inputClass}
        />
      </label>

      <fieldset className="mt-7">
        <legend className="font-sans text-caption uppercase tracking-caps text-muted">
          Role
        </legend>
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex items-start gap-3">
            <input
              type="radio"
              name="role"
              value="editor"
              defaultChecked
              className="mt-1 accent-[var(--color-primary-strong,#8a6d3b)]"
            />
            <span>
              <span className="font-sans text-copy text-ink">Editor</span>
              <span className="mt-0.5 block font-sans text-micro leading-relaxed text-muted">
                Edits all content. Cannot add people or change roles.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="radio"
              name="role"
              value="admin"
              className="mt-1 accent-[var(--color-primary-strong,#8a6d3b)]"
            />
            <span>
              <span className="font-sans text-copy text-ink">Admin</span>
              <span className="mt-0.5 block font-sans text-micro leading-relaxed text-muted">
                Everything an editor can do, plus this page.
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      {state.error && (
        <p
          role="alert"
          className="mt-6 border-l-2 border-primary bg-wash py-3 pl-4 font-sans text-label leading-relaxed text-ink"
        >
          {state.error}
        </p>
      )}

      {state.ok && (
        /* The temporary password appears here and nowhere else, so it is
           set in a monospaced, selectable block rather than run into the
           sentence — it has to be copied accurately by a human. */
        <p
          role="status"
          className="mt-6 border-l-2 border-primary bg-wash py-4 pl-4 pr-3 font-sans text-label leading-relaxed text-ink [word-break:break-word]"
        >
          {state.ok}
        </p>
      )}

      <Submit />
    </form>
  );
}
