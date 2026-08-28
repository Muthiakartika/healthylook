import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, documentTitle } from "@/lib/collections";
import { listDocuments } from "@/lib/content";
import CollectionTable from "./CollectionTable";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  return { title: getCollection(collection)?.label ?? "Content" };
}

export default async function CollectionListPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: id } = await params;
  const collection = getCollection(id);
  if (!collection) notFound();

  const documents = await listDocuments(id);
  const columns = collection.fields.filter((f) => f.column);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-script text-h2 leading-heading text-primary">
            {collection.label}
          </h1>
          {collection.description && (
            <p className="mt-4 measure font-sans text-copy leading-body text-text-secondary">
              {collection.description}
            </p>
          )}
        </div>

        {collection.canCreate && (
          <Link
            href={`/admin/${id}/new`}
            className="inline-flex shrink-0 items-center rounded-brand bg-primary-strong px-5 py-2.5 font-sans text-caption font-semibold uppercase tracking-caps-wide text-white transition-opacity hover:opacity-90"
          >
            New {collection.singular}
          </Link>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="mt-10 max-w-2xl border-l-2 border-primary bg-wash py-5 pl-5 pr-4">
          <p className="font-sans text-label leading-relaxed text-text-secondary">
            Nothing here yet. The site is still serving this content from{" "}
            <code className="text-ink">{collection.source}</code> — import it
            from the{" "}
            <Link href="/admin/import" className="text-primary-strong underline">
              import screen
            </Link>{" "}
            to start editing it here.
          </p>
        </div>
      ) : (
        <CollectionTable
          collectionId={id}
          titleColumnLabel={
            collection.fields.find((f) => f.name === collection.titleField)?.label ?? "Name"
          }
          columnLabels={columns
            .filter((c) => c.name !== collection.titleField)
            .map((c) => ({ name: c.name, label: c.label }))}
          canDelete={collection.canDelete}
          rows={documents.map((doc) => ({
            slug: doc.slug,
            title: documentTitle(collection, doc.data),
            status: doc.status,
            updatedAt: doc.updated_at,
            columns: columns
              .filter((c) => c.name !== collection.titleField)
              .map((c) => ({ name: c.name, value: String(doc.data[c.name] ?? "—") })),
          }))}
        />
      )}
    </>
  );
}
