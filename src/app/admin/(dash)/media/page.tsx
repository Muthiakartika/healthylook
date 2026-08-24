import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import MediaUploader from "./MediaUploader";
import MediaGrid from "./MediaGrid";
import OrphanNotice from "./OrphanNotice";
import type { MediaRow } from "./actions";

export const metadata = { title: "Images" };

export default async function MediaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const items = await query<MediaRow>(
    `SELECT m.id, m.url, m.pathname, m.filename, m.content_type, m.size_bytes,
            m.width, m.height, m.alt, m.created_at, u.name AS uploaded_by
       FROM media m
       LEFT JOIN users u ON u.id = m.created_by
      ORDER BY m.created_at DESC`,
  );

  const uploadsEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <>
      <h1 className="font-script text-h2 leading-heading text-primary">Images</h1>
      <p className="mt-4 measure font-sans text-copy leading-body text-text-secondary">
        Photographs uploaded here can be picked from any image field on a
        treatment, article or page. The site&rsquo;s own photographs, the ones
        already in its image folder, stay available alongside them.
      </p>

      <div className="mt-10 max-w-2xl">
        <MediaUploader enabled={uploadsEnabled} />
      </div>

      {user.role === "admin" && uploadsEnabled && <OrphanNotice />}

      <MediaGrid items={items} canDelete={user.role === "admin"} />
    </>
  );
}
