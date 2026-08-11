import Container from "@/components/ui/Container";
import Img from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import PriceTable from "@/components/shared/PriceTable";
import { CheckIcon } from "@/components/ui/icons";
import { formatIDR } from "@/lib/format";
import { getTreatmentBySlug, treatmentHref } from "@/data/treatments";
import { BOOKING_HREF } from "@/lib/constants";

/**
 * SECTION 05 — FEATURED TREATMENT
 *
 * Botox is featured because it's the treatment with the deepest real
 * content: three named brands at three price points, a published bulk
 * discount, and ten treatment areas. Featuring a treatment whose content
 * is one sentence would mean padding it with copy the brief forbids
 * writing.
 *
 * The brief wants treatments to feel like premium experiences rather than
 * price-list items — a genuine tension here, because this treatment's most
 * useful content *is* a price list. The resolution is sequencing: the
 * essay and the treatment areas come first at editorial scale, and pricing
 * arrives last as a quiet table. Transparent per-unit pricing is one of
 * the clinic's real differentiators, so burying it would work against the
 * brand rather than for it.
 */
const treatment = getTreatmentBySlug("botox");

export default function FeaturedTreatment() {
  if (!treatment) return null;

  return (
    <section className="bg-wash py-section">
      <Container>
        <Reveal>
          <span className="eyebrow flex items-center gap-3 text-primary-strong">
            <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
            Featured Treatment
          </span>
        </Reveal>

        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Image + pricing */}
          <div className="lg:col-span-5">
            <Reveal variant="image">
              <Img
                src={treatment.image ?? "/images/treatments/treatment-05.jpg"}
                alt="Botox treatment at Healthy Look Aesthetic, Ubud"
                aspect="portrait"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Reveal>

            {treatment.priceGroups && (
              <Reveal delay={140}>
                <div className="mt-10 border-t border-primary/25 pt-8">
                  <PriceTable groups={treatment.priceGroups} />
                </div>
              </Reveal>
            )}
          </div>

          {/* Copy */}
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <h2 className="font-script text-h1 leading-heading text-primary">
                {treatment.name}
              </h2>
            </Reveal>

            {treatment.startingPrice != null && (
              <Reveal delay={120}>
                <p className="mt-5 font-sans text-caption uppercase tracking-caps text-muted">
                  From {formatIDR(treatment.startingPrice)}{" "}
                  {treatment.priceUnit ?? ""}
                </p>
              </Reveal>
            )}

            <Reveal delay={160}>
              <p className="mt-8 measure font-sans text-lead text-text">
                {treatment.shortDescription}
              </p>
            </Reveal>

            {treatment.intro && (
              <Reveal delay={200}>
                <p className="mt-6 measure font-sans text-body leading-body text-text-secondary">
                  {treatment.intro}
                </p>
              </Reveal>
            )}

            {treatment.popularAreas && (
              <Reveal delay={250}>
                <div className="mt-12">
                  <h3 className="eyebrow text-primary-strong">Commonly treated areas</h3>
                  {/* Two columns: ten items in one column is a long scroll
                      for a list whose whole purpose is to be scanned. */}
                  <ul className="mt-6 grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
                    {treatment.popularAreas.map((area) => (
                      <li
                        key={area}
                        className="flex items-start gap-3 font-sans text-copy text-text"
                      >
                        <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal delay={300}>
              <div className="mt-12 flex flex-wrap gap-4">
                <Button href={treatmentHref(treatment)} variant="primary" withArrow>
                  Read the full guide
                </Button>
                <Button href={BOOKING_HREF} variant="outline">
                  Book a consultation
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
