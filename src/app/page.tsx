import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import BrandStory from "@/components/home/BrandStory";
import Partners from "@/components/home/Partners";
import Treatments from "@/components/home/Treatments";
import FeaturedTreatment from "@/components/home/FeaturedTreatment";
import WhyUs from "@/components/home/WhyUs";
import Doctors from "@/components/home/Doctors";
import Results from "@/components/home/Results";
import Testimonials from "@/components/home/Testimonials";
import ClinicExperience from "@/components/home/ClinicExperience";
import Faq from "@/components/home/Faq";
import BookingSection from "@/components/home/BookingSection";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  // Homepage overrides the title template so it reads as the brand rather
  // than "Home | Healthy Look Aesthetic".
  title: {
    absolute: `${SITE_NAME} | ${SITE_TAGLINE}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

/**
 * HOMEPAGE
 *
 * Section order follows the brief's storytelling arc rather than its
 * numbering, which it explicitly allows ("this is a recommended design
 * structure"):
 *
 *   DISCOVER   Hero → BrandStory → Partners
 *   EXPLORE    Treatments → FeaturedTreatment
 *   TRUST      WhyUs → Doctors → Results → Testimonials
 *   CONNECT    ClinicExperience → Faq
 *   CONVERT    BookingSection
 *
 * Two orderings differ from the brief's list, both deliberately:
 *
 *  - Partners moves up to sit directly under the brand story. It's a
 *    short, quiet band, and putting it there gives the eye a rest between
 *    two heavy sections while front-loading a credibility signal.
 *  - Doctors follows WhyUs immediately, so the claim "every treatment is
 *    doctor-led" is answered by the doctors themselves on the very next
 *    screen. Claim, then evidence.
 *
 * Tonal rhythm alternates deliberately down the page so no two adjacent
 * sections share a background: ink → paper → white → wash → ink → white →
 * paper → lime → white → wash → lime → ink footer. That alternation is
 * what creates section separation without needing dividers or borders.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStory />
      <Partners />
      <Treatments />
      <FeaturedTreatment />
      <WhyUs />
      <Doctors />
      <Results />
      <Testimonials />
      <ClinicExperience />
      <Faq />
      <BookingSection />
    </>
  );
}
