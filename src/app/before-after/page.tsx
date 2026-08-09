import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/ui/Reveal";
import Img from "@/components/ui/Img";
import Button from "@/components/ui/Button";
import Testimonials from "@/components/home/Testimonials";
import BookingSection from "@/components/home/BookingSection";
import { whatsappHref } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Before & After",
  description:
    "Before and after results from treatments at Healthy Look Aesthetic, Ubud. Individual results vary — every outcome shown belongs to one specific patient.",
  alternates: { canonical: "/before-after" },
};

/**
 * /before-after
 *
 * ⚠ THE CLINIC HAS EXACTLY ONE BEFORE/AFTER ASSET IN ITS MEDIA LIBRARY.
 *
 * That's the honest state of things, and this page reflects it rather than
 * disguising it. The single real result is shown large; the rest of the
 * page explains what's coming and gives a direct route to ask for more.
 *
 * What this page deliberately does NOT do is fill a grid with clinic
 * interiors, product shots, or duplicated crops labelled as "results".
 * Fabricated or mislabelled patient outcomes on a medical-aesthetics site
 * are the most serious version of the invented-claim the brief prohibits,
 * and in most jurisdictions they are unlawful advertising.
 *
 * Before this ships with a full gallery, three things are needed:
 *   1. Real before/after photographs, shot under consistent lighting.
 *   2. Written, treatment-specific consent from every patient shown.
 *   3. A doctor's sign-off on any text describing what a photo shows.
 *
 * Note this page is indexable — unlike the earlier version it no longer
 * claims to be a gallery it isn't, so there's nothing misleading to hide
 * from search.
 */
export default function BeforeAfterPage() {
  return (
    <>
      <PageHero
        eyebrow="Results"
        title="Before &amp; After"
        crumbs={[{ label: "Home", href: "/" }, { label: "Before & After" }]}
        description="Outcomes from treatments performed at our Ubud clinic, photographed under consistent lighting and shared with patient consent."
        image="/images/clinic/clinic-05.jpg"
        imageAlt="Treatment room at Healthy Look Aesthetic, Ubud"
      />

      {/* Disclaimer first, deliberately. */}
      <section className="border-b border-primary/20 bg-section-soft">
        <Container className="py-8">
          <p className="measure font-sans text-[0.875rem] leading-relaxed text-primary-hover">
            <strong className="font-medium">Individual results vary.</strong> Every
            photograph shows the outcome for one specific patient and is not a
            prediction or guarantee of the result anyone else will achieve. Outcomes
            depend on your anatomy, your skin, the treatment plan agreed with your
            doctor, and how you care for your skin afterwards. Your doctor will discuss
            what is realistically achievable for you at consultation.
          </p>
        </Container>
      </section>

      <section className="bg-paper py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <Reveal variant="image" className="lg:col-span-7">
              <Img
                src="/images/results/before-after-01.jpg"
                alt="Before and after result from a treatment at Healthy Look Aesthetic, Ubud"
                aspect="square"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </Reveal>

            <div className="lg:col-span-5 lg:self-center">
              <Reveal delay={100}>
                <span className="eyebrow flex items-center gap-3 text-primary">
                  <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                  Patient result
                </span>
              </Reveal>

              <Reveal delay={150}>
                <p className="mt-8 measure font-sans text-lead text-text">
                  A real patient, treated at our Ubud clinic and photographed under the
                  same lighting before and after.
                </p>
              </Reveal>

              <Reveal delay={210}>
                <p className="mt-6 measure font-sans text-[0.9375rem] leading-[var(--lh-body)] text-text-secondary">
                  We publish results carefully and only with a patient&rsquo;s
                  permission, which is why there are fewer here than you might expect.
                  If you&rsquo;d like to see results for a specific treatment,
                  message us — our doctors can show you relevant cases during your
                  consultation.
                </p>
              </Reveal>

              <Reveal delay={270}>
                <div className="mt-10">
                  <Button
                    href={whatsappHref(
                      "Hello Healthy Look Aesthetic, could I see before and after results for a treatment?",
                    )}
                    variant="primary"
                    external
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Ask to see more results
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <Testimonials />
      <BookingSection />
    </>
  );
}
