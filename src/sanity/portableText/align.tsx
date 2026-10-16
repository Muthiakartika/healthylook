import type { PortableTextBlock } from "@portabletext/editor";
import { defineBehavior, raise } from "@portabletext/editor/behaviors";
import { getSelectedTextBlocks } from "@portabletext/editor/selectors";
import { getBlockEndPoint, getBlockStartPoint } from "@portabletext/editor/utils";
import type { BlockDecoratorProps } from "sanity";
import { ALIGNMENTS, blockAlignment, isAlignment } from "../lib/alignment";

/**
 * Paragraph alignment buttons for Studio's rich-text editors, like the four
 * in Google Docs: left, center, right, justify.
 *
 * ── WHY THEY ARE DECORATORS ────────────────────────────────────────────
 * Alignment belongs to the paragraph, and the editor can store extra fields
 * on a paragraph, but Sanity's bridge to the editor doesn't pass them
 * through, and the editor drops any it doesn't know. Toolbar buttons can
 * only be decorators (like Bold), which mark text, not paragraphs.
 *
 * So the button is a decorator, and the behavior below makes it act on the
 * paragraph: a click marks ALL the text of every paragraph the cursor or
 * selection touches, and clears the other three. The paragraph's alignment
 * is then simply the alignment its text carries (`blockAlignment`), which
 * is how the site reads it too. Enter carries it into the next paragraph,
 * as in Docs.
 *
 * Left is the default and is stored as no mark at all. Its button clears
 * the others, so it never shows as pressed.
 */

/* ── TOOLBAR ICONS ───────────────────────────────────────────────────── */

/** Four lines, the way every word processor draws it. `widths` gives each
 *  line's length and `align` where it sits. */
function lines(align: "left" | "center" | "right" | "justify") {
  const widths = align === "justify" ? [15, 15, 15, 15] : [15, 10, 15, 10];
  return function AlignIcon() {
    return (
      <svg width="1em" height="1em" viewBox="0 0 25 25" fill="none" aria-hidden="true">
        {widths.map((width, index) => {
          const x = align === "center" ? 5 + (15 - width) / 2 : align === "right" ? 20 - width : 5;
          const y = 7.5 + index * 3.5;
          return (
            <line key={index} x1={x} x2={x + width} y1={y} y2={y} stroke="currentColor" strokeWidth={1.4} />
          );
        })}
      </svg>
    );
  };
}

/* In the editor the mark is only a tag on the text. The stylesheet in
 * `AlignEditorStyles` aligns the paragraph that contains it.
 *
 * `children`, never `renderDefault(props)`: the props type lists
 * renderDefault, but Studio also renders mark and style components without
 * it, and a "Paragraph (justified)" style that called it took down the whole
 * Article body field ("renderDefault is not a function"). */
function AlignMark({ children, value }: BlockDecoratorProps) {
  return <span data-hla-align={value}>{children}</span>;
}

export const alignDecorators = [
  { title: "Align left", value: "alignLeft", icon: lines("left"), component: AlignMark },
  { title: "Align center", value: "alignCenter", icon: lines("center"), component: AlignMark },
  { title: "Align right", value: "alignRight", icon: lines("right"), component: AlignMark },
  { title: "Justify", value: "alignJustify", icon: lines("justify"), component: AlignMark },
];

/** Aligns each paragraph in the editor by the mark its text carries. */
export function AlignEditorStyles() {
  return (
    <style>{`
      [data-slate-node="element"]:has([data-hla-align="alignCenter"]) { text-align: center; }
      [data-slate-node="element"]:has([data-hla-align="alignRight"]) { text-align: right; }
      [data-slate-node="element"]:has([data-hla-align="alignJustify"]) { text-align: justify; hyphens: auto; }
    `}</style>
  );
}

/* ── THE BUTTON ACTS ON THE PARAGRAPH ────────────────────────────────── */

export const alignParagraphs = defineBehavior({
  on: "decorator.toggle",
  guard: ({ snapshot, event }) => {
    if (!isAlignment(event.decorator)) return false;
    const selection = snapshot.context.selection;
    const blocks = getSelectedTextBlocks(snapshot);
    if (!selection || !blocks.length) return false;

    const first = blocks[0];
    const last = blocks[blocks.length - 1];
    const range = {
      anchor: getBlockStartPoint({ context: snapshot.context, block: first }),
      focus: getBlockEndPoint({ context: snapshot.context, block: last }),
    };
    // Pressing the button a paragraph already has turns it back to left,
    // the way a pressed toolbar button toggles off.
    const already = blocks.every(
      (block) => blockAlignment(block.node as PortableTextBlock) === event.decorator,
    );
    const target = already || event.decorator === "alignLeft" ? null : event.decorator;
    return { range, selection, target };
  },
  actions: [
    (_, { range, selection, target }) => [
      raise({ type: "select", at: range }),
      ...ALIGNMENTS.map((decorator) => raise({ type: "decorator.remove", decorator })),
      ...(target ? [raise({ type: "decorator.add", decorator: target, at: range })] : []),
      // Put the cursor back where it was; the click shouldn't move it.
      raise({ type: "select", at: selection }),
    ],
  ],
});
