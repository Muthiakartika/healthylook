"use client";

import { useState, type DragEvent } from "react";
import { IMAGE_ACCEPT, uploadImageFile } from "../../media/uploadImage";

/**
 * An image field: drop or upload a file, type a path, or pick from what
 * has been uploaded already.
 *
 * ── WHY THE TEXT INPUT STAYS ──────────────────────────────────────────
 * Most images on this site are not uploads — they are the clinic's own
 * photographs in /public/images, referenced by path. A picker that only
 * offered the library would make those unreachable, so the stored value is
 * always a plain string and the picker/dropzone just write into it.
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
  uploadsEnabled,
}: {
  name: string;
  label: string;
  initial: string;
  help?: string;
  library: { url: string; filename: string; alt: string }[];
  uploadsEnabled: boolean;
}) {
  const [value, setValue] = useState(initial);
  const [picking, setPicking] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(file.name);
    const result = await uploadImageFile(file);
    setUploading(null);

    if ("error" in result) setUploadError(result.error);
    else setValue(result.url);
  }

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

      {uploadsEnabled && (
        <label
          onDragOver={(e: DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e: DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setDragOver(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={`mt-3 flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-6 text-center transition-colors ${
            dragOver ? "border-primary bg-wash" : "border-hairline bg-paper hover:border-primary"
          }`}
        >
          <input
            type="file"
            accept={IMAGE_ACCEPT}
            className="sr-only"
            onChange={(e) => void handleFiles(e.target.files)}
          />
          <span className="font-sans text-label text-ink">
            {uploading ? `Uploading ${uploading}…` : "Drop an image here, or click to upload one"}
          </span>
          <span className="mt-1 font-sans text-micro text-muted">
            JPEG, PNG, WebP or AVIF · up to 12 MB
          </span>
        </label>
      )}

      {uploadError && (
        <p role="alert" className="mt-3 font-sans text-micro leading-relaxed text-primary-strong">
          {uploadError}
        </p>
      )}

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
