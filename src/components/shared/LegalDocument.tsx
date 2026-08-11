import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import type { LegalDocument as LegalDoc } from "@/data/legal";

/**
 * Renders a legal document (privacy policy, terms) from structured data.
 *
 * Two decisions specific to legal copy:
 *
 *  - **Nothing is collapsed.** Every other long block on this site uses an
 *    accordion, which the brief encourages. Legal text is the exception:
 *    terms a patient is bound by should not require an interaction to
 *    read, and "hidden behind a click" is a weak position if a clause is
 *    ever disputed.
 *  - **A sticky contents list** on desktop instead. It gives the same
 *    scannability an accordion would, without hiding anything — and on a
 *    document with seven numbered sections that's what people actually
 *    want: to jump to the clause about cancellations.
 *
 * The measure is capped narrow. Legal copy is the densest reading on the
 * site and long line lengths are where comprehension falls off fastest.
 */
export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <section className="bg-paper py-section">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Contents */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <h2 className="eyebrow text-primary-strong">Contents</h2>
                <ol className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6">
                  {doc.sections.map((section, index) => (
                    <li key={section.id} className="flex gap-4">
                      <span className="font-sans text-caption tabular-nums text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <a
                        href={`#${section.id}`}
                        className="font-sans text-copy leading-snug text-text-secondary transition-colors hover:text-primary"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </aside>

          {/* Body */}
          <div className="lg:col-span-8">
            {doc.intro && (
              <Reveal>
                <p className="measure font-sans text-lead text-text">{doc.intro}</p>
              </Reveal>
            )}

            <div className={doc.intro ? "mt-14" : ""}>
              {doc.sections.map((section, index) => (
                <Reveal key={section.id}>
                  <div
                    id={section.id}
                    className="scroll-mt-32 border-t border-hairline py-10 first:border-t-0 first:pt-0"
                  >
                    <h2 className="flex gap-5 font-sans text-h4 leading-tight text-ink">
                      <span
                        className="font-sans text-label tabular-nums text-primary-strong"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </h2>

                    <div className="mt-5 flex flex-col gap-4 sm:pl-10">
                      {section.blocks.map((block, blockIndex) =>
                        block.kind === "paragraph" ? (
                          <p
                            key={blockIndex}
                            className="measure font-sans text-copy leading-body text-text-secondary"
                          >
                            {block.text}
                          </p>
                        ) : (
                          <ul key={blockIndex} className="flex flex-col gap-3">
                            {block.items.map((item) => (
                              <li
                                key={item.text}
                                className="measure flex gap-3 font-sans text-copy leading-body text-text-secondary"
                              >
                                <span
                                  className="mt-2.5 h-px w-3 shrink-0 bg-primary/40"
                                  aria-hidden="true"
                                />
                                <span>
                                  {item.term && (
                                    <strong className="font-medium text-ink">
                                      {item.term}:{" "}
                                    </strong>
                                  )}
                                  {item.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ),
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
