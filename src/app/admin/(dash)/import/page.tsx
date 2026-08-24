import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import ImportForm from "./ImportForm";

export const metadata = { title: "Import content" };

export default async function ImportPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  // Overwriting every document at once is not an editor's decision.
  if (user.role !== "admin") redirect("/admin");

  const counts = await query<{ total: string }>(`SELECT count(*) AS total FROM documents`);
  const alreadyHasContent = Number(counts[0]?.total ?? 0) > 0;

  return (
    <div className="max-w-2xl">
      <h1 className="font-script text-h2 leading-heading text-primary">
        Import content
      </h1>

      <p className="mt-5 font-sans text-copy leading-body text-text-secondary">
        Copies the pages, treatments and articles out of the site&rsquo;s source
        files and into the database, so they can be edited here. Until this has
        run, the site keeps serving them straight from the source files exactly
        as it does today.
      </p>

      <div className="mt-8 border-l-2 border-primary bg-wash py-5 pl-5 pr-4">
        <h2 className="font-sans text-copy-lg font-medium text-ink">
          {alreadyHasContent
            ? "Content has already been imported"
            : "Nothing has been imported yet"}
        </h2>
        <p className="mt-3 font-sans text-label leading-relaxed text-text-secondary">
          {alreadyHasContent
            ? "Running it again skips everything that already exists, so edits made here are safe. Overwriting is a separate, deliberate choice below — and even then, what it replaces is kept as a restorable version."
            : "This is safe to run: it only adds. Nothing on the live site changes until content exists here for the site to read."}
        </p>
      </div>

      <div className="mt-10">
        <ImportForm alreadyHasContent={alreadyHasContent} />
      </div>
    </div>
  );
}
