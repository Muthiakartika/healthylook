"use client";

import { useRef, useState, useTransition, type DragEvent } from "react";
import { IMAGE_ACCEPT, uploadImageFile } from "./uploadImage";

export default function MediaUploader({ enabled }: { enabled: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [, startTransition] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);

    for (const file of Array.from(files)) {
      setBusy(file.name);
      const result = await uploadImageFile(file);
      if ("error" in result) setError(result.error);
      setBusy(null);
    }

    if (inputRef.current) inputRef.current.value = "";
    startTransition(() => {});
  }

  if (!enabled) {
    return (
      <div className="border-l-2 border-primary bg-wash py-5 pl-5 pr-4">
        <h2 className="font-sans text-copy-lg font-medium text-ink">
          Uploading is not switched on
        </h2>
        <p className="mt-3 measure font-sans text-label leading-relaxed text-text-secondary">
          Create a Blob store in the Vercel dashboard under Storage → Blob. It
          sets <code className="text-ink">BLOB_READ_WRITE_TOKEN</code>{" "}
          automatically on deploy; copy the same value into{" "}
          <code className="text-ink">.env.local</code> to upload while working
          locally. Images already in the site&rsquo;s own folder can still be
          used in the meantime.
        </p>
      </div>
    );
  }

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    void handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? "border-primary bg-wash" : "border-hairline bg-paper hover:border-primary"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <span className="font-sans text-copy text-ink">
          {busy ? `Uploading ${busy}…` : "Drag images here, or click to choose"}
        </span>
        <span className="mt-2 font-sans text-micro text-muted">
          JPEG, PNG, WebP or AVIF · up to 12 MB each · several at once is fine
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="mt-5 border-l-2 border-primary bg-wash py-3 pl-4 font-sans text-label leading-relaxed text-ink"
        >
          {error}
        </p>
      )}
    </div>
  );
}
