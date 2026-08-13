import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/shared/ContactForm";
import Img from "@/components/ui/Img";
import Button from "@/components/ui/Button";
import {
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  CheckIcon,
} from "@/components/ui/icons";
import {
  EMAIL,
  PHONE_DISPLAY,
  PHONE_E164,
  ADDRESS,
  OPENING_HOURS,
  MAPS_HREF,
  whatsappHref,
} from "@/lib/constants";
import { CLINIC_SAFETY_PROTOCOLS } from "@/data/clinic";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/book-now")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/book-now" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * /book-now — the live site's own booking URL, previously a 404 here even
 * though the header CTA on the real site points at it.
 *
 * The two lines quoted below are the clinic's own, from this page on the
 * live site. "A safe place where you can hear 'no'" is the single most
 * unusual thing they say about themselves — a clinic advertising its
 * willingness to turn work away — and it belongs on the page where
 * someone is deciding to commit.
 *
 * Note the site's own CTAs still point at the homepage enquiry section
 * (`BOOKING_HREF`), not here: that section offers WhatsApp, phone and
 * email side by side, which converts better than routing everyone to a
 * form. This page exists so the real URL resolves and so there's a
 * dedicated destination for anyone who lands on it directly.
 */
export default function BookNowPage() {
  return (
    <>
      <PageHero
        eyebrow="Book an appointment"
        title="Start Your Journey to Confidence at Healthy Look Aesthetic"
        scriptTitle={false}
        crumbs={[{ label: "Home", href: "/" }, { label: "Book Now" }]}
        // ── CLIENT REVISION (Book Now 1) ─────────────────────────────
        // This read "A doctor will confirm what's realistic before
        // anything is booked in", and the clinic asked for it changed
        // because they do not offer a video consultation before arrival.
        // Read literally, that sentence promised one: a doctor assessing
        // your case in the gap between enquiring and being booked in.
        //
        // The honest-opinion positioning is the clinic's own and worth
        // keeping, so only the timing moves — the doctor conversation
        // happens in person, at the appointment, which is when it actually
        // happens. Nobody arrives expecting a call that was never offered.
        description="Tell us what you're considering and when suits you, and we'll confirm your appointment by email or WhatsApp. Your doctor talks through what's realistic with you in person, before anything begins."
        image="/images/clinic/clinic-01.jpg"
        imageAlt="Healthy Look Aesthetic clinic, Ubud"
      />

      {/* The clinic's own promise */}
      <section className="bg-ink-brown py-section-lg text-white">
        <Container>
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="font-script text-h1 leading-script text-white">
              &ldquo;A safe place where you can hear &lsquo;no&rsquo;. That&rsquo;s our
              promise.&rdquo;
            </p>
            <p className="mt-10 font-sans text-h4 font-light text-white/60">
              The best beauty treatments should be undetectable
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Form + channels */}
      <section className="bg-paper py-section">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="eyebrow flex items-center gap-3 text-primary-strong">
                  <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                  Request an appointment
                </span>
              </Reveal>

              <Reveal delay={90}>
                <div className="mt-10 border border-primary/15 bg-background p-8 sm:p-12">
                  <ContactForm withSchedule />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={120}>
                <h2 className="font-script text-h2 leading-heading text-primary">
                  Or just message us
                </h2>
              </Reveal>

              <Reveal delay={170}>
                {/* py-2.5 on each row: the text alone gave a 27px-tall link,
                    and on the booking page these three channels are the whole
                    point of the screen. 47px each now, past the 44px touch
                    minimum, with the list's gap-5 keeping them apart. */}
                <ul className="mt-10 flex flex-col gap-5 border-t border-primary/20 pt-9">
                  <li>
                    <a
                      href={whatsappHref(
                        "Hello Healthy Look Aesthetic, I'd like to book an appointment.",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 py-2.5 font-sans text-copy-lg text-ink transition-colors hover:text-primary"
                    >
                      <WhatsAppIcon className="h-5 w-5 shrink-0 text-primary" />
                      WhatsApp us
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${PHONE_E164}`}
                      className="flex items-center gap-4 py-2.5 font-sans text-copy-lg text-ink transition-colors hover:text-primary"
                    >
                      <PhoneIcon className="h-5 w-5 shrink-0 text-primary" />
                      {PHONE_DISPLAY}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="flex items-center gap-4 break-all py-2.5 font-sans text-copy-lg text-ink transition-colors hover:text-primary"
                    >
                      <MailIcon className="h-5 w-5 shrink-0 text-primary" />
                      {EMAIL}
                    </a>
                  </li>
                </ul>
              </Reveal>

              <Reveal delay={220}>
                <ul className="mt-9 flex flex-col gap-4 font-sans text-sm text-text-secondary">
                  <li className="flex items-start gap-4">
                    <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {/* Same `-my-1 py-1` as BookingSection: 28px tap target,
                        layout unchanged so the address stays level with the
                        pin icon. */}
                    <a
                      href={MAPS_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="-my-1 py-1 transition-colors hover:text-primary"
                    >
                      {ADDRESS}
                    </a>
                  </li>
                  <li className="flex items-start gap-4">
                    <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {OPENING_HOURS}
                  </li>
                </ul>
              </Reveal>

              {/*
                ── THE SAFETY BLOCK, AND WHAT WAS WRONG WITH IT ──────────
                Seven protocol titles used to render here as a bare list of
                middot-prefixed phrases, with no heading, sitting below the
                photograph at the very foot of the column. Three problems,
                and they compounded into "why is this here":

                 1. No label. A reader met seven unexplained fragments —
                    "Premium brands", "Strict cold-chain management" — with
                    nothing saying these were safety standards.
                 2. A `·` before each item. It is not a bullet the reader
                    recognises and it is not a mark that means anything; it
                    just made each line start with noise.
                 3. It came after the photo, so the column ran
                    contact → address → picture → orphaned list. The list
                    read as something left over rather than as content.

                Now it is a labelled block with the site's own check mark —
                which says "we do this" where a middot said nothing — and
                it sits with the practical details it belongs beside. The
                photo moved below it, so the column closes on the picture
                instead of on a fragment.

                Titles only, as before: the full descriptions run on
                /our-doctor and the link goes there. In a sidebar next to a
                booking form, seven paragraphs would compete with the form.
              */}
              <Reveal delay={270}>
                <div className="mt-10 border-t border-hairline pt-8">
                  <h3 className="eyebrow text-primary-strong">
                    Every treatment here
                  </h3>

                  <ul className="mt-6 flex flex-col gap-3.5">
                    {CLINIC_SAFETY_PROTOCOLS.map((p) => (
                      <li
                        key={p.title}
                        className="flex items-start gap-3 font-sans text-label leading-relaxed text-text-secondary"
                      >
                        <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                        {p.title}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7">
                    <Button href="/our-doctor" variant="quiet" size="sm" withArrow>
                      Read the full protocols
                    </Button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={320} variant="image" className="mt-10">
                <Img
                  src="/images/clinic/clinic-05.jpg"
                  alt="Healthy Look Aesthetic clinic, Ubud"
                  aspect="landscape"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
