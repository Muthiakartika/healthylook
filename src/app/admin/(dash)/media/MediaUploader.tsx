"use client";

import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { recordUpload } from "./actions";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MAX_BYTES = 12 * 1024 * 1024;

/** Reads the pixel dimensions before upload, so the library can show them. */
function readDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    // A file the browser cannot decode is not worth failing the upload
    // over — the dimensions are informational.
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export default function MediaUploader({ enabled }: { enabled: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);

    for (const file of Array.from(files)) {
      if (file.size > MAX_BYTES) {
        setError(
          `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 12 MB — ` +
            `export it smaller and try again.`,
        );
        continue;
      }

      setBusy(file.name);
      try {
        const dimensions = await readDimensions(file);

        // Straight from the browser to Blob storage. The server only signs
        // the token; the bytes never touch a serverless function, which is
        // what keeps this working for files over 4.5 MB.
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/media/upload",
        });

        await recordUpload({
          url: blob.url,
          pathname: blob.pathname,
          filename: file.name,
          contentType: file.type,
          size: file.size,
          width: dimensions?.width ?? null,
          height: dimensions?.height ?? null,
        });
      } catch (e) {
        setError(
          e instanceof Error ? `${file.name}: ${e.message}` : `${file.name} did not upload.`,
        );
      } finally {
        setBusy(null);
      }
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

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-hairline bg-paper px-6 py-10 text-center transition-colors hover:border-primary">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <span className="font-sans text-copy text-ink">
          {busy ? `Uploading ${busy}…` : "Choose images to upload"}
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
