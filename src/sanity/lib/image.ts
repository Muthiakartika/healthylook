import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import {
  isSanityConfigured,
  resolvedSanityProjectId,
  sanityDataset,
} from "@/sanity/env";

const builder = createImageUrlBuilder({
  projectId: resolvedSanityProjectId,
  dataset: sanityDataset,
});

export function sanityImageUrl(
  source: SanityImageSource | null | undefined,
  width = 1600,
): string | null {
  if (!isSanityConfigured || !source) return null;
  return builder.image(source).auto("format").fit("max").width(width).url();
}

/**
 * `sanityImageUrl()` already asks Sanity's own CDN to resize, compress and
 * format-negotiate (`.auto("format").fit("max").width(...)`) — every one of
 * those URLs is a finished, optimized image before it ever reaches this
 * app. Handing one to next/image's default loader re-runs that same job a
 * second time through Vercel's optimizer for no visual benefit, and bills
 * it as a transformation. Call sites that render a possibly-Sanity `src`
 * use this to pass `unoptimized` only when it's actually earning its keep —
 * local and Vercel Blob images have no other layer doing this job, so they
 * stay on Vercel's optimizer.
 */
export function isSanityHostedImage(src: string | null | undefined): boolean {
  return !!src && src.startsWith("https://cdn.sanity.io/");
}
