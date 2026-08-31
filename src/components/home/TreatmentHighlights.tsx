import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TreatmentThumb from "@/components/shared/TreatmentThumb";
import { CheckIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { treatmentHref, type Treatment } from "@/data/treatments";
import { getTreatments } from "@/lib/site-content";

/**
 * SECTION — TREATMENT HIGHLIGHTS
 *
 * ── CLIENT REVISION ─────────────────────────────────────────────────────
 * The client asked for a homepage section naming what's distinctive about
 * six specific technologies/treatments, each with its own short list of
 * facts they supplied directly. Every fact below is theirs, verbatim or
 * lightly smoothed for grammar where they asked for that — nothing is
 * added beyond what was given, and none of it duplicates a claim the
 * client didn't make.
 *
 * Two of the six (HIFU, CM Slim/Muscle Sculpting) already have some of
 * this material in their own treatmentSections.ts entries; it's repeated
 * here because this section's job is different — a homepage-level "what's
 * special about our technology" summary, not the full treatment page.
 *
 * `getTreatmentBySlug` supplies the photo, the name, and the link, so this
 * file only has to own the fact lists — no image or href is hardcoded, and
 * a renamed or re-slugged treatment can't silently break this section
 * without TypeScript noticing the lookup returned undefined.
 *
 * ── FOLLOW-UP REVISION ──────────────────────────────────────────────────
 * Juvelook and Exosome were dropped from this section on the client's own
 * second thought ("sorry i changed my mind") — both stay on the site as
 * full treatment pages, just not featured here. Sylfirm and CM Slim each
 * gained two more client-supplied facts. Lysiwave's photo crop is fixed via
 * `treatment.imagePosition` now (see treatments.ts) rather than here, since
 * the same crop turned out to be wrong everywhere else this photo renders
 * too, not just on this card.
 */
const HIGHLIGHT_ENTRIES: { slug: string; facts: string[] }[] = [
  {
    slug: "hifu",
    facts: [
      "Exclusive to Healthy Look — Bali's first and only",
      "Uses Linear Z",
      "One of the world's most advanced and fastest HIFU technologies",
      "Less painful than conventional HIFU",
    ],
  },
  {
    slug: "microneedling/rf",
    facts: [
      "World's first and only FDA-approved dual-wave RF Microneedling",
      "Quick downtime",
      "More advanced than conventional microneedling",
    ],
  },
  {
    slug: "fat-cellulite",
    facts: [
      "Exclusive to Healthy Look — Bali's first and only",
      "Uses microwave and pure oxygen",
      "More effective at targeting fat than conventional RF",
    ],
  },
  {
    slug: "muscle-sculpting",
    facts: ["CE Certified", "No downtime", "Non invasive, no needle"],
  },
];

export default async function TreatmentHighlights() {
  // Resolved in the component, not at module scope: the lookup goes
  // through the database layer now, and a module-scope await would run
  // once on first import and then hold that result forever.
  //
  // An unresolved slug is dropped rather than rendering a broken card —
  // the same defensive pattern HOME_POPULAR_SLUGS uses elsewhere.
  const all = await getTreatments();
  const highlights = HIGHLIGHT_ENTRIES.map((entry) => {
    const treatment = all.find((t) => t.slug === entry.slug);
    return treatment ? { treatment, facts: entry.facts } : null;
  }).filter((item): item is { treatment: Treatment; facts: string[] } => item !== null);

  if (highlights.length === 0) return null;

  return (
    <section className="bg-wash py-section">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="Signature Technology"
          title="Treatment Highlights"
          description="A few of the technologies we're especially proud to offer — some exclusive to Healthy Look in Bali, all chosen for what they do for you."
          className="lg:max-w-2xl"
        />

        {/* ── CLIENT REVISION — 2 COLUMNS, NOT 3-THEN-1 ───────────────────
            Juvelook and Exosome's removal (see HIGHLIGHT_ENTRIES above)
            left four cards, and lg:grid-cols-3 rendered that as three then
            one — an orphan row the client asked to fix. Two columns turns
            four cards into two even rows instead. */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {highlights.map(({ treatment, facts }, index) => (
            <Reveal key={treatment.slug} delay={Math.min(index, 5) * 70}>
              <Link
                href={treatmentHref(treatment)}
                className="group flex h-full flex-col border border-hairline bg-background transition-colors duration-300 hover:border-primary/40"
              >
                <TreatmentThumb
                  src={treatment.image}
                  name={treatment.name}
                  position={treatment.imagePosition}
                />
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="flex items-start justify-between gap-3 font-sans text-h4 leading-tight text-ink transition-colors duration-300 group-hover:text-primary">
                    {treatment.name}
                    <ArrowUpRightIcon className="mt-1 h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </h3>
                  <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                    {facts.map((fact) => (
                      <li
                        key={fact}
                        className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-text-secondary"
                      >
                        <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
