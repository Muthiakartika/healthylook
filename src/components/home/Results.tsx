import Container from "@/components/ui/Container";
import Img from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * SECTION 08 — BEFORE / AFTER / RESULTS
 *
 * ⚠ ONE REAL IMAGE, AND THAT'S DELIBERATE.
 *
 * The clinic's media library contains exactly one before/after asset
 * (`Best-Before-After-4.jpg`). It's shown here at full editorial size,
 * on its own, rather than being padded out to a four-up grid with
 * unrelated clinic photos dressed up as results.
 *
 * That restraint is the whole point: fabricated or mislabelled patient
 * results on a medical-aesthetics site are the most serious version of
 * the invented-claim the brief prohibits, and in most jurisdictions they
 * are unlawful advertising. One genuine result presented confidently is
 * worth more than four fake ones, and the layout reads as intentional
 * rather than sparse.
 *
 * The disclaimer isn't decorative. Individual-results language is standard
 * practice — often legally required — alongside any before/after imagery
 * in medical aesthetics.
 */
export default function Results() {
  return (
    <section className="bg-paper py-section">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Results"
            title="Before &amp; After"
            subtitle="Real patients, treated at our Ubud clinic."
            className="lg:max-w-xl"
          />
          <Reveal delay={100} className="shrink-0">
            <Button href="/before-after" variant="outline" size="sm" withArrow>
              View the full gallery
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal variant="image" className="lg:col-span-7">
            <Img
              src="/images/results/before-after-01.jpg"
              alt="Before and after result from a treatment at Healthy Look Aesthetic"
              aspect="square"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </Reveal>

          <div className="lg:col-span-5 lg:self-center">
            <Reveal delay={120}>
              <p className="measure font-sans text-lead text-text">
                Every result we publish belongs to a real patient treated at this
                clinic, photographed under consistent lighting and shared with their
                permission.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-8 measure border-l-2 border-primary/30 py-1 pl-6 font-sans text-label leading-relaxed text-text-secondary">
                Individual results vary. A photograph shows the outcome for one
                specific patient and is not a prediction or guarantee of the result
                anyone else will achieve. Outcomes depend on your anatomy, your skin,
                the plan agreed with your doctor, and your aftercare. Your doctor will
                discuss what is realistically achievable for you at consultation.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
