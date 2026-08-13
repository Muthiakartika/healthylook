import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Img from "@/components/ui/Img";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingSection from "@/components/home/BookingSection";
import { ArrowDownIcon, WhatsAppIcon } from "@/components/ui/icons";
import { specialOffers } from "@/data/offers";
import { whatsappHref } from "@/lib/constants";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/special-offers")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/special-offers" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * /special-offers — previously a 404 linked from the nav and footer.
 *
 * All three offers are the clinic's own published terms, copied exactly:
 * the discount percentages, the unit thresholds, the minimum-spend bands
 * for the transfer service, and the airline-ID condition. These are the
 * numbers a patient will hold the clinic to at the counter, so none of
 * them is rounded, simplified, or restated.
 *
 * Presented as large numbered editorial blocks rather than as "deal"
 * cards. A clinic offering medical treatment shouldn't look like a
 * flash-sale page — the offers are real but the framing stays consistent
 * with the rest of the site.
 */
export default function SpecialOffersPage() {
  return (
    <>
      <PageHero
        eyebrow="Special Offers"
        title="Current offers"
        crumbs={[{ label: "Home", href: "/" }, { label: "Special Offers" }]}
        description="A few things worth knowing before you book. All offers are subject to availability and cannot be combined unless stated."
        image="/images/treatments/treatment-14.jpg"
        imageAlt="Treatment at Healthy Look Aesthetic, Ubud"
      />

      <section className="bg-paper py-section">
        <Container>
          <div className="flex flex-col gap-20 lg:gap-28">
            {specialOffers.map((offer, index) => (
              <Reveal key={offer.id}>
                <article className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                  <div className="lg:col-span-4">
                    <span
                      className="font-script text-numeral leading-none text-primary/40"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="mt-4 font-script text-h2 leading-heading text-primary">
                      {offer.name}
                    </h2>

                    {/* Sits with the heading it qualifies, because it is
                        explaining the asterisk in that heading. Moved here
                        from the foot of the block, where the reader met the
                        asterisk several hundred words before its footnote. */}
                    {offer.headingNote && (
                      <p className="mt-3 font-sans text-caption italic text-muted">
                        {offer.headingNote}
                      </p>
                    )}

                    {/* Client revision: pictures on this page. They live in
                        the left column under the title rather than above
                        the copy, which puts them in the space the numeral
                        and heading were leaving empty on desktop — the
                        block gets a photograph without getting taller. */}
                    {offer.image && (
                      <Reveal delay={100} variant="image" className="mt-8">
                        <Img
                          src={offer.image}
                          alt={offer.imageAlt ?? ""}
                          aspect="landscape"
                          sizes="(max-width: 1024px) 100vw, 30vw"
                        />
                      </Reveal>
                    )}
                  </div>

                  <div className="lg:col-span-8">
                    {offer.intro && (
                      <p className="measure font-sans text-lead text-text">
                        {offer.intro}
                      </p>
                    )}

                    {/* Guarded: the Botox offer has no bullets on the live
                        site, and an empty <ul> with `border-t` renders as a
                        stray hairline under the paragraph. */}
                    {offer.points && offer.points.length > 0 && (
                      <ul className={`${offer.intro ? "mt-8" : ""} border-t border-hairline`}>
                        {offer.points.map((point) => (
                          <li
                            key={point}
                            className="border-b border-hairline py-4 font-sans text-copy-lg leading-snug text-ink"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Published rate tables — the transfer offer's minimum
                        spend and surcharge by area. These are prices, so they
                        get the same tabular, right-aligned treatment as the
                        price list rather than being flattened into prose.

                        ── FOLDED BEHIND "See Details", AS ON THE LIVE SITE ──
                        Twelve figures across two tables is most of this
                        block's height, and it is reference material: it
                        matters enormously to the reader who lives in Canggu
                        and not at all to the one deciding whether the offer
                        is interesting. The live page collapses it and the
                        client asked to match that.

                        Native <details>, not a JS disclosure. The rows stay
                        in the DOM when closed, so they remain crawlable and
                        findable with Ctrl+F — which is the whole risk of
                        hiding published prices — and it works with no
                        JavaScript and with keyboard support for free.
                        `[&::-webkit-details-marker]:hidden` and
                        `list-none` remove the default triangle so the
                        summary can be styled as this site's own button. */}
                    {offer.tables && offer.tables.length > 0 && (
                      <details className="group/details mt-8">
                        <summary className="inline-flex cursor-pointer list-none items-center gap-2.5 rounded-brand border border-primary/50 px-6 py-3 font-sans text-caption font-medium uppercase tracking-caps-wide text-primary-strong transition-colors duration-300 hover:border-primary-strong hover:bg-primary-strong hover:text-white [&::-webkit-details-marker]:hidden">
                          {/* Two labels, one swapped out by the open state —
                              a control that still says "See Details" once
                              the details are on screen is a control that
                              looks broken. */}
                          <span className="group-open/details:hidden">See details</span>
                          <span className="hidden group-open/details:inline">
                            Hide details
                          </span>
                          <ArrowDownIcon
                            className="h-3.5 w-3.5 transition-transform duration-300 group-open/details:rotate-180"
                            aria-hidden="true"
                          />
                        </summary>

                        {offer.tables.map((table) => (
                          <div key={table.title} className="mt-10">
                            <h3 className="measure font-sans text-copy leading-body text-text-secondary">
                              {table.title}
                            </h3>
                            <dl className="mt-5 border-t border-hairline">
                              {table.rows.map((row) => (
                                <div
                                  key={`${table.title}-${row.label}`}
                                  className="flex items-baseline justify-between gap-6 border-b border-hairline py-3.5"
                                >
                                  <dt className="font-sans text-copy text-ink">
                                    {row.label}
                                  </dt>
                                  <dd className="shrink-0 font-sans text-copy tabular-nums text-primary-strong">
                                    {row.value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                      </details>
                    )}

                    {/* Live order: the exclusion in italics, then the
                        instruction in body copy. `outro` is not small print
                        — "present your airline ID" is the one thing the
                        reader actually has to do, so it takes the same size
                        and colour as the intro rather than being greyed
                        down with the terms. */}
                    {offer.note && (
                      <p className="mt-6 font-sans text-label italic leading-relaxed text-muted">
                        {offer.note}
                      </p>
                    )}

                    {offer.outro && (
                      <p className="mt-6 measure font-sans text-copy leading-body text-text-secondary">
                        {offer.outro}
                      </p>
                    )}

                    <div className="mt-8">
                      <Button
                        href={whatsappHref(
                          `Hello Healthy Look Aesthetic, I'd like to ask about your ${offer.name}.`,
                        )}
                        variant="quiet"
                        size="sm"
                        withArrow
                        external
                      >
                        Ask about this offer
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Gift card cross-link */}
      <section className="bg-ink-brown py-section text-white">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              <SectionHeading
                align="left"
                tone="dark"
                eyebrow="Also available"
                title="Give the Gift of Confidence"
                description="Let someone choose their own treatment with a Healthy Look eGift Card, valid for 24 months."
              />
              <Reveal delay={200}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button href="/gift-card" variant="light" withArrow>
                    View gift cards
                  </Button>
                  <Button
                    href={whatsappHref("Hello Healthy Look Aesthetic, I'd like to buy a gift card.")}
                    variant="outlineLight"
                    external
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Ask us
                  </Button>
                </div>
              </Reveal>
            </div>
            <Reveal delay={140} variant="image" className="lg:col-span-5">
              <Img
                src="/images/clinic/clinic-03.jpg"
                alt="Healthy Look Aesthetic clinic, Ubud"
                aspect="landscape"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <BookingSection />
    </>
  );
}
