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

/**
 * Studio saves an image field the moment any of its sub-fields is touched,
 * so an editor who types the alt text before the upload finishes, or removes
 * the file and keeps the alt, leaves `{ _type, alt }` with no `asset`. The
 * builder throws on that, and because the root layout reads every treatment
 * for the nav, one such field turned every server render on the site into a
 * 500 — the PRP page's "What is PRP Treatment?" block did exactly this. A
 * field with no file is an absent image, not an error.
 */
function hasImageFile(source: SanityImageSource): boolean {
  if (typeof source !== "object") return true;
  // A bare reference or asset document is itself the file.
  if ("_ref" in source || "_id" in source || "url" in source) return true;
  return Boolean((source as { asset?: unknown }).asset);
}

export function sanityImageUrl(
  source: SanityImageSource | null | undefined,
  width = 1600,
): string | null {
  if (!isSanityConfigured || !source || !hasImageFile(source)) return null;
  return builder.image(source).auto("format").fit("max").width(width).url();
}

/**
 * The image's own width ÷ height, as it will actually be served.
 *
 * Every asset id carries its dimensions — `image-<hash>-1287x616-jpg` — so
 * the ratio needs no extra field in the projection and no second request
 * for asset metadata. A crop drawn in Studio is applied by the URL builder,
 * so it has to be applied here too, or a cropped image would be boxed at
 * the uncropped file's shape. Returns undefined for anything that does not
 * match, which leaves the figure on its default frame.
 */
export function sanityImageRatio(
  image: { asset?: { _ref?: string }; crop?: SanityImageCrop } | null | undefined,
): number | undefined {
  const ref = image?.asset?._ref;
  const match = typeof ref === "string" ? /-(\d+)x(\d+)-[a-z]+$/.exec(ref) : null;
  if (!match) return undefined;
  const crop = image?.crop;
  const width = Number(match[1]) * (1 - (crop?.left ?? 0) - (crop?.right ?? 0));
  const height = Number(match[2]) * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0));
  if (!(width > 0) || !(height > 0)) return undefined;
  return Number((width / height).toFixed(4));
}

type SanityImageCrop = { top?: number; bottom?: number; left?: number; right?: number };

/**
 * `sanityImageUrl()` already asks Sanity's own CDN to resize, compress and
 * format-negotiate (`.auto("format").fit("max").width(...)`), so sending
 * one of those URLs through Vercel's optimizer re-runs a job that is
 * already done and bills it as a transformation. Call sites that render a
 * possibly-Sanity `src` use this to pick `<SanityImage>` (see
 * components/ui/SanityImage.tsx) over a plain next/image; local and Vercel
 * Blob images have no other layer doing this job, so they stay on Vercel's
 * optimizer.
 */
export function isSanityHostedImage(src: string | null | undefined): boolean {
  return !!src && src.startsWith("https://cdn.sanity.io/");
}
