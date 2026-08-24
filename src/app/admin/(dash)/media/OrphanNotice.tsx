"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteOrphans, findOrphans } from "./actions";

/**
 * Blobs in storage with no row in the library.
 *
 * They happen when a browser is closed in the moment between an upload
 * finishing and the action that records it running. Nothing else in the
 * dashboard can see them, and they are still billed, so this is the only
 * place they surface.
 *
 * Checked on mount rather than on the server, because listing the whole
 * blob store on every visit to this page would make an ordinary page load
 * wait on a third-party API for something that is almost always empty.
 */
export default function OrphanNotice() {
  const [orphans, setOrphans] = useState<{ url: string; size: number }[] | null>(null);
  const [pending, start] = useTransition();
  const [cleared, setCleared] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    findOrphans()
      .then((found) => {
        if (alive) setOrphans(found);
      })
      .catch(() => {
        // A failed check is not worth an error banner on a page whose job
        // is something else.
        if (alive) setOrphans([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (cleared !== null) {
    return (
      <p role="status" className="mt-8 font-sans text-label text-text-secondary">
        Removed {cleared} unreferenced {cleared === 1 ? "file" : "files"} from storage.
      </p>
    );
  }

  if (!orphans || orphans.length === 0) return null;

  const total = orphans.reduce((sum, o) => sum + o.size, 0);

  return (
    <div className="mt-8 max-w-2xl border-l-2 border-primary bg-wash py-5 pl-5 pr-4">
      <h2 className="font-sans text-copy-lg font-medium text-ink">
        {orphans.length} uploaded {orphans.length === 1 ? "file is" : "files are"} not
        in the library
      </h2>
      <p className="mt-3 font-sans text-label leading-relaxed text-text-secondary">
        They finished uploading but were never recorded — usually a tab closed
        mid-upload. They take up {Math.round(total / 1024)} KB of storage and
        appear nowhere on the site.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const n = await deleteOrphans();
            setCleared(n);
          })
        }
        className="mt-5 font-sans text-caption uppercase tracking-caps text-primary-strong transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Removing…" : "Remove them"}
      </button>
    </div>
  );
}
