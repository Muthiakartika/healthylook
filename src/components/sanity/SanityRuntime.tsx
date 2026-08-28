import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";

/**
 * Mounted once for the public site. Without Sanity environment values this
 * emits no client code. VisualEditing is inert on normal pages because only
 * draft responses contain source-map metadata for its overlays.
 */
export default function SanityRuntime() {
  if (!isSanityConfigured) return null;
  return (
    <>
      <SanityLive />
      <VisualEditing />
    </>
  );
}
