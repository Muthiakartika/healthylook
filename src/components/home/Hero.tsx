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
 * ── ON THE TRUST STRIP ────────────────────────────────────────────────
 * It was briefly removed, to clear the foot of the hero for a set of
 * <Highlights> cards that overlapped it. Those cards are a flat service
 * strip now and no longer reach up here, and the client asked for the band
 * back, so it is back exactly as it was.
 *
 * It overlaps <Highlights> in substance — "Doctor-performed injectables"
 * against "Doctor-Led & Internationally Trained" — and that is fine at
 * this distance: one is three words on a photograph, the other is a
 * labelled block on a surface one scroll later. Reinforcement, not repeat.
 *
 * The headline is split across two type voices — the script face for the
 * emotional half, Poppins for the clinical qualifier. The sentence itself
 * is unchanged; only its typographic emphasis is new.
 *
 * ── On the photograph ──
 * This is the banner the live site runs at the top of its homepage
 * (`slider-new-compress.webp`), 1920x827 and already darkened at source for
 * light type to sit on.
 *
 * Two things follow from that. The overlay gradients are lighter than they
 * were for the old square photo: stacking a heavy scrim on an image that is
 * already dimmed turns it into grey mud, and the point of using their
 * banner is that you can see it.
 *
 * And the crop. At 2.32:1 the source is much wider than any viewport-height
 * frame, so `cover` trims the sides rather than the top. At 1440x900 that
 * still shows the middle ~69% and the subject sits comfortably inside it.
 * At 375x812 only ~20% of the width survives, and dead-centre would slice
 * her in half, so the focal point shifts right on small screens to keep her
 * whole.
 */
const TRUST_POINTS = [
  "Doctor-performed injectables",
  "Inside a five-star Ubud resort",
  OPENING_HOURS,
];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-brown">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/clinic/hero-banner.webp"
          alt="A guest at Healthy Look Aesthetic, in the clinic's garden setting in Ubud, Bali"
          fill
          // The one image on the site that should preload: it's the
          // largest-contentful-paint element on the landing page.
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-[62%_center] lg:object-center"
        />
        {/* Three layers, and the order matters.
            1. The readability wash, left-to-right, so the type has contrast
               where it sits. In `ink-warm` rather than `ink`, because a
               neutral deep olive over a warm photograph greys it out.
            2. A gold cast rising from the bottom-left — the corner the
               headline and buttons occupy — so the warmth is strongest
               where the eye lands and the photo stays clean on the right.
            3. A short fade at the bottom, for the trust strip only.

            ── ON THE ALPHAS ──
            An earlier pass ran these at 90/55/10, gold 30%, and a 75% fade
            over the bottom HALF. That was solved for the wrong constraint:
            it was pushed that far to hold a 12px GOLD eyebrow above 4.5:1,
            and the cost was the photograph. A 55% wash at the midpoint plus
            a full-width 75% fade meant almost every pixel — the subject, the
            plants behind her — was buried under brown, and the screen read
            as a sepia print rather than a photo.

            Measured against the composited image, white type sits at 8–12:1
            under ANY of these settings, so the heavy wash was never doing
            anything for the headline, the sub or the trust strip. It existed
            solely for the eyebrow. These lighter values still hold that
            eyebrow at ≥4.6:1 at 375, 768, 1280, 1440, 1536 and 1920, and
            hand the picture back: at the plants on the right the composite
            is #6b6d6e against the original #6d7072 — very nearly untouched,
            where the old values dragged it to #676664.

            The ramps end at `/0` purely so each one reads as a single
            colour fading out. It is not a rendering fix: the browser
            serialises any zero-alpha colour to transparent black anyway, and
            gradient interpolation is premultiplied, so `/0` and `transparent`
            paint identically. Worth knowing when reading the computed value
            and finding `oklab(0 0 0 / 0)` where this file says `ink-warm`. */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink-warm/80 via-ink-warm/28 to-ink-warm/0"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-tr from-primary/14 via-primary/4 to-primary/0"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-warm/55 to-ink-warm/0"
          aria-hidden="true"
        />
      </div>

      {/* Top padding clears the fixed header, which over the hero is a
          utility strip plus the nav row — no plate behind either, just the
          header's own scrim gradient. See Header.tsx. */}
      {/* Top padding clears the fixed header, which over this hero is a
          white utility strip plus a transparent nav row. See Header.tsx. */}
      <Container className="pb-14 pt-40 lg:pb-20 lg:pt-56">
        <div className="max-w-4xl">
          <Reveal>
            {/* White, not gold — and this is the label that was distorting
                the whole screen.

                At 12px, gold on this photograph lands between 4.2 and 5.8:1
                depending on where the crop puts the bright background at
                each viewport width; it fails the 4.5:1 bar at 1920. The
                previous fix was to darken the overlay until it passed
                everywhere, which is what buried the photo in brown — an
                entire hero image sacrificed to one two-word label. White
                clears 7.6:1 at that same worst-case point and 8.5–10.3:1
                elsewhere, so the overlay is free to be light.

                The rule keeps the gold: it is a 1px graphic, judged at 3:1,
                which it clears comfortably. */}
            <span className="eyebrow flex items-center gap-3 text-white">
              <span className="h-px w-10 bg-accent/70" aria-hidden="true" />
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
                className="block font-script text-display leading-display"
              >
                Helping You Look &amp; Feel Your Best
              </span>
              <span
                aria-hidden="true"
                className="mt-3 block font-sans text-h3 font-light uppercase tracking-caps-xl text-white/85"
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
              {/* Gold, not the white it was. White-on-photo is the safe
                  choice and it is also why the first screen had no brand
                  colour anywhere in it. */}
              <Button href={BOOKING_HREF} variant="accent" size="lg" withArrow>
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
                  className="flex items-center gap-2.5 font-sans text-caption uppercase tracking-caps text-white/65"
                >
                  {/* Gold, not the lime it was. Lime is a real brand colour
                      and it owns the section bands further down the page, but
                      in a hero that is warm end to end it was the one
                      yellow-green note in an otherwise amber screen. */}
                  <StarIcon className="h-3 w-3 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>

            <a
              href="#story"
              aria-label="Scroll to read more"
              className="group hidden shrink-0 items-center gap-2 font-sans text-micro uppercase tracking-caps-xl text-white/50 transition-colors hover:text-white md:flex"
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
