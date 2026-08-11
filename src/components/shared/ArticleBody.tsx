import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import type { ArticleBlock } from "@/data/articles";

/**
 * Renders a migrated article's block list.
 *
 * The blocks come out of the live site's own markup (see src/data/articles.ts),
 * so this component's whole job is to give that content the site's typography
 * rather than to restyle it into something else.
 *
 * Two decisions worth naming:
 *
 *  - Body headings are set in Poppins, not the script face. The data now
 *    mirrors the live site's heading levels exactly, and the live site runs
 *    its FAQ questions at h2 alongside the FAQ label, so some articles carry
 *    up to nineteen h2s. Nineteen 72px script headings would be absurd, and
 *    the type system already answers this: Poppins is the clinical voice for
 *    "anything a patient must read carefully", which a medical FAQ question
 *    plainly is. The script face keeps its job on the page title above.
 *    Levels are separated by size and colour rather than by adding a rule
 *    above each one, which at this density would just be a hairline on
 *    every row.
 *
 *  - FAQ blocks go through the site's existing <Accordion>, not a bespoke
 *    list, so an FAQ on an article reads and behaves exactly like an FAQ on a
 *    treatment page. It keeps the answers in the DOM while collapsed, which
 *    matters here: these are the pages people find from a search for
 *    "how long does botox last", and the answer needs to be crawlable.
 *
 *  - Prose is capped with `measure-narrow` (52ch), not `measure` (68ch). The
 *    `ch` unit is the width of the "0" glyph, and Poppins' digits are wider
 *    than its average letter, so 68ch renders as roughly 90 characters per
 *    line — well past the 65-75 band where long-form reading stays
 *    comfortable. 52ch lands at about 69 real characters.
 *
 *  - Tables scroll inside their own container rather than shrinking the type.
 *    Several of these carry dosage and duration figures, and a table that
 *    reflows into three-character columns on a phone is worse than one that
 *    scrolls.
 */
export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="flex flex-col">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case "heading":
            return block.level === 2 ? (
              <Reveal key={key}>
                <h2 className="mt-14 font-sans text-h3 font-medium leading-tight text-ink first:mt-0">
                  {block.text}
                </h2>
              </Reveal>
            ) : (
              <Reveal key={key}>
                <h3 className="mt-10 font-sans text-h4 font-medium leading-tight text-primary-strong first:mt-0">
                  {block.text}
                </h3>
              </Reveal>
            );

          case "paragraph":
            return (
              <Reveal key={key}>
                <p className="mt-5 measure-narrow font-sans text-copy leading-body text-text-secondary">
                  {block.text}
                </p>
              </Reveal>
            );

          case "list":
            return (
              <Reveal key={key}>
                <ul className="mt-6 flex flex-col gap-3 border-l border-hairline pl-6">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="measure-narrow font-sans text-copy leading-body text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );

          case "table":
            return (
              <Reveal key={key}>
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full min-w-[34rem] border-collapse text-left">
                    <thead>
                      <tr className="border-y border-hairline">
                        {block.head.map((cell, i) => (
                          <th
                            key={i}
                            scope="col"
                            className="py-3.5 pr-6 font-sans text-caption font-semibold uppercase tracking-caps text-primary-strong"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, r) => (
                        <tr key={r} className="border-b border-hairline">
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className="py-3.5 pr-6 align-top font-sans text-sm leading-body text-text-secondary"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            );

          case "faq":
            return (
              <div key={key} className="mt-10">
                <Accordion
                  items={block.items.map((item, i) => ({
                    id: `${key}-${i}`,
                    question: item.question,
                    answer: item.answer,
                  }))}
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
