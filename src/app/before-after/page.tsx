import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Testimonials from "@/components/home/Testimonials";
import BookingSection from "@/components/home/BookingSection";
import { ArrowUpRightIcon, InstagramIcon } from "@/components/ui/icons";
import { resultGroups } from "@/data/results";
import { INSTAGRAM_HREF, BOOKING_HREF } from "@/lib/constants";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/before-after")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/before-after" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * /before-after
 *
 * ── WHAT CHANGED ──────────────────────────────────────────────────────
 * This page carried a single photograph, under a note stating the clinic
 * had exactly one before/after asset. That was read off this repo's public
 * folder rather than off the live site, which publishes 56 photographs
 * across six treatment categories. All 56 are here now.
 *
 * ── WHY GROUPED SECTIONS AND NOT ONE GRID ─────────────────────────────
 * Fifty-six thumbnails in an undifferentiated wall is a data dump: nobody
 * arrives at this page wanting "results", they arrive wanting results for
 * the one treatment they are considering. Six labelled groups plus a jump
 * bar turns the page into something you can answer a question with.
 *
 * It is also all server-rendered with real anchors rather than a client
 * filter. These photographs are the page's ranking asset, and a JS filter
 * would hide five sixths of them from a crawler and from anyone who lands
 * with JS still loading.
 *
 * ── WHAT IS DELIBERATELY ABSENT ───────────────────────────────────────
 * No captions describing outcomes, no timescales, no unit counts, no
 * "6 weeks post-treatment" labels. The clinic has not published those, and
 * inventing them on a medical page is the one thing this page must never
 * do. The category name is the only label, exactly as on the live site.
 * Each photograph carries its own Before/After marks and the clinic's
 * watermark, burned in at source.
 */
export default function BeforeAfterPage() {
  return (
    <>
      <PageHero
        eyebrow="Results"
        title="Before &amp; After"
        crumbs={[{ label: "Home", href: "/" }, { label: "Before & After" }]}
        description="Outcomes from treatments performed at our Ubud clinic, shared with patient consent."
        image="/images/clinic/clinic-05.jpg"
        imageAlt="Treatment room at Healthy Look Aesthetic, Ubud"
      />

      {/* ── CLIENT REVISION — AUTHENTICITY STATEMENT ────────────────────
          "Real patients, real results. No filter, no edit." — added as its
          own prominent line, ahead of the "individual results vary"
          disclaimer so the authenticity claim is the first thing read, not
          buried under a qualifier. Photographs and captions are unchanged. */}
      <section className="border-b border-hairline bg-paper">
        <Container className="py-8 text-center">
          <p className="font-script text-h3 leading-heading text-primary">
            Real patients, real results. No filter, no edit.
          </p>
        </Container>
      </section>

      {/* Disclaimer next: it qualifies everything below it, so it has to
          be read before the photographs and not after them. */}
      <section className="border-b border-primary/20 bg-section">
        <Container className="py-5">
          <p className="measure-narrow font-sans text-caption leading-body text-ink">
            <strong className="font-semibold">Individual results vary.</strong> Every
            photograph shows one patient&rsquo;s outcome. What is achievable for you
            depends on your anatomy, and a doctor will tell you honestly at
            consultation.
          </p>
        </Container>
      </section>

      {/* Jump bar. Scroll-snap pills rather than a wrapping row of links:
          six treatment names do not fit on one line at 375px, and a
          two-line link row directly under a sticky header reads as clutter. */}
      <nav
        aria-label="Jump to a treatment"
        className="sticky top-20 z-30 border-b border-hairline bg-paper/95 backdrop-blur-md lg:top-24"
      >
        <Container className="flex snap-x snap-mandatory gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {resultGroups.map((group) => (
            <a
              key={group.slug}
              href={`#${group.slug}`}
              // `flex items-center min-h-11`: the pill measured 35px on its
              // padding alone. The floor takes it to 44px — and it has to be
              // a floor rather than more py, because these already sit in a
              // sticky bar where every extra pixel is charged to the reading
              // area for the whole page. Centring keeps the label where it
              // was inside the taller pill.
              className="flex min-h-11 snap-start items-center whitespace-nowrap rounded-brand border border-hairline px-4 py-2 font-sans text-caption uppercase tracking-caps text-text-secondary transition-colors duration-300 hover:border-primary/50 hover:text-primary-strong"
            >
              {group.label}
              <span className="ml-2 text-muted">{group.images.length}</span>
            </a>
          ))}
        </Container>
      </nav>

      {resultGroups.map((group, groupIndex) => (
        <section
          key={group.slug}
          id={group.slug}
          // scroll-mt clears both the fixed header and the sticky jump bar,
          // so an anchor lands with the heading visible rather than tucked
          // underneath them.
          className={`scroll-mt-36 py-section lg:scroll-mt-40 ${
            groupIndex % 2 === 0 ? "bg-paper" : "bg-wash"
          }`}
        >
          <Container>
            <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-script text-h2 leading-heading text-primary">
                  {group.label}
                </h2>
                <p className="mt-2 font-sans text-caption uppercase tracking-caps text-muted">
                  {group.images.length} {group.images.length === 1 ? "result" : "results"}
                </p>
              </div>

              {group.treatmentSlug && (
                <Link
                  href={`/ubud-bali/${group.treatmentSlug}`}
                  // `pt-2` for the tap target — see DoctorCredit for why the
                  // height goes above the text rather than below.
                  className="group/link inline-flex shrink-0 items-center gap-2 border-b border-primary/35 pt-2 pb-1 font-sans text-caption font-semibold uppercase tracking-caps-wide text-primary-strong transition-colors duration-300 hover:border-primary-strong"
                >
                  About this treatment
                  <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              )}
            </Reveal>

            {/* Square cells because every source photograph is square: a
                4:3 or 16:9 cell would crop the "after" half off the bottom
                of a stacked before/after. */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {group.images.map((src, index) => (
                <Reveal key={src} delay={Math.min(index, 7) * 45}>
                  <div className="relative aspect-square overflow-hidden border border-hairline bg-background">
                    <Image
                      src={src}
                      alt={`Before and after ${group.label} at Healthy Look Aesthetic, Ubud`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      quality={75}
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ))}

      {/*
        ── CLIENT REVISION (Before & After 2) ────────────────────────────
        "Please remove it as it can violates the law."
        …quoting the paragraph that used to sit here:
        "These 56 photographs are the ones our patients have agreed to
        publish. We hold more for most treatments and can show you relevant
        cases at consultation, or send them over on WhatsApp before you
        book." — followed by their suggestion, "May be invite the visitors
        to visit our instagram for the most updated before-after".

        The problem was the second half of that sentence, and it is a real
        one. It advertised that the clinic holds patient photographs BEYOND
        the ones consented for publication, and offered to send them to a
        stranger over WhatsApp before they had even booked. Whatever the
        intent, as written it is the clinic publicly offering to distribute
        patient medical images to prospective customers — and in Indonesia,
        advertising by health facilities is regulated well before you reach
        the patient-privacy question.

        Two things replace it, both of which the clinic can stand behind:
        Instagram, which is theirs and where they publish results they have
        cleared; and the consultation, where a doctor discusses what is
        realistic with a patient in person. Neither of those is the site
        offering to send photographs to anyone who asks.

        ⚠ This removes a claim, not a photograph. The 56 published results
        above are untouched — the client's own note 1 says they are sending
        MORE, so the gallery is not what they asked to remove.
      */}
      <section className="bg-background py-section">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-script text-h2 leading-heading text-primary">
              Looking for a treatment not shown here
            </h2>
            <p className="mx-auto mt-6 measure-narrow font-sans text-copy leading-body text-text-secondary">
              We share new results on Instagram as our patients agree to publish
              them. For what is realistically achievable in your own case, a doctor
              will talk it through with you at consultation.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href={INSTAGRAM_HREF} variant="primary" external>
                <InstagramIcon className="h-4 w-4" />
                See our latest on Instagram
              </Button>
              <Button href={BOOKING_HREF} variant="outline">
                Book a consultation
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <Testimonials />
      <BookingSection />
    </>
  );
}
