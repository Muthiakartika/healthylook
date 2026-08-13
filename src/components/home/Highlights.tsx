import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import {
  SparkleIcon,
  ShieldIcon,
  MessageIcon,
  VerifiedIcon,
} from "@/components/ui/icons";
import { CLINIC_HIGHLIGHTS } from "@/data/clinic";

/**
 * SECTION 02 — THE HIGHLIGHTS  (client revision note 2)
 *
 * The client asked for four things to be highlighted:
 *
 *   Natural Results, Never Overdone
 *   Doctor-Led & Internationally Trained
 *   Honest Opinion
 *   Authentic Devices & Product
 *
 * ── THE SHAPE, AND HOW IT GOT HERE ────────────────────────────────────
 * This landed on the service-strip pattern the client sent as a reference:
 * one quiet band under the hero, four items across, each an icon beside a
 * two-line block — title, then a three-or-four-word line under it. The
 * same shape a shop runs for "free delivery / easy returns / secure
 * payment", which is exactly the job these four do here.
 *
 * It replaced two earlier attempts, and both failures are worth keeping
 * written down because they were failures of the same kind:
 *
 *  v1  Four columns of rule-over-icon-over-bold-label. Four identical
 *      rules over four labels of different lengths made the raggedness the
 *      most visible thing in the band.
 *  v2  Gold rings, label beside them, 2×2. Fixed the typography — every
 *      label on one line — and left the section a set of promises floating
 *      in an empty field.
 *
 * Both were attempts to make four short claims carry a whole section.
 * They cannot, and they should not have to: the honest read is that this
 * is a supporting strip, not a feature. <WhyUs> is where these six get
 * argued properly, with a paragraph each. Sizing this band to what it
 * actually is — small, quiet, quick to scan — is what finally made it sit
 * right on the page.
 *
 * So: `tagline`, not `description`. Three or four words under each title,
 * from the same sourced material as the long version. Nothing here is
 * asking to be read; it is asking to be counted.
 */

// Index-matched to CLINIC_HIGHLIGHTS, so the icons follow the client's own
// order. Only the first four are used here — the last two belong to <WhyUs>,
// which renders all six with their full descriptions.
const ICONS = [SparkleIcon, ShieldIcon, MessageIcon, VerifiedIcon];

export default function Highlights() {
  const highlights = CLINIC_HIGHLIGHTS.slice(0, 4);

  return (
    // `border-b` and no top border: the hero above is a dark photograph
    // that needs no help separating from anything, while below sits
    // <BrandStory> on paper, which is close enough to blush that the band
    // would otherwise bleed into it.
    <section className="border-b border-hairline bg-blush-soft py-10 lg:py-12">
      <Container>
        {/* A heading exists for screen readers and for document outline but
            is not painted: four labelled promises need no title above them,
            and one here would turn a strip back into a section. */}
        <h2 className="sr-only">Why Healthy Look</h2>

        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {highlights.map((highlight, index) => {
            const Icon = ICONS[index];
            return (
              <li key={highlight.title}>
                <Reveal delay={index * 80}>
                  {/* `items-start`, not `items-center`. One of the four
                      titles — "Doctor-Led & Internationally Trained", 28px
                      wider than its column at this size — wraps to two
                      lines. Centring each icon against its own text block
                      therefore dropped that one icon 9px below the other
                      three, which is exactly the kind of near-miss that
                      reads as a bug rather than as rag. Top-aligning puts
                      all four on one line whatever the titles do. */}
                  <div className="flex items-start gap-4">
                    {/* `[stroke-width:1.2]` overrides the 1.6 baked into the
                        icon's own markup — a CSS declaration beats an SVG
                        presentation attribute. At this size 1.6 reads
                        chunky; 1.2 reads drawn.

                        `mt-0.5` is optical, not structural: a 32px square
                        sitting flush against a 13px cap-height looks high
                        by a couple of pixels. */}
                    <Icon className="mt-0.5 h-8 w-8 shrink-0 text-primary [stroke-width:1.2]" />

                    <div className="min-w-0">
                      {/* 13px medium, sentence case — NOT uppercase. The
                          reference strip sets its titles in caps, and at
                          this width that does not survive the client's
                          wording: "DOCTOR-LED & INTERNATIONALLY TRAINED"
                          with the site's caps tracking runs ~340px into a
                          ~260px column, so every title would break to two
                          lines and the strip would be twice as tall as the
                          pattern it is copying. Sentence case at the same
                          size fits all four on one line. */}
                      <h3 className="font-sans text-label font-medium leading-snug text-ink">
                        {highlight.title}
                      </h3>
                      <p className="mt-1 font-sans text-caption leading-snug text-text-secondary">
                        {highlight.tagline}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
