import type { Metadata } from "next";
import { getSanityPage } from "@/sanity/lib/content";
import { getSanityTreatmentExtras } from "@/sanity/lib/content";
import { sanityImageUrl } from "@/sanity/lib/image";

export async function getCmsPageMetadata(path: string): Promise<Metadata> {
  const page = await getSanityPage(path);
  if (!page) return {};

  const title = page.seo?.title || page.title;
  const description = page.seo?.description;
  const image = sanityImageUrl(page.seo?.image);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: page.path },
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: image
        ? [{ url: image, alt: page.seo?.image?.alt || page.title }]
        : undefined,
    },
  };
}

/** Uses Sanity SEO only when a published page exists; otherwise preserves the route's current metadata. */
export async function resolvePageMetadata(
  path: string,
  fallback: Metadata,
): Promise<Metadata> {
  const page = await getSanityPage(path);
  if (!page) return fallback;

  const title = page.seo?.title;
  const description = page.seo?.description || fallback.description;
  const image = sanityImageUrl(page.seo?.image);

  return {
    ...fallback,
    title: title ? { absolute: title } : fallback.title || page.title,
    description,
    alternates: { canonical: page.path },
    robots: page.seo?.noIndex ? { index: false, follow: false } : fallback.robots,
    openGraph: {
      ...fallback.openGraph,
      title: title || fallback.openGraph?.title || page.title,
      description: typeof description === "string" ? description : undefined,
      images: image
        ? [{ url: image, alt: page.seo?.image?.alt || page.title }]
        : fallback.openGraph?.images,
    },
  };
}

export async function resolveTreatmentMetadata(
  slug: string,
  path: string,
  fallback: Metadata,
): Promise<Metadata> {
  const extras = await getSanityTreatmentExtras(slug);
  const seo = extras?.seo;
  const image = sanityImageUrl(seo?.image);
  const treatmentMetadata: Metadata = seo
    ? {
        ...fallback,
        title: seo.title ? { absolute: seo.title } : fallback.title,
        description: seo.description || fallback.description,
        robots: seo.noIndex ? { index: false, follow: false } : fallback.robots,
        openGraph: {
          ...fallback.openGraph,
          title: seo.title || fallback.openGraph?.title,
          description: seo.description || fallback.openGraph?.description,
          images: image
            ? [{ url: image, alt: seo.image?.alt || seo.title || "Treatment" }]
            : fallback.openGraph?.images,
        },
      }
    : fallback;

  return resolvePageMetadata(path, treatmentMetadata);
}
