import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import DoctorProfile from "@/components/shared/DoctorProfile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Img from "@/components/ui/Img";
import Partners from "@/components/home/Partners";
import BookingSection from "@/components/home/BookingSection";
import { doctors } from "@/data/doctors";
import {
  CLINIC_LICENCE_STATEMENT,
  CLINIC_LICENCE_NUMBER,
  CLINIC_PHILOSOPHY,
  CLINIC_SAFETY_STATEMENT,
  CLINIC_SAFETY_PROTOCOLS,
} from "@/data/clinic";
import { BRAND_INTRO, BRAND_PHILOSOPHY } from "@/lib/constants";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/our-doctor")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/our-doctor" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * /our-doctor — the live site's own URL for its about page.
 *
 * Kept rather than renamed to /about: it's an indexed page with inbound
 * links, and the brief's SEO rule is not to change existing URLs without
 * reason. (A redirect from /about exists in next.config.ts for anyone
 * following a link to the earlier build.)
 *
 * The doctor profiles reuse the same <DoctorProfile> the homepage renders,
 * with the CTA suppressed — on this page the booking section at the foot
 * is the CTA, and repeating "book with Dr. X" beside each portrait would
 * be the third and fourth CTA before the reader reaches it.
 */
export default function OurDoctorPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        // Client's About Us note 1, their wording and their ampersand. It
        // reads better than what it replaced ("…in one place"), which
        // described a location; this describes a meeting of three things,
        // which is what the clinic's own brand story is actually about.
        title="Where Science, Aesthetics & Wellness Come Together"
        crumbs={[{ label: "Home", href: "/" }, { label: "Our Doctors" }]}
        description={BRAND_INTRO}
        // Not a portrait: both doctors' portraits run in full a few hundred
        // pixels below, and repeating one up here read as a bug.
        image="/images/clinic/treatment-hifu.jpg"
        imageAlt="A doctor performing a HIFU treatment at Healthy Look Aesthetic"
        imagePosition="object-center"
      />

      {/* Licence + philosophy */}
      <section className="bg-paper py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="eyebrow flex items-center gap-3 text-primary-strong">
                  <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                  Our Philosophy
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="mt-8 font-script text-h1 leading-script text-primary">
                  {BRAND_PHILOSOPHY.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-8 inline-block border border-primary/25 px-4 py-2.5 font-sans text-caption tracking-wide text-primary-strong">
                  {CLINIC_LICENCE_NUMBER}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={150}>
                <p className="measure font-sans text-lead text-text">
                  {CLINIC_LICENCE_STATEMENT}
                </p>
              </Reveal>
              <Reveal delay={210}>
                <p className="mt-7 measure font-sans text-body leading-body text-text-secondary">
                  {CLINIC_PHILOSOPHY}
                </p>
              </Reveal>

              {/* The photograph the home page's "The Clinic" strip used to
                  open with, before CLIENT REVISION 13 replaced it there with
                  the reception shot. It lands here rather than being
                  retired, and it also clears a duplicate: this slot held
                  clinic-02.jpg, which still runs in BrandStory on the home
                  page, so the same photograph was appearing on both pages.

                  `landscape` (4/3), not the `wide` (16/9) this slot used to
                  be. The source is square, and a 16/9 crop of it takes the
                  top off the standing nurse's head — checked, not assumed.
                  4/3 keeps all three people whole. */}
              <Reveal delay={270} variant="image" className="mt-12">
                <Img
                  src="/images/clinic/clinic-01.jpg"
                  alt="A treatment in progress at Healthy Look Aesthetic, Ubud"
                  aspect="landscape"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Doctors */}
      <section className="bg-background py-section">
        <Container>
          <SectionHeading
            eyebrow="Our Doctors"
            title="Doctor-led, from consultation to injection"
            description="Every consultation, treatment plan, and injection at Healthy Look Aesthetic is handled by a licensed doctor."
          />

          <div className="mt-20 flex flex-col gap-24 lg:gap-32">
            {doctors.map((doctor, index) => (
              <DoctorProfile
                key={doctor.id}
                doctor={doctor}
                index={index}
                showCta={false}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Safety */}
      <section className="bg-ink-brown py-section text-white">
        <Container>
          <SectionHeading
            tone="dark"
            eyebrow="Safety"
            title="Your safety is our highest priority"
            description={CLINIC_SAFETY_STATEMENT}
          />

          <div className="mt-16 grid gap-x-16 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {CLINIC_SAFETY_PROTOCOLS.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <div className="border-t border-white/15 pt-7">
                  <span
                    className="font-script text-statement leading-none text-gold-soft/70"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-sans text-h4 leading-tight text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3.5 font-sans text-copy leading-body text-white/55">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            <Reveal variant="image">
              <Img
                src="/images/clinic/devices.jpg"
                alt="Premium aesthetic devices at Healthy Look Aesthetic"
                aspect="landscape"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </Reveal>
            <Reveal delay={100} variant="image">
              <Img
                src="/images/clinic/products.jpg"
                alt="Premium aesthetic products at Healthy Look Aesthetic"
                aspect="landscape"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <Partners />
      <BookingSection />
    </>
  );
}
