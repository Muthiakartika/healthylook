import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import type { NormalizedBlock } from "@/data/articles";

/**
 * Renders an article's block list — a mix of free-form rich text
 * (headings, paragraphs, bullet lists, all one continuous canvas in the
 * editor — see RichTextRenderer.tsx for why headings are set in Poppins,
 * not the script face) plus the two structured block types that stay
 * separate from that flow:
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
export default function ArticleBody({ blocks }: { blocks: NormalizedBlock[] }) {
  return (
    <div className="flex flex-col">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case "richtext":
            return <RichTextRenderer key={key} doc={block.content} />;

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
