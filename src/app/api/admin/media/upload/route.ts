import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getCurrentUser } from "@/lib/auth";

/**
 * Issues a short-lived token so the BROWSER can upload straight to Blob
 * storage. The file never passes through this function.
 *
 * ── WHY NOT JUST POST THE FILE TO A SERVER ACTION ─────────────────────
 * Two hard limits make that path fail for exactly the files editors have.
 * A server action's request body defaults to 1 MB, and a Vercel serverless
 * function caps request bodies at 4.5 MB — a limit that cannot be raised.
 * A photograph off a phone is routinely 3–8 MB, so uploads would work in
 * testing with a small screenshot and fail on the first real photo.
 *
 * Client upload sidesteps both: the browser sends the bytes directly to
 * Blob storage, and this route only signs off on it.
 *
 * ── WHAT STOPS ANYONE UPLOADING ───────────────────────────────────────
 * `onBeforeGenerateToken` runs before a token exists, and throwing there
 * refuses the upload. It checks the session — so the token is only ever
 * issued to someone signed in — and pins the allowed content types and a
 * size ceiling into the token itself, which means the limits are enforced
 * by the storage service rather than by client-side code an attacker
 * controls.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Uploads are not configured. Create a Blob store in the Vercel dashboard " +
          "(Storage → Blob) and set BLOB_READ_WRITE_TOKEN.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const user = await getCurrentUser();
        if (!user) throw new Error("Not signed in.");

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
          ],
          maximumSizeInBytes: 12 * 1024 * 1024,
          addRandomSuffix: true,
          // Travels with the upload and comes back on completion, so a
          // blob can always be traced to the person who put it there.
          tokenPayload: JSON.stringify({ userId: user.id }),
        };
      },
      onUploadCompleted: async () => {
        /* Intentionally empty.
         *
         * Vercel calls this as a webhook from its own servers, which means
         * it never fires against localhost — a media row written only here
         * would exist in production and silently not in development.
         *
         * The row is written instead by a server action the browser calls
         * once `upload()` resolves (see media/actions.ts). The trade-off is
         * that a browser closed in the second between the upload finishing
         * and the action running leaves a blob with no row: invisible in
         * the library, still billed. `deleteOrphans` on the media screen is
         * what reconciles that. */
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    // 400, not 500: every realistic failure here is a rejected upload —
    // wrong type, too large, not signed in — not a fault in the route.
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload refused." },
      { status: 400 },
    );
  }
}
