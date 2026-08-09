import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import { getTreatmentBySlug, treatmentHref } from "@/data/treatments";
import { getFaqs } from "@/data/treatmentFaqs";

/**
 * SECTION 12 — FAQ
 *
 * The only FAQ content that exists is Botox's, so that's what runs here —
 * labelled as such, with a link to the full treatment page. Two things
 * this deliberately avoids:
 *
 *  - Inventing general clinic FAQs to fill a homepage-sized section. "What
 *    should I expect at my first visit" is exactly the kind of plausible
 *    question whose answer would have to be made up.
 *  - Dropping the FAQ because its content is treatment-specific. These
 *    answer real hesitations — is it safe, does it hurt, how long does it
 *    last — at the point in the page where someone is deciding to book.
 *
 * The accordion keeps every answer in the DOM while collapsed, so nothing
 * here is hidden from search engines or from in-page find.
 */
const botox = getTreatmentBySlug("botox");

export default function Faq() {
  // The homepage shows the first six of Botox's nine real questions —
  // enough to answer the common hesitations without turning the homepage
  // into the treatment page. The full set is on the Botox page itself.
  const faqs = getFaqs("botox").slice(0, 6);
  if (!botox || faqs.length === 0) return null;

  const items = faqs.map((faq, index) => ({
    id: `faq-${index}`,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <section className="bg-wash py-section">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="eyebrow flex items-center gap-3 text-primary">
                <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                Questions
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="mt-8 font-script text-[length:var(--fs-h2)] leading-[var(--lh-heading)] text-primary">
                Asked &amp; answered
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-6 measure-narrow font-sans text-[0.9375rem] leading-[var(--lh-body)] text-text-secondary">
                The questions we hear most often about {botox.name}, our
                most-asked-about treatment.
              </p>
            </Reveal>

            <Reveal delay={210}>
              <div className="mt-8">
                <Button href={treatmentHref(botox)} variant="quiet" size="sm" withArrow>
                  Full {botox.name} guide
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
