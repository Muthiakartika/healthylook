import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Img from "@/components/ui/Img";
import GiftCardForm from "@/components/shared/GiftCardForm";
import {
  ArrowDownIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
} from "@/components/ui/icons";
import { formatIDR } from "@/lib/format";
import {
  GIFT_CARD_HEADING,
  GIFT_CARD_TAGLINE,
  GIFT_CARD_INTRO,
  GIFT_CARD_BODY,
  GIFT_CARD_VALUES,
  GIFT_CARD_DESIGNS,
  GIFT_CARD_TERMS,
} from "@/data/offers";
import { whatsappHref, PHONE_DISPLAY, PHONE_E164, EMAIL } from "@/lib/constants";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/gift-card")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/gift-card" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * /gift-card — previously a 404 linked from the nav and footer.
 *
 * ── CLIENT REVISION (Gift Card 1) ─────────────────────────────────────
 * "When the visitor click buy gift card, there's form that they need to
 * fill. Please use the same form as the previous one."
 *
 * Every buy affordance on this page — the denomination tiles, the design
 * chips, the closing button — now lands on a real form at #buy instead of
 * opening WhatsApp with a pre-filled message.
 *
 * It is the same <ContactForm> the booking page and the homepage use, not
 * a copy of it: same validation, same honeypot, same rate limiting, same
 * email backend, same WhatsApp fallback when that backend is unreachable.
 * What differs is only which questions it asks — the treatment dropdown is
 * replaced by amount and design, and the enquiry arrives in the clinic's
 * inbox subject-lined "Gift card" so it is filterable without opening it.
 * See ContactForm's `fields` prop for why parameterising beat duplicating.
 *
 * ── On payment ──
 * The live site sells these through its own checkout. This build has no
 * payments integration and the brief forbids inventing a business process,
 * so the form is an order request the clinic confirms — which is what the
 * copy says it is. It does not pretend to take money.
 *
 * The terms are reproduced verbatim — the 24-month validity and the
 * non-refundable clause are contractual, and a gift card is exactly the
 * kind of purchase where a paraphrased term causes a real dispute.
 */
export default function GiftCardPage() {
  return (
    <>
      <PageHero
        eyebrow={GIFT_CARD_TAGLINE}
        title={GIFT_CARD_HEADING}
        crumbs={[{ label: "Home", href: "/" }, { label: "Gift Card" }]}
        description={GIFT_CARD_INTRO}
        image="/images/treatments/treatment-10.jpg"
        imageAlt="Healthy Look Aesthetic gift card"
      />

      {/* Story */}
      <section className="bg-paper py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              {GIFT_CARD_BODY.map((paragraph, index) => (
                <Reveal key={paragraph} delay={index * 80}>
                  <p
                    className={`measure font-sans ${
                      index === 0
                        ? "text-lead text-text"
                        : "mt-6 text-body leading-body text-text-secondary"
                    }`}
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={140} variant="image" className="lg:col-span-5">
              <Img
                src="/images/clinic/clinic-09.jpg"
                alt="Inside Healthy Look Aesthetic, Ubud"
                aspect="landscape"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Denominations */}
      <section className="bg-wash py-section">
        <Container>
          <Reveal>
            <span className="eyebrow flex items-center gap-3 text-primary-strong">
              <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
              Choose an amount
            </span>
          </Reveal>

          <Reveal delay={90}>
            <h2 className="mt-8 max-w-2xl font-script text-h2 leading-heading text-primary">
              Any value, redeemable against any treatment
            </h2>
          </Reveal>

          {/* The tiles and chips are now anchors to the form rather than
              WhatsApp links. They stay clickable because they are still
              the fastest way down to the order form, and because a grid of
              prices that does nothing when clicked is worse than one that
              scrolls. The amount itself is chosen in the form — carrying a
              selection across an anchor jump would need client state for a
              dropdown the visitor is about to see anyway. */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GIFT_CARD_VALUES.map((value, index) => {
              const label = value === null ? "Custom Amount" : formatIDR(value);
              return (
                <Reveal key={label} delay={index * 60}>
                  <a
                    href="#buy"
                    className="group flex items-center justify-between gap-4 border border-primary/20 bg-background px-8 py-7 transition-colors duration-300 hover:border-primary-strong hover:bg-primary-strong hover:text-white"
                  >
                    <span className="font-sans text-h4 tabular-nums text-ink transition-colors group-hover:text-white">
                      {label}
                    </span>
                    <ArrowDownIcon className="h-4 w-4 shrink-0 text-primary transition-colors group-hover:text-white" />
                  </a>
                </Reveal>
              );
            })}
          </div>

          {/* The six occasions the live form offers. Without them a buyer
              could choose a value but not what the card is for. */}
          <Reveal delay={110}>
            <h3 className="mt-16 eyebrow text-primary-strong">Card design</h3>
          </Reveal>
          <div className="mt-7 flex flex-wrap gap-3">
            {GIFT_CARD_DESIGNS.map((design, index) => (
              <Reveal key={design} delay={index * 50}>
                <a
                  href="#buy"
                  className="inline-flex items-center gap-2.5 rounded-brand border border-hairline bg-background px-5 py-3 font-sans text-label text-ink transition-colors duration-300 hover:border-primary-strong hover:bg-primary-strong hover:text-white"
                >
                  {design}
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-8 measure font-sans text-label leading-relaxed text-muted">
              Choose your amount and design in the form below. We&rsquo;ll confirm
              payment and delivery with you directly.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Terms */}
      <section className="bg-background py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="eyebrow flex items-center gap-3 text-primary-strong">
                  <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                  Good to know
                </span>
              </Reveal>
              <Reveal delay={90}>
                <h2 className="mt-8 font-script text-h2 leading-heading text-primary">
                  How it works
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <ul className="border-t border-hairline">
                {GIFT_CARD_TERMS.map((term, index) => (
                  <li key={term} className="border-b border-hairline">
                    <Reveal delay={index * 60}>
                      <div className="flex gap-6 py-6 sm:gap-10">
                        <span className="pt-1 font-sans text-caption tabular-nums tracking-widest text-muted">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="measure font-sans text-copy leading-body text-text-secondary">
                          {term}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>

              <Reveal delay={200}>
                <div className="mt-10">
                  <Button href="#buy" variant="primary" withArrow>
                    Buy a gift card
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/*
        ── ORDER FORM — LAST, AND THE ONLY FORM ON THIS PAGE ─────────────
        This page used to end on <BookingSection>, the general enquiry
        block that closes every other page. With the gift card form added
        above it, that left two forms on one page, both asking for a name,
        an email and a phone number, with nothing telling the visitor which
        one was theirs. Two forms for one intent is a choice the reader has
        to make and cannot make correctly.

        So the enquiry block is gone from this page and the gift card form
        moved down into its place. It also moved BELOW the terms, which is
        the order a purchase actually happens in: what it is, what it
        costs, what the conditions are, then order. Ending a sales page on
        legal small print wastes the last screen.

        It keeps `bg-section` — the pale lime <BookingSection> used — so
        the page still closes on the brand's conversion colour, and the
        three contact channels it carried are restated on the left. Nothing
        was lost except the duplicate form.
      */}
      <section id="buy" className="scroll-mt-28 bg-section py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="eyebrow flex items-center gap-3 text-primary-strong">
                  <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                  Buy a gift card
                </span>
              </Reveal>
              <Reveal delay={90}>
                <h2 className="mt-8 font-script text-h1 leading-script text-primary">
                  Tell us who it&rsquo;s for
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-8 measure-narrow font-sans text-lead text-text">
                  Fill this in and we&rsquo;ll come back to you to arrange payment and
                  send the card — straight to them, or to you to give yourself.
                </p>
              </Reveal>

              {/* The channels <BookingSection> was providing. A gift card
                  is often bought in a hurry for a date that is close, so
                  the fastest route has to stay on the page. */}
              <Reveal delay={210}>
                <ul className="mt-12 flex flex-col gap-5 border-t border-primary/20 pt-10">
                  <li>
                    <a
                      href={whatsappHref(
                        "Hello Healthy Look Aesthetic, I'd like to buy a gift card.",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 font-sans text-copy-lg text-ink transition-colors hover:text-primary"
                    >
                      <WhatsAppIcon className="h-5 w-5 shrink-0 text-primary" />
                      Arrange it on WhatsApp instead
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${PHONE_E164}`}
                      className="flex items-center gap-4 font-sans text-copy-lg text-ink transition-colors hover:text-primary"
                    >
                      <PhoneIcon className="h-5 w-5 shrink-0 text-primary" />
                      {PHONE_DISPLAY}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="flex items-center gap-4 break-all font-sans text-copy-lg text-ink transition-colors hover:text-primary"
                    >
                      <MailIcon className="h-5 w-5 shrink-0 text-primary" />
                      {EMAIL}
                    </a>
                  </li>
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={140}>
                <div className="rounded-edge border border-primary/15 bg-background p-8 sm:p-12">
                  {/* The live site's own gift card form — recipient, buyer,
                      delivery date and delivery preference. See
                      GiftCardForm for why it is its own component rather
                      than <ContactForm> with different props. */}
                  <GiftCardForm />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
