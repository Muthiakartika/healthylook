"use server";

import { revalidatePath } from "next/cache";
import { del, list } from "@vercel/blob";
import { query, queryOne } from "@/lib/db";
import { audit, requireUser, requireAdmin } from "@/lib/auth";

export type MediaRow = {
  id: string;
  url: string;
  pathname: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt: string;
  created_at: string;
  uploaded_by: string | null;
};

/**
 * Records an upload that has already landed in Blob storage.
 *
 * Called by the browser once `upload()` resolves, rather than from the
 * `onUploadCompleted` webhook — see the note in the upload route for why.
 */
export async function recordUpload(input: {
  url: string;
  pathname: string;
  filename: string;
  contentType: string;
  size: number;
  width: number | null;
  height: number | null;
}): Promise<void> {
  const user = await requireUser();

  await query(
    `INSERT INTO media (url, pathname, filename, content_type, size_bytes, width, height, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      input.url,
      input.pathname,
      input.filename,
      input.contentType,
      input.size,
      input.width,
      input.height,
      user.id,
    ],
  );
  await audit(user.id, "media.uploaded", input.pathname, { size: input.size });
  revalidatePath("/admin/media");
}

export async function updateAlt(id: string, alt: string): Promise<void> {
  await requireUser();
  await query(`UPDATE media SET alt = $2 WHERE id = $1`, [id, alt.slice(0, 300)]);
  revalidatePath("/admin/media");
}

/**
 * Removes the blob and its row together.
 *
 * ── ORDER MATTERS ─────────────────────────────────────────────────────
 * The blob goes first. If that fails, the row survives and the image is
 * still in the library to try again. Doing it the other way round on a
 * failed delete would leave a file nobody can see and nobody can remove.
 *
 * This does NOT check whether the image is still used on a page. A
 * treatment referencing a deleted URL renders a broken image, so deleting
 * is admin-only and the screen says what it cannot check.
 */
export async function deleteMedia(id: string): Promise<void> {
  const admin = await requireAdmin();

  const row = await queryOne<{ pathname: string; url: string }>(
    `SELECT pathname, url FROM media WHERE id = $1`,
    [id],
  );
  if (!row) return;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await del(row.url);
  }
  await query(`DELETE FROM media WHERE id = $1`, [id]);
  await audit(admin.id, "media.deleted", row.pathname);
  revalidatePath("/admin/media");
}

/**
 * Blobs with no row in the library — the residue of an upload whose
 * browser closed before it could be recorded. They cost storage and are
 * invisible everywhere else, so this is the only place they can be found.
 */
export async function findOrphans(): Promise<{ url: string; size: number }[]> {
  await requireAdmin();
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];

  const { blobs } = await list();
  const known = new Set(
    (await query<{ url: string }>(`SELECT url FROM media`)).map((r) => r.url),
  );
  return blobs
    .filter((blob) => !known.has(blob.url))
    .map((blob) => ({ url: blob.url, size: blob.size }));
}

export async function deleteOrphans(): Promise<number> {
  const admin = await requireAdmin();
  const orphans = await findOrphans();
  if (orphans.length === 0) return 0;

  await del(orphans.map((o) => o.url));
  await audit(admin.id, "media.orphans_cleared", undefined, { count: orphans.length });
  revalidatePath("/admin/media");
  return orphans.length;
}
