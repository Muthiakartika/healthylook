"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { runImport, type ImportState } from "./actions";

function Submit({ overwrite }: { overwrite: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-8 inline-flex items-center rounded-brand bg-primary-strong px-6 py-3 font-sans text-caption font-semibold uppercase tracking-caps-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending
        ? "Importing…"
        : overwrite
          ? "Replace all content"
          : "Import content"}
    </button>
  );
}

export default function ImportForm({
  alreadyHasContent,
}: {
  alreadyHasContent: boolean;
}) {
  const [state, formAction] = useActionState<ImportState, FormData>(runImport, {});
  const [overwrite, setOverwrite] = useState(false);

  return (
    <form action={formAction}>
      {alreadyHasContent && (
        <>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="overwrite"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
              className="mt-1 accent-[var(--color-primary-strong,#8a6d3b)]"
            />
            <span>
              <span className="font-sans text-copy text-ink">
                Replace content that already exists
              </span>
              <span className="mt-1 block measure font-sans text-micro leading-relaxed text-muted">
                Throws away every edit made in this dashboard and puts the source
                files back. The replaced versions stay restorable per document,
                but there is no single undo for the whole import.
              </span>
            </span>
          </label>

          {overwrite && (
            <label className="mt-6 block">
              <span className="font-sans text-caption uppercase tracking-caps text-muted">
                Type OVERWRITE to confirm
              </span>
              <input
                name="confirm"
                autoComplete="off"
                className="mt-2 w-full max-w-xs border-b border-hairline bg-transparent py-2.5 font-mono text-copy text-ink outline-none focus:border-primary"
              />
            </label>
          )}
        </>
      )}

      {state.error && (
        <p
          role="alert"
          className="mt-6 border-l-2 border-primary bg-wash py-3 pl-4 font-sans text-label leading-relaxed text-ink"
        >
          {state.error}
        </p>
      )}

      {state.rows && (
        <div role="status" className="mt-6 border-y border-hairline py-4">
          <p className="font-sans text-label text-ink">Import finished.</p>
          <ul className="mt-3 flex flex-col gap-1">
            {state.rows.map((row) => (
              <li key={row} className="font-mono text-[13px] text-text-secondary">
                {row}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Submit overwrite={overwrite} />
    </form>
  );
}
