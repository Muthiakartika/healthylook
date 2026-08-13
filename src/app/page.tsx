import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Highlights from "@/components/home/Highlights";
import BrandStory from "@/components/home/BrandStory";
import Partners from "@/components/home/Partners";
import Treatments from "@/components/home/Treatments";
import WhyUs from "@/components/home/WhyUs";
import Doctors from "@/components/home/Doctors";
import Results from "@/components/home/Results";
import Testimonials from "@/components/home/Testimonials";
import ClinicExperience from "@/components/home/ClinicExperience";
import InternationalPatients from "@/components/home/InternationalPatients";
import Faq from "@/components/home/Faq";
import BlogTeaser from "@/components/home/BlogTeaser";
import BookingSection from "@/components/home/BookingSection";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * HOMEPAGE
 *
 * Section order follows the brief's storytelling arc rather than its
 * numbering, which it explicitly allows ("this is a recommended design
 * structure"):
 *
 *   DISCOVER   Hero → Highlights → BrandStory → Partners
 *   EXPLORE    Treatments
 *   TRUST      WhyUs → Doctors → Results → Testimonials
 *   CONNECT    ClinicExperience → InternationalPatients → Faq
 *   CONVERT    BookingSection
 *
 * Orderings that differ from the brief's list, all deliberate:
 *
 *  - Partners sits directly under the brand story. It's a short, quiet
 *    band, and putting it there gives the eye a rest between two heavy
 *    sections while front-loading a credibility signal.
 *  - Doctors follows WhyUs immediately, so the claim "doctor-led and
 *    internationally trained" is answered by the doctors themselves on the
 *    very next screen. Claim, then evidence.
 *
 * ── WHAT THE CLIENT'S REVISION ROUND CHANGED ──────────────────────────
 *  + Highlights (note 2) — their four promises, directly under the hero,
 *    where the "why this clinic" question actually gets asked.
 *  + InternationalPatients (note 16) — after ClinicExperience, so "what
 *    it's like to visit" is followed by "…and how it works if you're
 *    flying in".
 *  − FeaturedTreatment (note 14: "Is it important to have featured
 *    treatment in the home page?"). Removed. It gave one treatment — Botox
 *    — a full screen of essay plus its entire price table, on a homepage
 *    the client asked in the same round to shorten (note 10) and to make
 *    less catalogue-like (note 5). It also worked against note 5's
 *    shortlist: showing five facial treatments as equals and then
 *    devoting a whole section to one of them undercuts the curation. Every
 *    word of it still lives at /ubud-bali/botox, which the Treatments
 *    index links to.
 *
 * Tonal rhythm alternates deliberately down the page so no two adjacent
 * sections share a background: brown → blush → paper → white → paper →
 * brown → white → paper → wash → blush → brown → paper → white → lime →
 * brown footer. That alternation is what creates section separation
 * without needing dividers or borders.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Highlights />
      <BrandStory />
      <Partners />
      <Treatments />
      <WhyUs />
      <Doctors />
      <Results />
      <Testimonials />
      <ClinicExperience />
      <InternationalPatients />
      <Faq />
      <BlogTeaser />
      <BookingSection />
    </>
  );
}
