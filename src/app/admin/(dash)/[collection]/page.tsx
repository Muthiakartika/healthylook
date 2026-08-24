import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, documentTitle } from "@/lib/collections";
import { listDocuments } from "@/lib/content";

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
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse">
            <thead>
              <tr className="border-y border-hairline text-left">
                <th className="py-3 pr-6 font-sans text-caption uppercase tracking-caps text-muted">
                  {collection.fields.find((f) => f.name === collection.titleField)?.label ??
                    "Name"}
                </th>
                {columns
                  .filter((c) => c.name !== collection.titleField)
                  .map((c) => (
                    <th
                      key={c.name}
                      className="py-3 pr-6 font-sans text-caption uppercase tracking-caps text-muted"
                    >
                      {c.label}
                    </th>
                  ))}
                <th className="py-3 text-right font-sans text-caption uppercase tracking-caps text-muted">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-hairline transition-colors hover:bg-wash"
                >
                  <td className="py-3.5 pr-6">
                    <Link
                      href={`/admin/${id}/${encodeURIComponent(doc.slug)}`}
                      className="font-sans text-copy text-ink transition-colors hover:text-primary-strong"
                    >
                      {documentTitle(collection, doc.data)}
                    </Link>
                    {doc.status === "draft" && (
                      <span className="ml-3 font-sans text-micro uppercase tracking-caps text-primary-strong">
                        draft
                      </span>
                    )}
                    <span className="mt-0.5 block font-sans text-micro text-muted">
                      {doc.slug}
                    </span>
                  </td>
                  {columns
                    .filter((c) => c.name !== collection.titleField)
                    .map((c) => (
                      <td
                        key={c.name}
                        className="py-3.5 pr-6 font-sans text-label text-text-secondary"
                      >
                        {String(doc.data[c.name] ?? "—")}
                      </td>
                    ))}
                  <td className="py-3.5 text-right font-sans text-micro text-muted">
                    {new Date(doc.updated_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
