"use client";

import dynamic from "next/dynamic";
import config from "../../../../sanity.config";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((module) => module.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[#101116] text-sm text-white/60">
        Loading Content Studio…
      </div>
    ),
  },
);

/**
 * Sanity UI generates styled-components class names from browser-specific
 * runtime state. Keeping the Studio behind a client-only boundary prevents
 * the server markup and browser markup from receiving different class IDs.
 */
export default function StudioClient() {
  return <NextStudio config={config} />;
}
