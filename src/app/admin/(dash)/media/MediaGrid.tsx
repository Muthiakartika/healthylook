"use client";

import { useState, useTransition } from "react";
import { deleteMedia, updateAlt, type MediaRow } from "./actions";

function kb(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

function Card({ item, canDelete }: { item: MediaRow; canDelete: boolean }) {
  const [pending, start] = useTransition();
  const [alt, setAlt] = useState(item.alt);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <li className="flex flex-col border border-hairline bg-paper">
      {/* A plain <img>, not next/image: these are already-optimised uploads
          shown at thumbnail size in a staff-only screen, and routing them
          through the optimiser would bill a transformation per image per
          visit to this page for no visible gain. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt={item.alt || item.filename}
        loading="lazy"
        className="aspect-[4/3] w-full bg-wash object-cover"
      />

      <div className="flex flex-1 flex-col p-4">
        <p className="font-sans text-label text-ink [word-break:break-word]">
          {item.filename}
        </p>
        <p className="mt-1 font-sans text-micro text-muted">
          {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
          {kb(item.size_bytes)}
        </p>

        <label className="mt-4 block">
          <span className="font-sans text-micro uppercase tracking-caps text-muted">
            Alt text
          </span>
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={() => {
              if (alt === item.alt) return;
              start(async () => {
                try {
                  await updateAlt(item.id, alt);
                } catch {
                  setError("Could not save the alt text.");
                }
              });
            }}
            placeholder="What the photo shows"
            className="mt-1 w-full border-b border-hairline bg-transparent py-1.5 font-sans text-label text-ink outline-none focus:border-primary"
          />
          <span className="mt-1.5 block font-sans text-micro leading-relaxed text-muted">
            Describe it for someone who cannot see it. Skip &ldquo;photo
            of&rdquo; — a screen reader already says it is an image.
          </span>
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(item.url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary"
          >
            {copied ? "Copied" : "Copy link"}
          </button>

          {canDelete &&
            (confirming ? (
              <>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      try {
                        await deleteMedia(item.id);
                      } catch {
                        setError("Could not delete this image.");
                        setConfirming(false);
                      }
                    })
                  }
                  className="font-sans text-micro uppercase tracking-caps text-primary-strong disabled:opacity-50"
                >
                  {pending ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="font-sans text-micro uppercase tracking-caps text-muted"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary"
              >
                Delete
              </button>
            ))}
        </div>

        {confirming && (
          <p className="mt-3 font-sans text-micro leading-relaxed text-text-secondary">
            Any page still using this image will show a broken picture. The
            dashboard cannot tell which pages those are.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 font-sans text-micro text-primary-strong">
            {error}
          </p>
        )}
      </div>
    </li>
  );
}

export default function MediaGrid({
  items,
  canDelete,
}: {
  items: MediaRow[];
  canDelete: boolean;
}) {
  if (items.length === 0) {
    return (
      <p className="mt-8 font-sans text-label text-text-secondary">
        Nothing uploaded yet. Anything added here can be picked from the image
        fields on treatments, articles and pages.
      </p>
    );
  }

  return (
    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} item={item} canDelete={canDelete} />
      ))}
    </ul>
  );
}
