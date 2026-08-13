import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import { clinicFaqs } from "@/data/clinicFaqs";
import { BOOKING_HREF } from "@/lib/constants";

/**
 * SECTION 12 — FAQ
 *
 * ── CLIENT REVISION 12 ────────────────────────────────────────────────
 * "I think FAQ botox in homepage is not necessary, how do you think?"
 *
 * Agreed on the Botox part, and the section stays — repointed at the
 * clinic instead of at one treatment. This used to render six of Botox's
 * nine real questions. They answer "should I have Botox", which is a
 * question for a reader who has already picked both the clinic and the
 * treatment; a homepage is read by someone who has picked neither.
 *
 * The six questions here are the ones that actually block a booking: who
 * holds the needle, what if I don't know what I need, are the products
 * real, are you licensed, will you understand me, and where are you. Every
 * one of Botox's nine is untouched and still renders on /ubud-bali/botox,
 * along with the other 175 treatment FAQs.
 *
 * See src/data/clinicFaqs.ts for the sourcing rule these answers follow —
 * the live site has no general FAQ, so each answer is assembled from
 * material the clinic has already published, and nothing was invented to
 * fill the section out.
 *
 * The accordion keeps every answer in the DOM while collapsed, so nothing
 * here is hidden from search engines or from in-page find.
 */
export default function Faq() {
  const items = clinicFaqs.map((faq, index) => ({
    id: `faq-${index}`,
    question: faq.question,
    answer: faq.answer,
  }));

  if (items.length === 0) return null;

  return (
    <section className="bg-paper py-section">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="eyebrow flex items-center gap-3 text-primary-strong">
                <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                Questions
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="mt-8 font-script text-h2 leading-heading text-primary">
                Asked &amp; answered
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-6 measure-narrow font-sans text-copy leading-body text-text-secondary">
                The things people ask us before they book. Questions about a
                specific treatment are answered in full on that treatment&rsquo;s
                own page.
              </p>
            </Reveal>

            <Reveal delay={210}>
              <div className="mt-8">
                <Button href={BOOKING_HREF} variant="quiet" size="sm" withArrow>
                  Ask us something else
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={120}>
              {/* First item open on load: an accordion where every row is
                  closed reads as an empty list of links. */}
              <Accordion items={items} defaultOpen={0} />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
