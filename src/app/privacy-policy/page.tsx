import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import LegalDocument from "@/components/shared/LegalDocument";
import BookingSection from "@/components/home/BookingSection";
import { privacyPolicy } from "@/data/legal";
import { getLegalDocument } from "@/lib/site-content";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/privacy-policy")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/privacy-policy" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * /privacy-policy — previously a 404 that the footer linked to from every
 * page. The text is the clinic's own, reproduced verbatim from
 * src/data/legal.ts.
 */
export default async function PrivacyPolicyPage() {
  // Editable at /admin/pages. Falls back to the compiled document if the
  // stored one no longer has the shape this page walks.
  const doc = await getLegalDocument("privacy-policy", privacyPolicy);

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={doc.title}
        scriptTitle={false}
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        description="Your trust means everything to us. Here is exactly what we collect, why, and what you can ask us to do with it."
        image="/images/clinic/clinic-06.jpg"
        imageAlt="Healthy Look Aesthetic clinic, Ubud"
      />
      <LegalDocument doc={doc} />
      <BookingSection />
    </>
  );
}
