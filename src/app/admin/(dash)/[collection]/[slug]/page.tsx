import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, documentTitle } from "@/lib/collections";
import { getDocument, documentRevisions } from "@/lib/content";
import { query } from "@/lib/db";
import DocumentForm from "./DocumentForm";
import RevisionList from "./RevisionList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection, slug } = await params;
  const meta = getCollection(collection);
  return { title: slug === "new" ? `New ${meta?.singular ?? "item"}` : slug };
}

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection: id, slug: rawSlug } = await params;
  const collection = getCollection(id);
  if (!collection) notFound();

  const slug = decodeURIComponent(rawSlug);
  const isNew = slug === "new";

  if (isNew && !collection.canCreate) notFound();

  const doc = isNew ? null : await getDocument(id, slug);
  if (!isNew && !doc) notFound();

  const revisions = doc ? await documentRevisions(doc.id) : [];

  // Only loaded when the collection actually has an image field, so the
  // FAQ and copy screens do not pay for a query they never use.
  const library = collection.fields.some((f) => f.type === "image")
    ? await query<{ url: string; filename: string; alt: string }>(
        `SELECT url, filename, alt FROM media ORDER BY created_at DESC LIMIT 200`,
      )
    : [];

  return (
    <>
      <Link
        href={`/admin/${id}`}
        className="font-sans text-caption uppercase tracking-caps text-muted transition-colors hover:text-primary"
      >
        ← {collection.label}
      </Link>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-script text-h2 leading-heading text-primary">
          {isNew
            ? `New ${collection.singular}`
            : documentTitle(collection, doc!.data)}
        </h1>

        {!isNew && collection.id === "treatments" && (
          <a
            href={`/ubud-bali/${doc!.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-caption uppercase tracking-caps text-muted transition-colors hover:text-primary"
          >
            View page ↗
          </a>
        )}
        {!isNew && collection.id === "articles" && (
          <a
            href={`/${doc!.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-caption uppercase tracking-caps text-muted transition-colors hover:text-primary"
          >
            View page ↗
          </a>
        )}
      </div>

      <div className="mt-10">
        <DocumentForm
          collection={collection}
          slug={isNew ? "" : doc!.slug}
          data={isNew ? {} : doc!.data}
          status={isNew ? "draft" : doc!.status}
          library={library}
        />
      </div>

      {revisions.length > 0 && (
        <RevisionList
          collectionId={id}
          slug={slug}
          revisions={revisions.map((r) => ({
            id: r.id,
            createdAt: r.created_at,
            editor: r.editor,
          }))}
        />
      )}
    </>
  );
}
