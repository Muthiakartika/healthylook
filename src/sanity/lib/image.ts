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
