"use server";

import { revalidatePath } from "next/cache";
import { audit, requireAdmin } from "@/lib/auth";
import { importFromSourceFiles } from "@/lib/importContent";

export type ImportState = { error?: string; rows?: string[] };

export async function runImport(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const admin = await requireAdmin();
  const overwrite = formData.get("overwrite") === "on";

  // Overwriting is destructive enough to be worth a typed confirmation
  // rather than a checkbox alone — a mis-click here replaces every
  // document in the database.
  if (overwrite && String(formData.get("confirm") ?? "").trim() !== "OVERWRITE") {
    return { error: 'Type OVERWRITE in the confirmation box to replace existing content.' };
  }

  try {
    const result = await importFromSourceFiles({ userId: admin.id, overwrite });
    await audit(admin.id, "content.imported", undefined, { overwrite });
    revalidatePath("/admin");

    return {
      rows: result.map(
        (r) =>
          `${r.collection}: ${r.inserted} added` +
          (r.overwritten ? `, ${r.overwritten} replaced` : "") +
          (r.skipped ? `, ${r.skipped} left alone` : ""),
      ),
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? `Import failed: ${error.message}`
          : "Import failed for an unknown reason.",
    };
  }
}
