import Container from "@/components/ui/Container";
import Img from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { BRAND_STORY, BRAND_PHILOSOPHY } from "@/lib/constants";
import { CLINIC_PHILOSOPHY, CLINIC_LICENCE_STATEMENT } from "@/data/clinic";

/**
 * SECTION 03 — INTRODUCTION / BRAND STORY
 *
 * The philosophy lines are pulled out and set as the largest type in the
 * section. "Enhance, not change. Restore, not overcorrect." is the single
 * most distinctive thing the clinic says about itself — a positioning
 * statement that sits buried in a paragraph on the live site. Giving it
 * the display face at display scale is the whole section.
 *
 * The licence statement follows the philosophy rather than opening the
 * section: philosophy earns attention, credentials keep it. It's real,
 * checkable, and it's the sentence that separates this clinic from the
 * "medical spa" it explicitly says it isn't — so it's set as a bordered
 * aside rather than folded into body copy where it would be skimmed past.
 */
export default function BrandStory() {
  return (
    <section id="story" className="bg-paper py-section">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Image column */}
          <div className="relative lg:col-span-5">
            <Reveal variant="image">
              <Img
                src="/images/clinic/clinic-02.jpg"
                alt="Inside the Healthy Look Aesthetic clinic in Ubud"
                aspect="tall"
                position="object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Reveal>

            {/* Overlapping accent tile. Hidden below `sm` — at phone width
                an overlap can only read as a mistake. */}
            <Reveal
              delay={200}
              variant="image"
              className="absolute -bottom-10 -right-6 hidden w-40 sm:block lg:-right-12 lg:w-52"
            >
              <Img
                src="/images/clinic/clinic-06.jpg"
                alt="Treatment detail at Healthy Look Aesthetic"
                aspect="square"
                className="border-4 border-paper"
                sizes="(max-width: 1024px) 160px, 208px"
              />
            </Reveal>
          </div>

          {/* Text column */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow flex items-center gap-3 text-primary-strong">
                <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                Our Philosophy
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="mt-8 font-script text-h1 leading-script text-primary">
                {BRAND_PHILOSOPHY.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </Reveal>

            {/* The lead paragraph carries the products and platforms by
                name; the rest continue at body size. */}
            {BRAND_STORY.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 32)} delay={180 + index * 40}>
                <p
                  className={
                    index === 0
                      ? "mt-10 measure font-sans text-lead text-text"
                      : "mt-6 measure font-sans text-body leading-body text-text-secondary"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}

            <Reveal delay={230}>
              <p className="mt-6 measure font-sans text-body leading-body text-text-secondary">
                {CLINIC_PHILOSOPHY}
              </p>
            </Reveal>

            <Reveal delay={280}>
              <p className="mt-10 measure border-l-2 border-primary/30 py-1 pl-6 font-sans text-sm leading-relaxed text-text-secondary">
                {CLINIC_LICENCE_STATEMENT}
              </p>
            </Reveal>

            <Reveal delay={330}>
              <div className="mt-10">
                <Button href="/our-doctor" variant="quiet" size="sm" withArrow>
                  Meet our doctors
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
