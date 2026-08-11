import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TreatmentDetail from "@/components/treatment/TreatmentDetail";
import { treatments, getTreatmentBySlug } from "@/data/treatments";
import { getTreatmentSeo } from "@/data/seo";

/**
 * /ubud-bali/[...slug] — treatment detail
 *
 * A catch-all rather than a single `[slug]`, because five of the live
 * site's treatment URLs are two segments deep — `botox/korean`,
 * `hifu/body`, `prp/hair`, `microneedling/rf`, `facial/medi`. Those are
 * the real paths, so the route has to be able to match them; a single
 * dynamic segment would 404 on every one.
 *
 * Every treatment in the data gets a page. Those with authored copy get the
 * full treatment: intro, treatment areas, long-form sections, FAQ. The rest
 * render what genuinely exists for them — the clinic's own description,
 * their real price groups, their category — and then say plainly that the
 * long-form guide is still being written, with a direct line to a doctor.
 * No medical information is invented to fill space.
 *
 * The page body itself lives in <TreatmentDetail>, because one treatment —
 * Eye Rejuvenation — has its live URL at the site root rather than under
 * /ubud-bali/, and needs the identical page from a different route.
 */

export function generateStaticParams() {
  // Treatments carrying an explicit `path` are served by their own route, so
  // they are deliberately NOT generated here. Without this filter Eye
  // Rejuvenation would exist at both /eye-rejuvenaton-treatment and
  // /ubud-bali/eye-rejuvenation — the same page on two URLs, each with a
  // canonical tag pointing at the other one's sibling, which is exactly the
  // duplicate-content problem keeping the live URL was meant to avoid.
  return treatments
    .filter((treatment) => !treatment.path)
    .map((treatment) => ({ slug: treatment.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatmentBySlug(slug.join("/"));
  if (!treatment || treatment.path) return {};

  // Title/description text lives in src/data/seo.ts — edit it there.
  const seo = getTreatmentSeo(treatment.slug, treatment);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: `/ubud-bali/${treatment.slug}` },
    openGraph: { title: seo.title, description: seo.description },
  };
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const treatment = getTreatmentBySlug(slug.join("/"));
  // `treatment.path` means this treatment's real URL is elsewhere, so this
  // path is not one of its addresses — 404 rather than serve a second copy.
  // Filtering generateStaticParams is not enough on its own: an unlisted
  // param still resolves dynamically by default.
  if (!treatment || treatment.path) notFound();

  return <TreatmentDetail treatment={treatment} />;
}
