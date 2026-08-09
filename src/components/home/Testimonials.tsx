import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { QuoteIcon, StarIcon } from "@/components/ui/icons";
import { testimonials } from "@/data/testimonials";

/**
 * SECTION 09 — TESTIMONIALS
 *
 * ⚠ CONTENT NOTE — read before launch.
 * The quotes rendered here come from src/data/testimonials.ts, which
 * contains ORIGINAL SAMPLE quotes written for this rebuild, not the
 * clinic's real reviews. That decision predates this redesign and is
 * documented in the data file: real reviews name identifiable third
 * parties, and republishing them elsewhere is the client's call to make,
 * not something to scrape from the live site. The redesign has NOT
 * substituted, rewritten, or invented any additional testimonial — it
 * presents exactly the four that were already in the data. Swap the data
 * file for client-approved real reviews before launch and this section
 * needs no code changes.
 *
 * Design: the brief specifically warns against testimonials that look like
 * generic small cards, so the first review is set as a full-width pull
 * quote at display scale — the way a magazine would run it — and the
 * remaining three sit below in a scroll-snap row.
 *
 * The row is CSS scroll-snap rather than a JavaScript carousel. It's
 * keyboard-scrollable, works without JS, needs no arrows or dots, and
 * costs nothing — a JS carousel here would add weight and a focus-trap
 * problem in exchange for a slightly smoother drag.
 */
export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    // `wash`, not `section-soft`: this section is followed directly by
    // BookingSection on the treatment-detail and before-after pages, and
    // BookingSection owns the lime band. Two adjacent sections in the same
    // tone read as one long undifferentiated block, which is exactly what
    // the alternating-background rhythm exists to prevent.
    <section className="bg-wash py-section">
      <Container>
        {/* The section's visible label is the eyebrow, which is too small
            to be a heading typographically — but a section with no
            heading at all leaves a hole in the document outline. An
            sr-only <h2> fills it without changing the design. */}
        <h2 className="sr-only">What our patients say</h2>

        <Reveal className="flex flex-col items-center text-center">
          <span className="eyebrow flex items-center gap-3 text-primary">
            <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
            In Their Words
            <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
          </span>
        </Reveal>

        {/* Featured quote */}
        {featured && (
          <Reveal delay={100}>
            <figure className="mx-auto mt-14 max-w-4xl text-center">
              <QuoteIcon className="mx-auto h-8 w-8 text-primary/30" />
              <blockquote className="mt-8">
                <p className="font-script text-[length:var(--fs-h2)] leading-[1.12] text-primary">
                  &ldquo;{featured.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-10 flex flex-col items-center gap-2">
                <span className="font-sans text-[0.9375rem] font-medium text-ink">
                  {featured.name}
                </span>
                <span className="flex items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
                  <span className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} className="h-2.5 w-2.5 text-accent" />
                    ))}
                  </span>
                  via {featured.source}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        )}

        {/* Remaining reviews */}
        {rest.length > 0 && (
          <Reveal delay={160}>
            <div
              className="mt-20 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:thin]"
              // Full-bleed on mobile so cards can run to the screen edge and
              // visibly "continue", which is what tells a touch user the row
              // scrolls. Negative margin + matching padding, rather than
              // breaking the element out of the container.
              style={{
                marginInline: "calc(var(--gutter) * -1)",
                paddingInline: "var(--gutter)",
              }}
            >
              {rest.map((testimonial) => (
                <figure
                  key={testimonial.id}
                  className="flex w-[85vw] shrink-0 snap-start flex-col justify-between gap-8 rounded-[2px] border border-hairline bg-background p-9 sm:w-[24rem] lg:w-[26rem]"
                >
                  <blockquote>
                    <p className="font-sans text-[0.9375rem] leading-[var(--lh-body)] text-text">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </blockquote>
                  <figcaption className="flex items-center justify-between gap-4 border-t border-hairline pt-6">
                    <span className="font-sans text-[0.875rem] font-medium text-ink">
                      {testimonial.name}
                    </span>
                    <span className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
                      {testimonial.source}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
