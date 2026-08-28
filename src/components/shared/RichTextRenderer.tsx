import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import type { TipTapNode, TipTapMark } from "@/data/articles";

/**
 * Renders TipTap's document JSON on the public site — a server component
 * with no TipTap import at all. The shape here (`{type, attrs, content,
 * text, marks}`) is ProseMirror's own stable `Node.toJSON()` contract, not
 * something TipTap layers on top of, so hand-walking it is standard,
 * low-risk practice for headless rendering rather than something fragile.
 *
 * Two easy-to-get-wrong details:
 *  - A bulletList's children are listItem nodes, and each listItem's own
 *    content is itself paragraph(s) — three levels deep, not two.
 *  - An empty node (a blank line) serializes with `content` omitted
 *    entirely, not `content: []` — every descent guards with `?? []`.
 *
 * Classes and spacing below are copied verbatim from what ArticleBody.tsx
 * used for the same tags before this replaced it, so migrated content
 * looks identical to before — this is a rendering-engine change, not a
 * restyle.
 *
 * Headings are set in Poppins, not the site's script face: some articles'
 * FAQ questions render as h2s alongside the section heading, so a single
 * article can carry a dozen-plus h2s — a dozen 72px script headings would
 * be absurd, and Poppins is already this site's voice for "anything a
 * patient must read carefully," which a medical FAQ question plainly is.
 * Levels are separated by size and colour rather than a rule above each
 * one, which at this density would just be a hairline on every row.
 */

function renderMarks(text: string, marks?: TipTapMark[]): ReactNode {
  if (!marks?.length) return text;
  return marks.reduce<ReactNode>((acc, mark) => {
    if (mark.type === "bold") return <strong>{acc}</strong>;
    if (mark.type === "italic") return <em>{acc}</em>;
    if (mark.type === "link") {
      const href = String(mark.attrs?.href ?? "");
      const cls = "text-primary-strong underline underline-offset-2 hover:text-primary";
      return /^https?:\/\//.test(href) ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {acc}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {acc}
        </Link>
      );
    }
    return acc;
  }, text);
}

function renderInline(nodes: TipTapNode[] = []): ReactNode {
  return nodes.map((node, i) => {
    if (node.type === "text") return <Fragment key={i}>{renderMarks(node.text ?? "", node.marks)}</Fragment>;
    if (node.type === "hardBreak") return <br key={i} />;
    return null;
  });
}

export default function RichTextRenderer({ doc }: { doc: { type: "doc"; content: TipTapNode[] } }) {
  return (
    <>
      {(doc.content ?? []).map((node, index) => {
        const key = `${node.type}-${index}`;

        if (node.type === "heading") {
          const level = node.attrs?.level === 3 ? 3 : 2;
          const id = typeof node.attrs?.id === "string" ? node.attrs.id : undefined;
          return level === 2 ? (
            <Reveal key={key}>
              <h2 id={id} className="mt-14 font-sans text-h3 font-medium leading-tight text-ink first:mt-0">
                {renderInline(node.content)}
              </h2>
            </Reveal>
          ) : (
            <Reveal key={key}>
              <h3
                id={id}
                className="mt-10 font-sans text-h4 font-medium leading-tight text-primary-strong first:mt-0"
              >
                {renderInline(node.content)}
              </h3>
            </Reveal>
          );
        }

        if (node.type === "paragraph") {
          return (
            <Reveal key={key}>
              <p className="mt-5 measure-narrow font-sans text-copy leading-body text-text-secondary">
                {renderInline(node.content)}
              </p>
            </Reveal>
          );
        }

        if (node.type === "bulletList") {
          return (
            <Reveal key={key}>
              <ul className="mt-6 flex flex-col gap-3 border-l border-hairline pl-6">
                {(node.content ?? []).map((listItem, i) => (
                  <li
                    key={i}
                    className="measure-narrow font-sans text-copy leading-body text-text-secondary"
                  >
                    {(listItem.content ?? []).map((paragraph, j) => (
                      <Fragment key={j}>{renderInline(paragraph.content)}</Fragment>
                    ))}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        }

        return null;
      })}
    </>
  );
}
