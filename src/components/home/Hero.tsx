import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowDownIcon, StarIcon } from "@/components/ui/icons";
import {
  HERO_HEADLINE,
  HERO_SUBHEADLINE,
  BOOKING_HREF,
  BOOKING_LABEL,
  OPENING_HOURS,
} from "@/lib/constants";

/**
 * SECTION 01 — HERO
 *
 * Within a few seconds the visitor should know what this is, what's
 * offered, why to trust it, and what to do next:
 *
 *   what it is      → the wordmark + "Aesthetic Clinic in Bali"
 *   what's offered  → the subheadline, verbatim from the live site
 *   why trust it    → the trust strip along the bottom
 *   what to do      → one primary CTA, one secondary
 *
 * The headline is split across two type voices — Tangerine for the
 * emotional half, Poppins for the clinical qualifier. The sentence itself
 * is unchanged; only its typographic emphasis is new.
 *
 * ── On the photograph ──
 * This is the clinic's own image, and like everything else in their media
 * library it's square (1080×1080). A square source in a full-bleed
 * viewport-height frame crops hard, so it's positioned `object-right` on
 * desktop: the type occupies the left two-thirds, and letting the crop
 * favour the right keeps the subject out from behind the text rather than
 * buried under it.
 */
const TRUST_POINTS = [
  "Doctor-performed injectables",
  "Inside a five-star Ubud resort",
  OPENING_HOURS,
];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/clinic/website-pictures.jpg"
          alt="Healthy Look Aesthetic clinic in Ubud, Bali"
          fill
          // The one image on the site that should preload: it's the
          // largest-contentful-paint element on the landing page.
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center lg:object-right"
        />
        {/* Two gradients rather than one flat overlay: a left-to-right
            wash so the type has contrast where it sits, and a bottom fade
            for the trust strip. A single uniform overlay would grey out
            the whole photograph. */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent"
          aria-hidden="true"
        />
      </div>

      <Container className="pb-14 pt-36 lg:pb-20 lg:pt-44">
        <div className="max-w-4xl">
          <Reveal>
            <span className="eyebrow flex items-center gap-3 text-gold-soft">
              <span className="h-px w-10 bg-gold-soft/50" aria-hidden="true" />
              Ubud · Bali
            </span>
          </Reveal>

          <Reveal delay={120}>
            {/* The visible halves are aria-hidden and the unbroken
                sentence is exposed once via sr-only — otherwise a screen
                reader announces the headline twice. */}
            <h1 className="mt-8 text-white">
              <span
                aria-hidden="true"
                className="block font-script text-display leading-[var(--lh-display)]"
              >
                Helping You Look &amp; Feel Your Best
              </span>
              <span
                aria-hidden="true"
                className="mt-3 block font-sans text-[length:var(--fs-h3)] font-light uppercase tracking-[0.2em] text-white/85"
              >
                Without Surgery
              </span>
              <span className="sr-only">{HERO_HEADLINE}</span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-9 max-w-xl font-sans text-lead text-white/75">
              {HERO_SUBHEADLINE}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-11 flex flex-wrap items-center gap-4">
              <Button href={BOOKING_HREF} variant="light" size="lg" withArrow>
                {BOOKING_LABEL}
              </Button>
              <Button href="/ubud-bali" variant="outlineLight" size="lg">
                Explore Treatments
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>

      <Reveal delay={420}>
        <div className="border-t border-white/15">
          <Container className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 font-sans text-[0.75rem] uppercase tracking-[0.14em] text-white/65"
                >
                  <StarIcon className="h-3 w-3 shrink-0 text-secondary" />
                  {point}
                </li>
              ))}
            </ul>

            <a
              href="#story"
              aria-label="Scroll to read more"
              className="group hidden shrink-0 items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white md:flex"
            >
              Scroll
              <ArrowDownIcon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-y-1" />
            </a>
          </Container>
        </div>
      </Reveal>
    </section>
  );
}
