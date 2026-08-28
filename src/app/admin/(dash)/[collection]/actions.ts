"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { audit, requireUser } from "@/lib/auth";
import { getCollection, type Field } from "@/lib/collections";
import { deleteDocument, getDocument, saveDocument } from "@/lib/content";

export type SaveState = { error?: string; ok?: string };

/**
 * Turn one submitted form field back into the value the site's types
 * expect.
 *
 * ── WHY EMPTY MEANS ABSENT ────────────────────────────────────────────
 * An untouched text input submits "". Storing that would put
 * `treatmentTime: ""` on a treatment, and the site tests these fields for
 * truthiness to decide whether to render a row at all — an empty string
 * would render an empty row rather than "Varies — ask your doctor". So an
 * empty field is dropped from the document entirely, which is what
 * "undefined" meant in the source files.
 */
function parseField(field: Field, raw: FormDataEntryValue | null): unknown {
  const value = typeof raw === "string" ? raw : "";

  switch (field.type) {
    case "number": {
      if (!value.trim()) return undefined;
      const n = Number(value.replace(/[^\d.-]/g, ""));
      return Number.isFinite(n) ? n : undefined;
    }
    case "boolean":
      return value === "on" || value === "true";
    case "stringList":
      return value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    // The block editor submits the same JSON string the raw field did, so
    // there is one parse and one validation path rather than two that can
    // disagree about what a valid body is.
    case "articleBlocks":
    case "json": {
      if (!value.trim()) return undefined;
      // Throws on bad JSON; the caller turns that into a form error rather
      // than a 500, because a mistyped bracket is an ordinary editing
      // mistake, not a fault.
      return JSON.parse(value);
    }
    default:
      return value.trim() ? value : undefined;
  }
}

export async function saveDocumentAction(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const user = await requireUser();

  const collectionId = String(formData.get("__collection") ?? "");
  const originalSlug = String(formData.get("__slug") ?? "");
  const status = String(formData.get("__status") ?? "published");

  const collection = getCollection(collectionId);
  if (!collection) return { error: "Unknown collection." };
  if (status !== "draft" && status !== "published") return { error: "Unknown status." };

  const data: Record<string, unknown> = {};
  for (const field of collection.fields) {
    let parsed: unknown;
    try {
      parsed = parseField(field, formData.get(field.name));
    } catch {
      return {
        error: `“${field.label}” is not valid JSON. Check for a missing comma, bracket or quote.`,
      };
    }
    if (field.required && (parsed === undefined || parsed === "")) {
      return { error: `“${field.label}” cannot be empty.` };
    }
    if (parsed !== undefined) data[field.name] = parsed;
  }

  // The slug is what the row is keyed on. It comes from a field where the
  // collection has one, and falls back to the row's existing slug so a
  // collection without an editable slug (pages) still saves.
  const slug = String(data.slug ?? data.id ?? originalSlug).trim();
  if (!slug) return { error: "This needs a slug before it can be saved." };

  // Renaming a slug must not silently overwrite a different document.
  if (slug !== originalSlug) {
    const clash = await getDocument(collectionId, slug);
    if (clash) {
      return { error: `Another ${collection.singular} already uses the slug “${slug}”.` };
    }
  }

  await saveDocument({ collection: collectionId, slug, data, status, userId: user.id });

  // A rename leaves the old row behind, so remove it once the new one is
  // safely written — in that order, never the reverse.
  if (originalSlug && slug !== originalSlug) {
    await deleteDocument(collectionId, originalSlug);
  }

  await audit(user.id, "content.saved", `${collectionId}/${slug}`, { status });
  revalidatePath(`/admin/${collectionId}`);

  if (slug !== originalSlug) {
    redirect(`/admin/${collectionId}/${encodeURIComponent(slug)}?saved=1`);
  }
  return { ok: status === "published" ? "Saved and published." : "Saved as a draft." };
}

export async function deleteDocumentAction(collectionId: string, slug: string) {
  const user = await requireUser();
  const collection = getCollection(collectionId);
  if (!collection?.canDelete) throw new Error("This collection cannot be deleted from.");

  await deleteDocument(collectionId, slug);
  await audit(user.id, "content.deleted", `${collectionId}/${slug}`);
  revalidatePath(`/admin/${collectionId}`);
  redirect(`/admin/${collectionId}`);
}

/**
 * Row- and bulk-delete from the list view share this one path (a single
 * slug is just a one-item selection) rather than reusing
 * `deleteDocumentAction` above, which redirects — right for a delete
 * button on the edit page it navigates away from, wrong here: deleting a
 * row from the list should leave you on the list.
 */
export async function bulkDeleteAction(collectionId: string, slugs: string[]): Promise<void> {
  const user = await requireUser();
  const collection = getCollection(collectionId);
  if (!collection?.canDelete) throw new Error("This collection cannot be deleted from.");

  for (const slug of slugs) {
    await deleteDocument(collectionId, slug);
    await audit(user.id, "content.deleted", `${collectionId}/${slug}`);
  }
  revalidatePath(`/admin/${collectionId}`);
}

export async function bulkSetStatusAction(
  collectionId: string,
  slugs: string[],
  status: "draft" | "published",
): Promise<void> {
  const user = await requireUser();
  const collection = getCollection(collectionId);
  if (!collection) throw new Error("Unknown collection.");

  for (const slug of slugs) {
    const doc = await getDocument(collectionId, slug);
    if (!doc) continue;
    await saveDocument({ collection: collectionId, slug, data: doc.data, status, userId: user.id });
    await audit(user.id, "content.saved", `${collectionId}/${slug}`, { status, bulk: true });
  }
  revalidatePath(`/admin/${collectionId}`);
}

export async function restoreRevisionAction(
  collectionId: string,
  slug: string,
  revisionId: string,
) {
  const user = await requireUser();
  const { queryOne } = await import("@/lib/db");

  const revision = await queryOne<{ data: Record<string, unknown>; status: string }>(
    `SELECT r.data, r.status FROM revisions r
       JOIN documents d ON d.id = r.document_id
      WHERE r.id = $1 AND d.collection = $2 AND d.slug = $3`,
    [revisionId, collectionId, slug],
  );
  if (!revision) throw new Error("That version no longer exists.");

  // Restoring is itself a save, so the version being replaced is kept too
  // — undoing a restore is the same one click as the restore was.
  await saveDocument({
    collection: collectionId,
    slug,
    data: revision.data,
    status: revision.status === "draft" ? "draft" : "published",
    userId: user.id,
  });
  await audit(user.id, "content.restored", `${collectionId}/${slug}`, { revisionId });
  revalidatePath(`/admin/${collectionId}/${slug}`);
}
