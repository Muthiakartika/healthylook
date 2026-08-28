import { upload } from "@vercel/blob/client";
import { recordUpload } from "./actions";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
export const IMAGE_MAX_BYTES = 12 * 1024 * 1024;

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

/**
 * Validates, uploads straight to Blob storage and records the row — the
 * same three steps every upload surface (the media library, an image
 * field on a document) needs, kept in one place so they can't drift.
 */
export async function uploadImageFile(file: File): Promise<{ url: string } | { error: string }> {
  if (!file.type.startsWith("image/")) {
    return { error: `${file.name} is not an image.` };
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return {
      error:
        `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 12 MB — ` +
        `export it smaller and try again.`,
    };
  }

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

    return { url: blob.url };
  } catch (e) {
    return { error: e instanceof Error ? `${file.name}: ${e.message}` : `${file.name} did not upload.` };
  }
}
