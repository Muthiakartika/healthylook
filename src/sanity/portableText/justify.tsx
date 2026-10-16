import type { BlockStyleProps } from "sanity";

/**
 * A paragraph style, "Paragraph (justified)", for the long-form editors.
 *
 * ── A STYLE, NOT AN ALIGNMENT BUTTON ───────────────────────────────────
 * Portable Text has no alignment. A block has one style (paragraph, heading,
 * quote), so justified text is a style of its own beside them. That also
 * means a heading can never be justified by accident.
 *
 * ── ASKED FOR BY THE CLINIC, AGAINST ADVICE ────────────────────────────
 * Justified text on the web stretches the spaces between words to fill
 * each line, and in a narrow column that opens visible gaps. The site
 * softens it in two ways (see SanityPortableText): hyphenation, so long
 * words can break instead of leaving a gap, and phones stay left-aligned,
 * because a phone column is where the gaps get worst.
 *
 * Kept off feature cards and journey steps: a few words in a narrow card
 * justify into one or two stretched lines.
 */
/* `children`, not `renderDefault(props)`. The type lists renderDefault, but
 * Studio also renders this without it (the style menu's preview, at least),
 * and calling it there threw "renderDefault is not a function" over the
 * whole Article body field. `children` is the block already rendered, which
 * is all this needs to wrap. */
function JustifiedInEditor({ children }: BlockStyleProps) {
  return <div style={{ textAlign: "justify", hyphens: "auto" }}>{children}</div>;
}

export const justifiedStyle = {
  title: "Paragraph (justified)",
  value: "justify",
  component: JustifiedInEditor,
};
