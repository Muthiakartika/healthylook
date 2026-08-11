import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import LegalDocument from "@/components/shared/LegalDocument";
import BookingSection from "@/components/home/BookingSection";
import { termsConditions } from "@/data/legal";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/terms-conditions")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/terms-conditions" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * /terms-conditions — previously a 404 linked from every page's footer.
 * Reproduced verbatim from src/data/legal.ts; see that file on why legal
 * copy is never paraphrased.
 */
export default function TermsConditionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={termsConditions.title}
        scriptTitle={false}
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
        description="The terms that apply when you book and receive treatment with us, including cancellations, consent, and payments."
        image="/images/clinic/clinic-08.jpg"
        imageAlt="Healthy Look Aesthetic clinic, Ubud"
      />
      <LegalDocument doc={termsConditions} />
      <BookingSection />
    </>
  );
}
