import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import PriceTable from "@/components/shared/PriceTable";
import BookingSection from "@/components/home/BookingSection";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { TREATMENT_CATEGORIES, treatments, treatmentHref } from "@/data/treatments";
import { extraPricingSections, PRICING_NOTE } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "The full treatment price list for Healthy Look Aesthetic, Ubud — every treatment, brand, and variant, in Indonesian Rupiah. All prices nett and inclusive of tax.",
  alternates: { canonical: "/pricing" },
};

/**
 * /pricing
 *
 * Reproduces the clinic's published price list in full — every treatment,
 * every brand variant, every package, verbatim from the live site's own
 * /pricing page. Nothing is summarised, rounded, or omitted: on a clinic
 * site the price list is reference material, and an incomplete one is
 * worse than none because it sets an expectation the invoice then breaks.
 *
 * Grouped by the same four categories as the nav, with the sections that
 * don't belong to a single nav treatment (eye treatment, mesotherapy,
 * intimate care) collected at the end.
 *
 * Set as typographic tables rather than pricing cards — see PriceTable for
 * why.
 */
export default function PricingPage() {
  const withPrices = treatments.filter((t) => t.priceGroups?.length);

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="What treatments cost"
        crumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        description="Our complete price list. What you pay depends on the treatment plan a doctor recommends after assessing you in person — and you'll be told the full cost before anything begins."
        image="/images/clinic/clinic-07.jpg"
        imageAlt="Consultation at Healthy Look Aesthetic, Ubud"
      />

      {/* Quick jump.
          Sticky, because this page is ~20,000px tall — the full published
          price list is 236 rows and the Skin Treatments block alone runs
          eight screens. A jump nav that scrolls away after the first
          screen is useless on a document this long; pinned under the
          header it stays the way back out. `top-20/24` matches the
          header's own height so the two never overlap. */}
      <section className="sticky top-20 z-30 border-b border-hairline bg-paper/95 backdrop-blur lg:top-24">
        <Container className="flex flex-wrap gap-x-8 gap-y-3 py-4">
          {TREATMENT_CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`#price-${category.id}`}
              className="font-sans text-[0.75rem] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-primary"
            >
              {category.label}
            </a>
          ))}
          <a
            href="#price-more"
            className="font-sans text-[0.75rem] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-primary"
          >
            More Treatments
          </a>
        </Container>
      </section>

      {TREATMENT_CATEGORIES.map((category, categoryIndex) => {
        const list = withPrices.filter((t) => t.category === category.id);
        if (list.length === 0) return null;
        const alt = categoryIndex % 2 === 1;

        return (
          <section
            key={category.id}
            id={`price-${category.id}`}
            // 160px of scroll offset, not the site default 96px: on this
            // page an anchor has to clear BOTH the fixed header (96px) and
            // the sticky jump nav beneath it (~54px), or the heading you
            // jumped to lands hidden behind the nav.
            className={`scroll-mt-40 py-section ${alt ? "bg-wash" : "bg-background"}`}
          >
            <Container>
              <SectionHeading
                align="left"
                eyebrow={String(categoryIndex + 1).padStart(2, "0")}
                title={category.label}
              />

              <div className="mt-14 flex flex-col gap-16">
                {list.map((treatment) => (
                  <Reveal key={treatment.slug}>
                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
                      <div className="lg:col-span-4">
                        <h3 className="font-sans text-[length:var(--fs-h3)] leading-tight text-ink">
                          <Link
                            href={treatmentHref(treatment)}
                            className="group inline-flex items-start gap-2 transition-colors hover:text-primary"
                          >
                            {treatment.name}
                            <ArrowUpRightIcon className="mt-2 h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        </h3>
                        <p className="mt-4 measure-narrow font-sans text-[0.875rem] leading-relaxed text-text-secondary">
                          {treatment.shortDescription}
                        </p>
                      </div>

                      <div className="lg:col-span-8">
                        <PriceTable groups={treatment.priceGroups!} />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      {/* Sections from the live price list that don't map to a nav item.
          White, not wash: the last category block above is Hair & Booster,
          which lands on wash via the odd/even alternation — two wash
          sections back to back merged into one undifferentiated slab. */}
      <section id="price-more" className="scroll-mt-40 bg-background py-section">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="05"
            title="More treatments"
            description="Further treatments from our price list. Ask us at consultation which of these suits what you're after."
            className="lg:max-w-2xl"
          />

          <div className="mt-14 grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
            {extraPricingSections.map((section, index) => (
              <Reveal key={section.id} delay={index * 80}>
                <h3 className="font-sans text-[length:var(--fs-h4)] leading-tight text-ink">
                  {section.title}
                </h3>
                <div className="mt-6">
                  <PriceTable groups={section.groups} />
                </div>
              </Reveal>
            ))}
          </div>

          {/* The clinic's own price-list footnote. Folded into this
              section rather than sitting in its own band — a full section
              wrapper for one line of 13px text was both wasted height and
              a third consecutive white block. */}
          <Reveal>
            <p className="mt-16 measure border-t border-hairline pt-8 font-sans text-[0.8125rem] leading-relaxed text-muted">
              {PRICING_NOTE}
            </p>
          </Reveal>
        </Container>
      </section>

      <BookingSection />
    </>
  );
}
