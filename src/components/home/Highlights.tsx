import Reveal from "@/components/ui/Reveal";
import {
  SparkleIcon,
  ShieldIcon,
  MessageIcon,
  VerifiedIcon,
} from "@/components/ui/icons";
import { CLINIC_HIGHLIGHTS } from "@/data/clinic";

/**
 * THE HIGHLIGHTS — now the hero's own bottom bar, not a section of its own.
 *
 * The client asked for four things to be highlighted:
 *
 *   Natural Results, Never Overdone
 *   Doctor-Led & Internationally Trained
 *   Honest Opinion
 *   Authentic Devices & Product
 *
 * ── HOW THIS FILE GOT HERE ─────────────────────────────────────────────
 * This used to be its own section: a quiet cream band under the hero, four
 * items in a spacious grid, icon over two-line title. Two rounds of
 * follow-up feedback moved it twice more —
 *
 *   1. "Just the title only" — the tagline line under each title was
 *      dropped (kept in <WhyUs>, which still argues all six in full).
 *   2. "Taruh di tempatnya doctor-performance, hapus yang itu" then,
 *      after a mock-up screenshot, "aku maunya didalam bg gambar itu" —
 *      not just occupying the same page position as the old trust strip,
 *      but literally inside the hero photograph, the way the trust strip
 *      was.
 *
 * So this is no longer a section: it has no <section>, no <Container>, no
 * background of its own. <Hero> renders it directly inside the photo, in
 * the exact spot the old trust strip occupied, and supplies the border,
 * spacing and Container that used to live here. The layout is the trust
 * strip's own proven one for that spot — a wrapping row, not a grid —
 * because a 4-row vertical stack (what the old `sm:grid-cols-2
 * lg:grid-cols-4` grid becomes below `sm`) would make the hero
 * considerably taller on a phone; a wrapping row degrades to two short
 * lines instead, the same way the trust strip always did.
 *
 * Titles stay sentence case, not uppercase — the reason is unchanged from
 * the section version: "DOCTOR-LED & INTERNATIONALLY TRAINED" in this
 * site's caps tracking is wider than one line survives at small sizes.
 */

// Index-matched to CLINIC_HIGHLIGHTS, so the icons follow the client's own
// order. Only the first four are used here — the last two belong to <WhyUs>,
// which renders all six with their full descriptions.
const ICONS = [SparkleIcon, ShieldIcon, MessageIcon, VerifiedIcon];

export default function Highlights() {
  const highlights = CLINIC_HIGHLIGHTS.slice(0, 4);

  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
      {highlights.map((highlight, index) => {
        const Icon = ICONS[index];
        return (
          <li key={highlight.title}>
            <Reveal delay={index * 80}>
              <div className="flex items-center gap-2.5">
                {/* Gold, like the old trust strip's stars — the one accent
                    that already reads correctly on this photograph. Smaller
                    than the section version's 32px icon (that size was
                    tuned for a spacious cream band, not a slim bar on a
                    photo) and `[stroke-width:1.4]` for the same reason a
                    thin line reads better than a chunky one at 16px. */}
                <Icon className="h-4 w-4 shrink-0 text-accent [stroke-width:1.4]" />
                <span className="font-sans text-caption leading-snug text-white/80">
                  {highlight.title}
                </span>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
