import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Img from "@/components/ui/Img";
import BookingSection from "@/components/home/BookingSection";
import { WhatsAppIcon } from "@/components/ui/icons";
import { formatIDR } from "@/lib/format";
import {
  GIFT_CARD_HEADING,
  GIFT_CARD_TAGLINE,
  GIFT_CARD_INTRO,
  GIFT_CARD_BODY,
  GIFT_CARD_VALUES,
  GIFT_CARD_TERMS,
} from "@/data/offers";
import { whatsappHref } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gift Card",
  description:
    "Healthy Look Aesthetic eGift Cards — from IDR 1,500,000, redeemable against any treatment on our menu and valid for 24 months.",
  alternates: { canonical: "/gift-card" },
};

/**
 * /gift-card — previously a 404 linked from the nav and footer.
 *
 * ── On the "Buy Now" flow ──
 * The live site sells these through its own checkout. This build has no
 * payments integration and the brief forbids inventing a business
 * process, so the denomination tiles are not a fake cart: each one opens
 * WhatsApp with that amount pre-filled, which is a real way to actually
 * complete the purchase with the clinic rather than a button that
 * pretends to take money and doesn't.
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
                        : "mt-6 text-[length:var(--fs-body)] leading-[var(--lh-body)] text-text-secondary"
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
            <span className="eyebrow flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
              Choose an amount
            </span>
          </Reveal>

          <Reveal delay={90}>
            <h2 className="mt-8 max-w-2xl font-script text-[length:var(--fs-h2)] leading-[var(--lh-heading)] text-primary">
              Any value, redeemable against any treatment
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GIFT_CARD_VALUES.map((value, index) => {
              const label = value === null ? "Custom Amount" : formatIDR(value);
              const message =
                value === null
                  ? "Hello Healthy Look Aesthetic, I'd like to buy a gift card for a custom amount."
                  : `Hello Healthy Look Aesthetic, I'd like to buy a gift card for ${formatIDR(value)}.`;
              return (
                <Reveal key={label} delay={index * 60}>
                  <a
                    href={whatsappHref(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border border-primary/20 bg-background px-8 py-7 transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <span className="font-sans text-[length:var(--fs-h4)] tabular-nums text-ink transition-colors group-hover:text-white">
                      {label}
                    </span>
                    <WhatsAppIcon className="h-4 w-4 shrink-0 text-primary transition-colors group-hover:text-white" />
                  </a>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={120}>
            <p className="mt-8 measure font-sans text-[0.8125rem] leading-relaxed text-muted">
              Gift cards are arranged directly with the clinic over WhatsApp — pick an
              amount above and we&rsquo;ll confirm payment and delivery with you.
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
                <span className="eyebrow flex items-center gap-3 text-primary">
                  <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                  Good to know
                </span>
              </Reveal>
              <Reveal delay={90}>
                <h2 className="mt-8 font-script text-[length:var(--fs-h2)] leading-[var(--lh-heading)] text-primary">
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
                        <span className="pt-1 font-sans text-[0.75rem] tabular-nums tracking-widest text-muted">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="measure font-sans text-[0.9375rem] leading-[var(--lh-body)] text-text-secondary">
                          {term}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>

              <Reveal delay={200}>
                <div className="mt-10">
                  <Button
                    href={whatsappHref(
                      "Hello Healthy Look Aesthetic, I'd like to buy a gift card.",
                    )}
                    variant="primary"
                    external
                    withArrow
                  >
                    Buy a gift card
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <BookingSection />
    </>
  );
}
