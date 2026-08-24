"use client";

import { useState, useTransition } from "react";
import { restoreRevisionAction } from "../actions";

/**
 * Previous versions of this document, newest first.
 *
 * A restore is confirmed rather than immediate: the button is next to
 * ordinary navigation, and the person clicking it is often looking for
 * "what did this used to say" rather than "put it back".
 */
export default function RevisionList({
  collectionId,
  slug,
  revisions,
}: {
  collectionId: string;
  slug: string;
  revisions: { id: string; createdAt: string; editor: string | null }[];
}) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <section className="mt-16 max-w-3xl">
      <h2 className="font-sans text-h4 text-ink">Earlier versions</h2>
      <p className="mt-3 font-sans text-label leading-relaxed text-text-secondary">
        Every save keeps what was there before. Restoring is itself a save, so
        it can be undone the same way.
      </p>

      <ul className="mt-6 flex flex-col divide-y divide-hairline border-y border-hairline">
        {revisions.map((revision) => (
          <li
            key={revision.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3.5"
          >
            <span className="font-sans text-label text-text-secondary">
              {new Date(revision.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {revision.editor && (
                <span className="ml-2 text-muted">· {revision.editor}</span>
              )}
            </span>

            {confirming === revision.id ? (
              <span className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      await restoreRevisionAction(collectionId, slug, revision.id);
                      setConfirming(null);
                    })
                  }
                  className="font-sans text-micro uppercase tracking-caps text-primary-strong disabled:opacity-50"
                >
                  {pending ? "Restoring…" : "Yes, restore this"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className="font-sans text-micro uppercase tracking-caps text-muted"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(revision.id)}
                className="font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary"
              >
                Restore
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
