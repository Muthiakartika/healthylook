import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import PriceTable from "@/components/shared/PriceTable";
import BookingSection from "@/components/home/BookingSection";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { TREATMENT_CATEGORIES, treatmentHref } from "@/data/treatments";
import { getTreatments } from "@/lib/site-content";
import {
  extraPricingSections,
  PRICING_NOTE,
  PRICING_PAYMENT_NOTE,
  PRICING_PROMISE,
} from "@/data/pricing";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/pricing")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/pricing" },
  openGraph: { title: seo.title, description: seo.description },
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
export default async function PricingPage() {
  const withPrices = (await getTreatments()).filter((t) => t.priceGroups?.length);

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="What treatments cost"
        crumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        description="Our complete price list. What you pay depends on the treatment plan a doctor recommends after assessing you in person. You'll be told the full cost before anything begins."
        image="/images/clinic/clinic-07.jpg"
        imageAlt="Consultation at Healthy Look Aesthetic, Ubud"
      />

      {/*
        THE PRICING PROMISE (client revision, Pricing 1).

        Above the jump nav and above every number, because that is the only
        position where it does any work — see PRICING_PROMISE.

        ── WHY THIS IS THE DARK BAND ─────────────────────────────────────
        It was blush-soft, and that was the whole problem with the first
        version. The <PageHero> directly above is blush at #eed4b8 and this
        band was #f6eadc — three percent apart in lightness, which is not a
        section change, it is a rendering artefact. The promise read as a
        piece of the hero that had come loose, and the page opened on two
        near-identical beige blocks.

        Brown fixes that and earns its place twice over: it is the surface
        this site already uses for its trust sections, and this page is
        20,000px of tables that badly needs one fixed point at the top.

        ── AND WHY IT IS NO LONGER ONE PARAGRAPH ─────────────────────────
        223 characters, centred, at 56 characters a line, produced four
        ragged lines ending on the orphan "price." — with no heading above
        it, so there was nothing to look at and nothing to scan. It is a
        statement plus three facts now: <SectionHeading> for the claim,
        because that is the component every other section statement on this
        site goes through, and a three-up row for the commitments, because
        "nett / tax included / no service fee" is a list a reader checks,
        not prose a reader reads.
      */}
      {/* ── CLIENT REVISION — LIGHTER INTRO, PRICING STAYS THE FOCUS ────
          "I think this part may be too much." Nothing here was removed —
          the claim, the description, and all three commitments are the
          same words as before. What changed is how much room the band
          takes before a visitor reaches an actual price: `py-section`
          (this page's other sections all use it) is replaced with a
          smaller fixed padding just for this band, the gap between the
          heading and the three points is tighter, and the points
          themselves read as a compact list rather than three spaced-out
          cards. <SectionHeading> itself is untouched — it's the one
          component every section opener on the site goes through, so
          resizing it here would resize it everywhere. */}
      <section className="bg-ink-brown py-12 lg:py-14">
        <Container>
          <SectionHeading
            tone="dark"
            eyebrow="Our pricing promise"
            title={PRICING_PROMISE.title}
            description={PRICING_PROMISE.description}
          />

          <ul className="mx-auto mt-8 grid max-w-3xl gap-x-10 gap-y-5 sm:grid-cols-3">
            {PRICING_PROMISE.points.map((point, index) => (
              <li key={point.label}>
                <Reveal delay={index * 90}>
                  {/* A gold hairline above each, the site's own device for
                      a set of parallel facts — see <Highlights> and the
                      safety grid on /our-doctor. Unlike that first attempt
                      at the highlights strip, these three labels are the
                      same length, so a rule of equal width above each one
                      lands on content of equal weight. */}
                  <div className="border-t border-gold-soft/40 pt-4">
                    <h3 className="font-sans text-label font-medium leading-snug text-white">
                      {point.label}
                    </h3>
                    <p className="mt-1.5 font-sans text-caption leading-body text-white/55">
                      {point.detail}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Quick jump.
          Sticky, because this page is ~20,000px tall — the full published
          price list is 236 rows and the Skin Treatments block alone runs
          eight screens. A jump nav that scrolls away after the first
          screen is useless on a document this long; pinned under the
          header it stays the way back out. `top-20/24` matches the
          header's own height so the two never overlap. */}
      <section className="sticky top-20 z-30 border-b border-hairline bg-paper/95 backdrop-blur lg:top-24">
        {/* Vertical gap moved into the links' padding — same fix as the
            treatments index. This bar is sticky and is the only navigation on
            a very long price list, so it is the last place to leave 17px tap
            targets on a phone. At py-3.5 each link is a 45px target, and the
            container's own py-2.5 comes off in exchange, since the links now
            carry that height themselves.

            One row that scrolls sideways, NOT a wrapping row — the same
            scroll-snap pattern the Before & After jump bar already uses, for
            the same reason. These four category names cannot share a line at
            320px, so `flex-wrap` put each on its own row: once the links grew
            to 45px the bar became 212px tall, a quarter of the phone screen,
            permanently parked under the header for the entire scroll of the
            price list. Sideways it is one 45px row at every width. Nothing
            changes on desktop, where all four fit and the row never scrolls. */}
        <Container className="flex snap-x gap-x-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TREATMENT_CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`#price-${category.id}`}
              className="shrink-0 snap-start whitespace-nowrap py-3.5 font-sans text-caption uppercase tracking-caps text-text-secondary transition-colors hover:text-primary-strong"
            >
              {category.label}
            </a>
          ))}
        </Container>
      </section>

      {TREATMENT_CATEGORIES.map((category, categoryIndex) => {
        const list = withPrices.filter((t) => t.category === category.id);
        // Eye treatment, personalized mesotherapy, intimate care — see the
        // CLIENT REVISION note on extraPricingSections in data/pricing.ts.
        const extras = extraPricingSections.filter((s) => s.category === category.id);
        if (list.length === 0 && extras.length === 0) return null;
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
                        <h3 className="font-sans text-h3 leading-tight text-ink">
                          <Link
                            href={treatmentHref(treatment)}
                            // `-my-2 py-2` for the tap target: the treatment
                            // name sat on a 30.5px line box. The padding takes
                            // it past 44px and the negative margin hands that
                            // height back to the layout, so the price list's
                            // spacing is untouched — there are 21 of these and
                            // any real height change would compound down a
                            // very long page.
                            className="group -my-2 inline-flex items-start gap-2 py-2 transition-colors hover:text-primary"
                          >
                            {treatment.name}
                            <ArrowUpRightIcon className="mt-2 h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        </h3>
                        <p className="mt-4 measure-narrow font-sans text-sm leading-relaxed text-text-secondary">
                          {treatment.shortDescription}
                        </p>
                      </div>

                      <div className="lg:col-span-8">
                        <PriceTable groups={treatment.priceGroups!} />
                      </div>
                    </div>
                  </Reveal>
                ))}

                {extras.map((section) => (
                  <Reveal key={section.id}>
                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
                      <div className="lg:col-span-4">
                        {/* No link, unlike the treatments above — these
                            three don't have a treatment page of their own,
                            just a price table on the live site's own
                            /pricing page. */}
                        <h3 className="font-sans text-h3 leading-tight text-ink">
                          {section.title}
                        </h3>
                      </div>

                      <div className="lg:col-span-8">
                        <PriceTable groups={section.groups} />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      {/* The clinic's own price-list footnote.
          bg-background, not wash: the last category block above is Hair &
          Booster, which lands on wash via the odd/even alternation — two
          wash sections back to back would merge into one undifferentiated
          slab. This used to share a section with a "More treatments" grid
          (eye treatment, mesotherapy, intimate care); those three now
          render inside their own category above instead — see
          extraPricingSections in data/pricing.ts — so this section is the
          footnote alone. */}
      <section className="bg-background py-section">
        <Container>
          <Reveal>
            <div className="measure border-t border-hairline pt-8">
              <p className="font-sans text-label leading-relaxed text-muted">
                {PRICING_NOTE}
              </p>
              <p className="mt-2 font-sans text-label leading-relaxed text-muted">
                {PRICING_PAYMENT_NOTE}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <BookingSection />
    </>
  );
}
