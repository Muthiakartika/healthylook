import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import LegalDocument from "@/components/shared/LegalDocument";
import BookingSection from "@/components/home/BookingSection";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Healthy Look Aesthetic collects, uses, and protects your personal and treatment information.",
  alternates: { canonical: "/privacy-policy" },
};

/**
 * /privacy-policy — previously a 404 that the footer linked to from every
 * page. The text is the clinic's own, reproduced verbatim from
 * src/data/legal.ts.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={privacyPolicy.title}
        scriptTitle={false}
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        description="Your trust means everything to us. Here is exactly what we collect, why, and what you can ask us to do with it."
        image="/images/clinic/clinic-06.jpg"
        imageAlt="Healthy Look Aesthetic clinic, Ubud"
      />
      <LegalDocument doc={privacyPolicy} />
      <BookingSection />
    </>
  );
}
