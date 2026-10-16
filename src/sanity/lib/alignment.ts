/**
 * Paragraph alignment, as stored by Studio's alignment buttons: a mark on
 * the paragraph's text. Shared by the editor (src/sanity/portableText/
 * align.tsx) and the site (SanityPortableText), and free of imports so the
 * site never pulls in editor code to read it.
 */

export const ALIGNMENTS = ["alignLeft", "alignCenter", "alignRight", "alignJustify"] as const;
export type Alignment = (typeof ALIGNMENTS)[number];

export const isAlignment = (value: unknown): value is Alignment =>
  ALIGNMENTS.includes(value as Alignment);

/** The alignment a paragraph's text carries. Read from the first span that
 *  has one, so a word typed without the mark doesn't change anything. */
export function blockAlignment(block: unknown): Alignment {
  const children = (block as { children?: Array<{ marks?: string[] }> })?.children ?? [];
  for (const child of children) {
    const mark = child.marks?.find(isAlignment);
    if (mark) return mark;
  }
  return "alignLeft";
}
