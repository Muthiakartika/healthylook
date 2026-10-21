import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TreatmentDetail from "@/components/treatment/TreatmentDetail";
import { getTreatmentBySlug } from "@/lib/site-content";
import ManagedPage from "@/components/sanity/ManagedPage";
import { getSanityPage } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import { TREATMENT_SEO } from "@/data/seo";
import { TREATMENTS_CRUMB } from "@/lib/breadcrumbs";

/** Eye treatment at its new canonical URL, with existing CMS content preserved. */
const SLUG = "eye-rejuvenation";

// Text lives in src/data/seo.ts, keyed by the treatment slug — edit it there.
const seo = TREATMENT_SEO[SLUG];

const fallbackMetadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/ubud-bali/eye-rejuvenaton-treatment" },
  openGraph: { title: seo.title, description: seo.description },
};

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/ubud-bali/eye-rejuvenaton-treatment", fallbackMetadata);
}

export default async function EyeRejuvenationPage() {
  const sanityPage = await getSanityPage("/ubud-bali/eye-rejuvenaton-treatment");
  const treatment = await getTreatmentBySlug(SLUG);
  if (!treatment) notFound();

  return (
    // Its URL is top-level, but it is a treatment like every other: the
    // breadcrumb says so whichever of the two bodies renders.
    <ManagedPage page={sanityPage} breadcrumbParent={TREATMENTS_CRUMB}>
      <TreatmentDetail treatment={treatment} />
    </ManagedPage>
  );
}
