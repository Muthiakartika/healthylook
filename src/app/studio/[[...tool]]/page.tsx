import type { Metadata } from "next";
import { metadata as studioMetadata } from "next-sanity/studio";
import { isSanityConfigured } from "@/sanity/env";
import StudioClient from "./StudioClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Content Studio",
  robots: { index: false, follow: false },
};

export { viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="max-w-xl border-l-2 border-primary bg-wash p-8 font-sans text-ink">
          <h1 className="text-h3">Sanity is not configured yet</h1>
          <p className="mt-4 text-body leading-body text-text-secondary">
            Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to
            .env.local, then follow README-SANITY.md. The public website is still
            serving its existing content safely.
          </p>
        </div>
      </div>
    );
  }
  return <StudioClient />;
}
