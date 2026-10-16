import { htmlToBlocks, randomKey, type DeserializerRule } from "@portabletext/block-tools";
import type { OnPasteFn } from "@portabletext/editor";
import { defineBehavior, raise } from "@portabletext/editor/behaviors";
import { BehaviorPlugin } from "@portabletext/editor/plugins";
import { isSelectionExpanded } from "@portabletext/editor/selectors";
import { markdownToPortableText } from "@portabletext/markdown";
import { portableTextMemberSchemaTypesToSchema } from "@portabletext/sanity-bridge";
import type { InputProps, PortableTextInputProps, PortableTextPluginsProps } from "sanity";
import { SITE_URL } from "@/lib/constants";

/**
 * What a paste into a Studio rich-text field turns into.
 *
 * ── WHY ANY OF THIS EXISTS ─────────────────────────────────────────────
 * Sanity's own paste recognises a link only if the schema has an annotation
 * called exactly `link`. Ours is `textLink` (see textLink.ts), so every link
 * pasted from a Google Doc, a website or ChatGPT arrived as plain text with
 * the address tacked on in brackets — "XERF (https://…)". And a pasted table
 * fell apart into one paragraph per cell.
 *
 * So, the way a WordPress editor behaves:
 *   • a link in pasted text stays a link;
 *   • a URL pasted over selected words links those words;
 *   • a URL pasted on its own becomes a link to itself;
 *   • a table — from Google Docs, Sheets, Excel, Word, a web page, or as
 *     Markdown / tab-separated text — becomes a Comparison table block,
 *     wherever the field offers one (the blog body does).
 * Anything else is left to Sanity's normal paste.
 */

const TABLE_TYPE = "treatmentTable";
const LINK_TYPE = "textLink";
const OWN_HOST = new URL(SITE_URL).hostname.replace(/^www\./, "");

type LinkValue = { href: string; blank: boolean };

/** A pasted address, as the Link dialog would have stored it: a link to
 *  this site becomes a site path (and opens in the same tab), anything the
 *  dialog would refuse is dropped and its words kept as plain text. */
function toLink(raw: string | null | undefined): LinkValue | undefined {
  const href = raw?.trim();
  if (!href) return undefined;
  if (/^(mailto:|tel:)\S+$/i.test(href)) return { href, blank: false };
  if (/^#[A-Za-z0-9_-]+$/.test(href)) return { href, blank: false };
  if (href.startsWith("/") && !href.startsWith("//")) return { href, blank: false };
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return undefined;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
  if (url.hostname.replace(/^www\./, "") === OWN_HOST) {
    return { href: `${url.pathname}${url.search}${url.hash}` || "/", blank: false };
  }
  return { href, blank: true };
}

const SINGLE_URL = /^https?:\/\/\S+$/i;

/* ── HTML ────────────────────────────────────────────────────────────── */

const BLOCK_TAGS = /^(p|div|li|h[1-6]|br|tr)$/i;

/** A cell's words with its paragraphs and line breaks turned into spaces.
 *  `textContent` would glue "Mild warmth" and "No downtime" into one word. */
function cellText(node: Node): string {
  let out = "";
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) out += child.textContent ?? "";
    else if (child.nodeType === Node.ELEMENT_NODE) {
      out += cellText(child);
      if (BLOCK_TAGS.test((child as Element).tagName)) out += " ";
    }
  });
  return out;
}

/** Header row first, then the body rows — the shape of `treatmentTable`.
 *  `undefined` for anything too small to be a table: one cell copied out
 *  of a spreadsheet is a word, and pastes as one. */
function toTable(grid: string[][]) {
  const rows = grid
    .map((row) => row.map((cell) => cell.replace(/\s+/g, " ").trim()))
    .filter((row) => row.some(Boolean));
  const width = Math.max(0, ...rows.map((row) => row.length));
  if (rows.length < 2 || width < 2) return undefined;
  const pad = (row: string[]) => [...row, ...Array<string>(width - row.length).fill("")];
  const [header, ...body] = rows;
  return {
    _type: TABLE_TYPE,
    _key: randomKey(12),
    columns: pad(header),
    rows: body.map((cells) => ({ _type: "treatmentTableRow", _key: randomKey(12), cells: pad(cells) })),
    labelFirstColumn: true,
  };
}

const tableRule: DeserializerRule = {
  deserialize(el) {
    if (el.nodeType !== Node.ELEMENT_NODE || (el as Element).tagName.toLowerCase() !== "table") {
      return undefined;
    }
    const grid = Array.from((el as HTMLTableElement).rows).map((tr) =>
      Array.from(tr.cells).map(cellText),
    );
    // Too small to be a table: fall through, and the default rules paste
    // its cells as text.
    return toTable(grid);
  },
};

const linkRule: DeserializerRule = {
  deserialize(el, next) {
    if (el.nodeType !== Node.ELEMENT_NODE || (el as Element).tagName.toLowerCase() !== "a") {
      return undefined;
    }
    const link = toLink((el as Element).getAttribute("href"));
    if (!link) return next(el.childNodes);
    // The placeholder shape block-tools' own `a` rule returns, with our
    // annotation in it instead of the `link` this schema does not have.
    return {
      _type: "__annotation",
      markDef: { _key: randomKey(12), _type: LINK_TYPE, ...link },
      children: next(el.childNodes),
    } as unknown as ReturnType<DeserializerRule["deserialize"]>;
  },
};

/* ── PLAIN TEXT AND MARKDOWN ─────────────────────────────────────────── */

/** Rows copied out of a spreadsheet into Notepad first, then into Studio:
 *  every line has the same number of tabs. Rewritten as a Markdown table
 *  so it takes the one table path below. */
function tabsToMarkdown(text: string): string | undefined {
  const lines = text.replace(/\r/g, "").split("\n").filter((line) => line.trim());
  if (lines.length < 2) return undefined;
  const tabs = lines.map((line) => line.split("\t").length - 1);
  if (tabs[0] < 1 || tabs.some((count) => count !== tabs[0])) return undefined;
  const row = (line: string) => `| ${line.split("\t").map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
  const [header, ...body] = lines;
  return [row(header), `|${" --- |".repeat(tabs[0] + 1)}`, ...body.map(row)].join("\n");
}

/** Only text that is plainly Markdown goes through the Markdown parser. An
 *  ordinary sentence would come out the same, but one with an underscore
 *  or an asterisk in it might not, so it is left to the normal paste. */
function looksLikeMarkdown(text: string) {
  return (
    /^\s*\|.*\|\s*\n\s*\|?\s*:?-{3,}/m.test(text) || // a table
    /^#{1,6}\s+\S/m.test(text) || // a heading
    /\[[^\]]+\]\((https?:\/\/|\/|#|mailto:)[^)\s]+\)/.test(text) || // a link
    /\*\*[^*\n]+\*\*/.test(text) // bold
  );
}

type TextBlock = { children?: Array<{ text?: string }> };
const blocksText = (blocks: unknown[]) =>
  blocks.map((block) => (block as TextBlock).children?.map((c) => c.text ?? "").join("") ?? "").join(" ");

/* ── THE PASTE ───────────────────────────────────────────────────────── */

const onPaste: OnPasteFn = ({ event, schemaTypes }) => {
  const data = event.clipboardData;
  if (!data) return undefined;

  // Copied from another rich-text field in Studio: Sanity's own paste
  // already keeps every mark exactly, ours could only lose some.
  if (data.types.includes("application/x-portable-text") || data.types.includes("application/json")) {
    return undefined;
  }

  // A bare URL is the behaviour below's job — it needs the selection.
  const text = data.getData("text/plain");
  if (SINGLE_URL.test(text.trim())) return undefined;

  const tables = schemaTypes.blockObjects.some((type) => type.name === TABLE_TYPE);
  const html = data.getData("text/html");

  if (html) {
    const hasLink = /<a\s[^>]*href/i.test(html);
    const hasTable = tables && /<table[\s>]/i.test(html);
    if (!hasLink && !hasTable) return undefined;
    const blocks = htmlToBlocks(html, schemaTypes.portableText, {
      rules: hasTable ? [tableRule, linkRule] : [linkRule],
    });
    return blocks.length ? { insert: blocks } : undefined;
  }

  const markdown =
    data.getData("text/markdown") || (tables ? tabsToMarkdown(text) : undefined) || text;
  if (!looksLikeMarkdown(markdown)) return undefined;

  const blocks = markdownToPortableText(markdown, {
    schema: portableTextMemberSchemaTypesToSchema(schemaTypes),
    keyGenerator: () => randomKey(12),
    // The two heading levels this editor has. `# Title` in a pasted draft
    // is the article's own title, which the page already prints, so it
    // becomes the top heading the body is allowed rather than vanishing.
    block: {
      h1: () => "h2",
      h4: () => "h3",
      h5: () => "h3",
      h6: () => "h3",
    },
    marks: {
      link: ({ context, value }) => {
        const link = toLink(value.href);
        return link ? { _type: LINK_TYPE, _key: context.keyGenerator(), ...link } : undefined;
      },
    },
    types: {
      table: ({ value }) => {
        if (!tables) return undefined;
        const grid = value.rows.map((row) => row.cells.map((cell) => blocksText(cell.value)));
        return toTable(grid);
      },
    },
  });
  return blocks.length ? { insert: blocks } : undefined;
};

/** Hands the Studio editor the paste handler above. Used as a schema
 *  type's `components.input`. */
export function PastingInput(props: InputProps) {
  return props.renderDefault({ ...(props as PortableTextInputProps), onPaste } as InputProps);
}

/* ── A URL PASTED ON ITS OWN ─────────────────────────────────────────── */

const pastedUrl = defineBehavior({
  on: "clipboard.paste",
  guard: ({ snapshot, event }) => {
    const text = event.originEvent.dataTransfer.getData("text/plain").trim();
    const link = SINGLE_URL.test(text) ? toLink(text) : undefined;
    return link ? { link, text, expanded: isSelectionExpanded(snapshot) } : false;
  },
  actions: [
    (_, { link, text, expanded }) => [
      expanded
        ? // Words selected: link them, as the Link button would.
          raise({ type: "annotation.add", annotation: { name: LINK_TYPE, value: link } })
        : // Nothing selected: the address itself, linked.
          raise({
            type: "insert.span",
            text,
            annotations: [{ name: LINK_TYPE, value: link }],
          }),
    ],
  ],
});

/** Sanity's own editor plugins, plus the URL behaviour. Used as a schema
 *  type's `components.portableText.plugins`. */
export function pastePlugins(props: PortableTextPluginsProps) {
  return (
    <>
      {props.renderDefault(props)}
      <BehaviorPlugin behaviors={[pastedUrl]} />
    </>
  );
}

export const pasteComponents = {
  input: PastingInput,
  portableText: { plugins: pastePlugins },
};
