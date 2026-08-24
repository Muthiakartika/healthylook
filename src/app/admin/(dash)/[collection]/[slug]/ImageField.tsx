"use client";

import { useState } from "react";

/**
 * An image field: type a path, or pick from what has been uploaded.
 *
 * ── WHY THE TEXT INPUT STAYS ──────────────────────────────────────────
 * Most images on this site are not uploads — they are the clinic's own
 * photographs in /public/images, referenced by path. A picker that only
 * offered the library would make those unreachable, so the stored value is
 * always a plain string and the picker just writes into it.
 *
 * The preview is deliberately un-optimised (<img>, not next/image): this is
 * a staff screen, and routing an admin thumbnail through the image
 * optimiser bills a transformation for something nobody outside the clinic
 * will ever see.
 */
export default function ImageField({
  name,
  label,
  initial,
  help,
  library,
}: {
  name: string;
  label: string;
  initial: string;
  help?: string;
  library: { url: string; filename: string; alt: string }[];
}) {
  const [value, setValue] = useState(initial);
  const [picking, setPicking] = useState(false);

  return (
    <div>
      <label className="block">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          {label}
        </span>
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="/images/treatments/example.jpg"
          className="mt-2 w-full border-b border-hairline bg-transparent py-2.5 font-sans text-copy text-ink outline-none transition-colors focus:border-primary"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        {library.length > 0 && (
          <button
            type="button"
            onClick={() => setPicking((p) => !p)}
            className="font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary"
          >
            {picking ? "Close library" : `Choose from ${library.length} uploaded`}
          </button>
        )}
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary"
          >
            Clear
          </button>
        )}
      </div>

      {help && (
        <span className="mt-2 block measure font-sans text-micro leading-relaxed text-muted">
          {help}
        </span>
      )}

      {value && !picking && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-4 h-28 w-auto border border-hairline bg-wash object-cover"
          onError={(e) => {
            // A path that resolves to nothing is a typo the editor should
            // see immediately, not after publishing.
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
          onLoad={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "";
          }}
        />
      )}

      {picking && (
        <ul className="mt-4 grid max-h-80 grid-cols-3 gap-3 overflow-y-auto border border-hairline bg-paper p-3 sm:grid-cols-4">
          {library.map((item) => (
            <li key={item.url}>
              <button
                type="button"
                onClick={() => {
                  setValue(item.url);
                  setPicking(false);
                }}
                title={item.filename}
                className={`block w-full border transition-colors ${
                  value === item.url ? "border-primary" : "border-transparent hover:border-hairline"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  loading="lazy"
                  className="aspect-square w-full bg-wash object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
