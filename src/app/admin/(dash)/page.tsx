import Link from "next/link";
import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { COLLECTIONS } from "@/lib/collections";

export default async function AdminOverviewPage() {
  const user = await requireUser();

  const counts = await query<{ collection: string; total: string; drafts: string }>(
    `SELECT collection,
            count(*) AS total,
            count(*) FILTER (WHERE status = 'draft') AS drafts
       FROM documents
      GROUP BY collection`,
  );
  const byCollection = new Map(counts.map((c) => [c.collection, c]));

  const recent = await query<{
    slug: string;
    collection: string;
    updated_at: string;
    editor: string | null;
  }>(
    `SELECT d.slug, d.collection, d.updated_at, u.name AS editor
       FROM documents d
       LEFT JOIN users u ON u.id = d.updated_by
      ORDER BY d.updated_at DESC
      LIMIT 8`,
  );

  const empty = counts.length === 0;

  return (
    <>
      <h1 className="font-script text-h2 leading-heading text-primary">
        Hello, {user.name.split(" ")[0]}
      </h1>

      {empty ? (
        <div className="mt-8 max-w-2xl border-l-2 border-primary bg-wash py-5 pl-5 pr-4">
          <h2 className="font-sans text-copy-lg font-medium text-ink">
            No content has been imported yet
          </h2>
          <p className="mt-3 measure font-sans text-label leading-relaxed text-text-secondary">
            The site is still serving the content held in its source files, which
            is exactly what it did before the dashboard existed. Run{" "}
            <code className="text-ink">npm run db:import</code> to copy that
            content into the database — after which editing it here changes the
            live site.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((collection) => {
            const row = byCollection.get(collection.id);
            return (
              <Link
                key={collection.id}
                href={`/admin/${collection.id}`}
                className="group bg-paper p-6 transition-colors hover:bg-wash"
              >
                <div className="font-sans text-caption uppercase tracking-caps text-muted">
                  {collection.label}
                </div>
                <div className="mt-3 font-sans text-h3 tabular-nums text-ink">
                  {row?.total ?? 0}
                </div>
                {Number(row?.drafts ?? 0) > 0 && (
                  <div className="mt-1 font-sans text-caption text-primary-strong">
                    {row?.drafts} not published
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {recent.length > 0 && (
        <section className="mt-14">
          <h2 className="font-sans text-h4 text-ink">Recently edited</h2>
          <ul className="mt-5 flex flex-col divide-y divide-hairline border-y border-hairline">
            {recent.map((item) => (
              <li key={`${item.collection}/${item.slug}`}>
                <Link
                  href={`/admin/${item.collection}/${encodeURIComponent(item.slug)}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5 transition-colors hover:text-primary-strong"
                >
                  <span className="font-sans text-copy text-ink">{item.slug}</span>
                  <span className="font-sans text-caption uppercase tracking-caps text-muted">
                    {item.collection}
                    {item.editor ? ` · ${item.editor}` : ""} ·{" "}
                    {new Date(item.updated_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
