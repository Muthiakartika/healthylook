import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Img from "@/components/ui/Img";
import Accordion from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";
import PriceTable from "@/components/shared/PriceTable";
import TreatmentThumb from "@/components/shared/TreatmentThumb";
import DoctorCredit from "@/components/shared/DoctorCredit";
import BookingSection from "@/components/home/BookingSection";
import Testimonials from "@/components/home/Testimonials";
import Partners from "@/components/home/Partners";
import { CheckIcon, ArrowUpRightIcon, WhatsAppIcon } from "@/components/ui/icons";
import { formatIDR } from "@/lib/format";
import {
  treatments,
  treatmentHref,
  TREATMENT_CATEGORIES,
  type Treatment,
} from "@/data/treatments";
import { CLINIC_SAFETY_PROTOCOLS } from "@/data/clinic";
import {
  getTestimonialsForTreatment,
  hasOwnTestimonials,
} from "@/data/testimonials";
import { getFaqs } from "@/data/treatmentFaqs";
import { getSections } from "@/data/treatmentSections";
import { BOOKING_HREF, whatsappHref } from "@/lib/constants";

/**
 * The treatment detail page body, shared by both routes that render one:
 * /ubud-bali/[...slug] for the 31 treatments that live under /ubud-bali/,
 * and /eye-rejuvenaton-treatment for the one that does not.
 *
 * It was extracted from the [...slug] route unchanged. The alternative was
 * a second copy of ~450 lines of JSX that would drift from this one the
 * first time either page was edited.
 */
/**
 * What an At-a-glance row says when the clinic has not published that fact.
 *
 * The client's instruction was "a dash, or 'varies, you can ask the doctor
 * directly'". A dash was the wrong half of that choice: on a spec box a
 * bare "—" reads as "not applicable", which is a different claim from "we
 * have not published this", and on anaesthesia or downtime that difference
 * matters. This says the true thing and gives the reader somewhere to go.
 *
 * It is not a promise about the answer either — "varies" is accurate for
 * exactly the fields that are blank, because downtime and result timing
 * genuinely depend on the plan the doctor agrees with you.
 */
const GLANCE_UNPUBLISHED = "Varies — ask your doctor";

export default function TreatmentDetail({ treatment }: { treatment: Treatment }) {
  const category = TREATMENT_CATEGORIES.find((c) => c.id === treatment.category);
  // The clinic's real FAQ for this treatment — 184 questions across 25
  // treatments, extracted verbatim from the live pages.
  const faqs = getFaqs(treatment.slug);
  // The clinic's own "what this is / why choose it" copy for this
  // treatment — headings plus the specific claims underneath them.
  const sections = getSections(treatment.slug);
  const related = treatments
    .filter((t) => t.category === treatment.category && t.slug !== treatment.slug)
    .slice(0, 3);

  // Treatment time plus the four the client asked for, in their order.
  // Declared as a list so the At-a-glance markup stays one loop rather than
  // five near-identical blocks — and so adding a sixth is a one-line change.
  //
  // Treatment time joins them because it has the same problem: the live
  // site publishes no time for five treatments, and a row that silently
  // vanishes is indistinguishable from a fact that does not apply.
  const GLANCE_ROWS = [
    { label: "Treatment time", value: treatment.treatmentTime },
    { label: "Anaesthesia", value: treatment.anaesthesia },
    { label: "Downtime", value: treatment.downtime },
    { label: "Initial result", value: treatment.initialResult },
    { label: "Full result", value: treatment.fullResult },
  ];

  const heroImage =
    treatment.image ?? category?.image ?? "/images/clinic/clinic-09.jpg";
  // "Has the clinic published anything about this treatment?" — which is a
  // question about `intro` AND `sections`, not `intro` alone. Keyed off the
  // intro only, the "still being written" notice below rendered directly
  // above several hundred words of the clinic's own guide on every treatment
  // whose copy lives in treatmentSections rather than in an intro field.
  const hasLongForm = Boolean(treatment.intro) || sections.length > 0;

  // Second photo for the sidebar. It must never be the one already running
  // full-bleed behind the hero — repeating it a few hundred pixels below
  // reads as a bug. Preference order: the category photo, then a neutral
  // clinic interior that no page uses as a hero. The guard makes it
  // impossible for either branch to echo the hero.
  const CLINIC_FALLBACK = "/images/clinic/clinic-04.jpg";
  const sidebarImage =
    category?.image && category.image !== heroImage
      ? category.image
      : heroImage !== CLINIC_FALLBACK
        ? CLINIC_FALLBACK
        : null;

  return (
    <>
      <PageHero
        eyebrow={category?.label}
        // The live page's own <h1>, not the catalogue name — see the `h1`
        // field's note in treatments.ts. The breadcrumb below deliberately
        // keeps `name`: a crumb reading "Rediscover Radiance with Profhilo
        // in Ubud" would be the longest thing on the page.
        title={treatment.h1 ?? treatment.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Treatments", href: "/ubud-bali" },
          { label: treatment.name },
        ]}
        description={treatment.shortDescription}
        image={heroImage}
        imageAlt={`${treatment.name} at Healthy Look Aesthetic, Ubud`}
      >
        {treatment.startingPrice != null && (
          // Ink type, not white: this line was written when the hero was a
          // dark panel, and white-on-blush left the starting price all but
          // invisible — the one number on this page a visitor is looking for.
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/20 pt-8 font-sans text-caption uppercase tracking-caps text-ink">
            <span className="font-semibold">
              From {formatIDR(treatment.startingPrice)}
              {treatment.priceUnit ? ` ${treatment.priceUnit}` : ""}
            </span>
            <span aria-hidden="true" className="text-ink/30">
              /
            </span>
            <span>Doctor-performed</span>
          </div>
        )}
      </PageHero>

      <section className="bg-paper py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="eyebrow flex items-center gap-3 text-primary-strong">
                  <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                  About this treatment
                </span>
              </Reveal>

              <Reveal delay={90}>
                <p className="mt-9 measure font-sans text-lead text-text">
                  {treatment.shortDescription}
                </p>
              </Reveal>

              {treatment.intro && (
                <Reveal delay={140}>
                  <p className="mt-6 measure font-sans text-body leading-body text-text-secondary">
                    {treatment.intro}
                  </p>
                </Reveal>
              )}

              {!hasLongForm && (
                // Stated plainly rather than padded with invented copy. A
                // visitor is better served by an honest gap and a direct
                // line to a doctor than by filler.
                <Reveal delay={140}>
                  <div className="mt-12 border-l-2 border-primary/30 bg-background py-7 pl-7 pr-6">
                    <h2 className="font-sans text-h4 text-ink">
                      The full guide to this treatment is still being written
                    </h2>
                    <p className="mt-3 measure font-sans text-copy leading-body text-text-secondary">
                      We&rsquo;d rather leave this page short than publish information
                      about a medical treatment that hasn&rsquo;t been reviewed by our
                      doctors. In the meantime, message us and we&rsquo;ll answer any
                      question about {treatment.name} directly.
                    </p>
                    <div className="mt-7">
                      <Button
                        href={whatsappHref(
                          `Hello Healthy Look Aesthetic, I'd like to ask about ${treatment.name}.`,
                        )}
                        variant="primary"
                        size="sm"
                        external
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        Ask about {treatment.name}
                      </Button>
                    </div>
                  </div>
                </Reveal>
              )}

              {treatment.popularAreas && (
                <Reveal delay={180}>
                  <div className="mt-16">
                    {/* The clinic's own heading where it has one — it
                        writes a different line per treatment ("Popular
                        areas treated with botox") — and a generic label
                        for the treatments where it publishes the list
                        without a heading. */}
                    <h2 className="eyebrow text-primary-strong">
                      {treatment.popularAreasTitle ?? "Commonly treated areas"}
                    </h2>
                    <ul className="mt-7 grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
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

              {/* The clinic's own long-form copy. Two shapes, matching how
                  the live site actually writes them: `points` for short
                  claim bullets, `blocks` for real prose under optional
                  sub-headings (the Sylfirm/Lysiwave/Juvelook pages carry
                  several hundred words each, including comparisons like
                  "Microwaves vs Cryolipolysis in Bali"). */}
              {sections.length > 0 && (
                <div className="mt-16 flex flex-col gap-12">
                  {sections.map((section, index) => (
                    <Reveal key={section.title} delay={Math.min(index, 4) * 60}>
                      <div className="border-t border-hairline pt-8">
                        <h2 className="font-sans text-h4 leading-tight text-ink">
                          {section.title}
                        </h2>

                        {section.points && (
                          <ul className="mt-5 flex flex-col gap-3">
                            {section.points.map((point) => (
                              <li
                                key={point}
                                className="measure flex gap-3 font-sans text-copy leading-body text-text-secondary"
                              >
                                <CheckIcon className="mt-1.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.blocks && (
                          <div className="mt-6 flex flex-col gap-7">
                            {section.blocks.map((block, blockIndex) => (
                              <div key={block.heading ?? blockIndex}>
                                {block.heading && (
                                  <h3 className="font-sans text-copy-lg font-medium leading-snug text-ink">
                                    {block.heading}
                                  </h3>
                                )}
                                <div
                                  className={`flex flex-col gap-4 ${block.heading ? "mt-3" : ""}`}
                                >
                                  {block.paragraphs.map((paragraph) => (
                                    <p
                                      key={paragraph.slice(0, 40)}
                                      className="measure font-sans text-body leading-body text-text-secondary"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}

              {treatment.priceGroups && (
                <Reveal delay={220}>
                  <div className="mt-16">
                    <h2 className="font-script text-h3 text-primary">
                      Pricing
                    </h2>
                    <div className="mt-8">
                      <PriceTable groups={treatment.priceGroups} />
                    </div>
                    <p className="mt-6 measure font-sans text-label leading-relaxed text-muted">
                      Final pricing is confirmed at consultation, once a doctor has
                      assessed what you actually need. All prices are nett and
                      inclusive of tax.
                    </p>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Sidebar. The image is deliberately NOT the hero photo —
                see `sidebarImage` above; repeating the hero a few hundred
                pixels below it reads as a bug rather than as composition. */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                {sidebarImage && (
                  <Reveal variant="image" className="mb-9">
                    <Img
                      src={sidebarImage}
                      alt={`${category?.label} treatments at Healthy Look Aesthetic`}
                      aspect="landscape"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </Reveal>
                )}

                <Reveal>
                  <div className="border border-hairline bg-background p-8">
                    <h2 className="eyebrow text-primary-strong">At a glance</h2>
                    <dl className="mt-6">
                      {treatment.startingPrice != null && (
                        <div className="flex items-baseline justify-between gap-5 border-b border-hairline py-3.5">
                          <dt className="font-sans text-copy text-ink">
                            Starting from
                          </dt>
                          <dd className="font-sans text-sm tabular-nums text-primary-strong">
                            {formatIDR(treatment.startingPrice)}
                            {treatment.priceUnit && (
                              <span className="ml-1 text-caption text-muted">
                                {treatment.priceUnit}
                              </span>
                            )}
                          </dd>
                        </div>
                      )}
                      {/* ── CLIENT REVISION (Treatments 2) ──────────────
                          Treatment time, then anaesthesia, downtime and the
                          two result timelines in the client's own order —
                          the things someone fitting an appointment into a
                          holiday came to this box for.

                          ── WHY EVERY ROW RENDERS, EVEN EMPTY ONES ──────
                          These used to be dropped when the clinic had not
                          published a value, which meant the box was a
                          different shape on every treatment: five rows on
                          Sylfirm X, two on IV Drip. A reader could not tell
                          whether a fact was missing or simply did not apply,
                          and comparing two treatments meant comparing two
                          different tables.

                          So the row always appears, and an unpublished value
                          says so in the clinic's own terms rather than
                          showing a blank or a guess. It is set in `muted`
                          against the answered rows' `text-secondary`, so
                          the two are distinguishable at a glance without
                          reading — you can see which facts are published. */}
                      {GLANCE_ROWS.map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex items-baseline justify-between gap-5 border-b border-hairline py-3.5"
                        >
                          <dt className="font-sans text-copy text-ink">{label}</dt>
                          <dd
                            className={`text-right font-sans text-sm ${
                              value ? "text-text-secondary" : "text-muted"
                            }`}
                          >
                            {value ?? GLANCE_UNPUBLISHED}
                          </dd>
                        </div>
                      ))}
                      <div className="flex items-baseline justify-between gap-5 border-b border-hairline py-3.5">
                        <dt className="font-sans text-copy text-ink">Category</dt>
                        <dd className="font-sans text-sm text-text-secondary">
                          {category?.label}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-5 border-b border-hairline py-3.5">
                        <dt className="font-sans text-copy text-ink">Performed by</dt>
                        <dd className="font-sans text-sm text-text-secondary">
                          Licensed doctor
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-8">
                      <Button href={BOOKING_HREF} variant="primary" className="w-full" withArrow>
                        Book this treatment
                      </Button>
                    </div>
                  </div>
                </Reveal>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Clinic safety commitments — the clinic's own published protocols,
          shown on every treatment page because they apply to every one. */}
      <section className="bg-ink-brown py-section text-white">
        <Container>
          {/* ── CLIENT REVISION — "WHY HERE" → "TREATMENT JOURNEY" ──────
              This is the one "Why Here" label on the site — the numbered
              safety-protocol grid every treatment page shares. It already
              renders as 01–07, title, description per item, which is the
              structure the client asked a "Treatment Journey" to have; only
              the eyebrow's wording changes, not the protocols themselves or
              the "How we treat you" heading beneath it. */}
          <SectionHeading tone="dark" eyebrow="Treatment Journey" title="How we treat you" />
          <div className="mt-16 grid gap-x-16 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
            {CLINIC_SAFETY_PROTOCOLS.map((point, index) => (
              <Reveal key={point.title} delay={index * 70}>
                <div className="border-t border-white/15 pt-7">
                  <span
                    className="font-script text-statement leading-none text-gold-soft/70"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-sans text-h4 leading-tight text-white">
                    {point.title}
                  </h3>
                  <p className="mt-3.5 font-sans text-copy leading-body text-white/55">
                    {point.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The hero claims "Doctor-performed" — this is where that claim is
          evidenced, directly after the safety protocols that lead into it. */}
      <DoctorCredit
        description={`Every ${treatment.name.toLowerCase()} consultation, treatment plan, and injection at Healthy Look Aesthetic is handled by a licensed doctor, never a therapist.`}
      />

      {faqs.length > 0 && (
        <section className="bg-wash py-section">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <SectionHeading
                    align="left"
                    eyebrow="Questions"
                    // The live site's own heading is the plain "FAQ" on
                    // every treatment page — kept literal rather than
                    // reworded, since no client note asked for the change.
                    title="FAQ"
                    description={`${faqs.length} question${faqs.length === 1 ? "" : "s"} our doctors are asked most often about this treatment.`}
                  />
                </div>
              </div>
              <div className="lg:col-span-8">
                <Reveal delay={100}>
                  <Accordion
                    defaultOpen={0}
                    items={faqs.map((faq, index) => ({
                      id: `${treatment.slug.replace(/\//g, "-")}-faq-${index}`,
                      question: faq.question,
                      answer: faq.answer,
                    }))}
                  />
                </Reveal>
              </div>
            </div>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-background py-section">
          <Container>
            <SectionHeading
              align="left"
              eyebrow="Also in this category"
              title={category?.label ?? "Related treatments"}
            />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 80}>
                  <Link
                    href={treatmentHref(item)}
                    className="group flex h-full flex-col border border-hairline transition-colors duration-300 hover:border-primary/40"
                  >
                    {/* No category-image fallback here — that's what put
                        the same photo in this card and in the sidebar. A
                        treatment without its own photo gets a typographic
                        tile instead. */}
                    <TreatmentThumb
                      src={item.image}
                      name={item.name}
                      categoryLabel={category?.label}
                    />
                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="flex items-start justify-between gap-3 font-sans text-h4 leading-tight text-ink transition-colors duration-300 group-hover:text-primary">
                        {item.name}
                        <ArrowUpRightIcon className="mt-1 h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </h3>
                      <p className="mt-3.5 flex-1 font-sans text-sm leading-relaxed text-text-secondary">
                        {item.shortDescription}
                      </p>
                      {item.startingPrice != null && (
                        <p className="mt-6 font-sans text-micro uppercase tracking-caps text-muted">
                          From {formatIDR(item.startingPrice)}
                        </p>
                      )}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* "Be Empowered to Feel Truly Confident" is the clinic's own heading
          for the before/after block on its treatment pages. The heading is
          kept; the gallery is not faked. The clinic has exactly one
          before/after asset and it belongs to one specific patient —
          dropping it onto 27 treatment pages would imply it shows each of
          them, which is the invented-result the brief prohibits. So this
          band carries the real heading and routes to the results page. */}
      <section className="bg-section py-16">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-script text-h2 leading-heading text-primary">
                Be Empowered to Feel Truly Confident
              </h2>
              <p className="mt-3 measure font-sans text-sm leading-relaxed text-text-secondary">
                See real patient results from our Ubud clinic. Individual results
                vary. Your doctor will discuss what is realistic for you.
              </p>
            </div>
            <Button href="/before-after" variant="outline" withArrow className="shrink-0">
              View before &amp; after
            </Button>
          </div>
        </Container>
      </section>

      {/* The products strip runs on every treatment page of the live site
          ("Only the Best Worldwide Products"); the rebuild had it on the
          homepage only, so a content audit flagged it as missing from all
          27 treatment pages. It belongs here more than anywhere: someone
          reading about an injectable wants to know whose product goes in. */}
      <Partners />
      {/* Reviews are per-treatment on the live site — the Botox page runs
          Botox reviews, not the clinic's generic ones. getTestimonialsForTreatment
          reproduces that mapping and falls back to the clinic-wide set for
          the treatments the live site gives no reviews to. The subtitle only
          names the treatment when the reviews really are about it — on a
          fallback page it stays about the clinic. */}
      <Testimonials
        items={getTestimonialsForTreatment(treatment.slug)}
        subject={
          hasOwnTestimonials(treatment.slug) ? treatment.name : undefined
        }
      />
      <BookingSection />
    </>
  );
}
