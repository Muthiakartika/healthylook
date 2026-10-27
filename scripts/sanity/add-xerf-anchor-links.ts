/**
 * Adds internal anchor links to the XERF treatment page and the XERF vs HIFU
 * article, as DRAFTS, spaced well apart.
 *
 * ── WHAT IT DOES ───────────────────────────────────────────────────────
 * Each entry in ANCHORS names a paragraph, a phrase that already sits in it,
 * and where the phrase should point. The phrase is wrapped in a link; no
 * wording is added or changed, so there is no new clinical copy to review.
 *
 * ── "NOT NEXT TO EACH OTHER" ───────────────────────────────────────────
 * Before an anchor is added, its position is measured in words from every
 * other link already in the same document (including anchors added earlier
 * in this run). If the nearest one is closer than MIN_GAP_WORDS, that anchor
 * is skipped and reported instead. The gap is counted down the document in
 * reading order, tables included, so two links in one paragraph or in
 * neighbouring paragraphs can never both survive.
 *
 * The treatment page's FAQ answers are not candidates: the page flattens
 * them to plain text, so a link written there would be dropped.
 *
 * ── DRY RUN BY DEFAULT, DRAFT ONLY ─────────────────────────────────────
 * No flag prints what would change. --write backs up the document it is
 * about to patch (scripts/sanity/backups/), then patches drafts.<id> and
 * never the published document. Safe to re-run: an anchor already in place
 * is detected and left alone.
 *
 * Run:
 *   npx tsx scripts/sanity/add-xerf-anchor-links.ts
 *   npx tsx scripts/sanity/add-xerf-anchor-links.ts --write
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnvLocal(): Record<string, string> {
  const text = readFileSync(new URL("../../.env.local", import.meta.url), "utf8");
  const env: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[trimmed.slice(0, eq).trim()] = value;
  }
  return env;
}

const env = loadEnvLocal();
const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19",
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  // Raw, so published and draft come back as separate documents.
  perspective: "raw",
});

/** Closest two links may sit, counted in words down the page. */
const MIN_GAP_WORDS = 150;

type Anchor = {
  doc: "post" | "treatment";
  /** Identifies the paragraph: its text must contain this. */
  contains: string;
  /** Already in that paragraph, once, outside any link. */
  phrase: string;
  href: string;
};

const ANCHORS: Anchor[] = [
  // "Downtime and results" — the results gallery for this very device.
  {
    doc: "post",
    contains: "Neither XERF nor HIFU delivers an instant facelift",
    phrase: "XERF results",
    href: "/before-after#xerf-treatment",
  },
  // FAQ "Can I get an xerf treatment and HIFU together?" — back to the page.
  {
    doc: "post",
    contains: "using HIFU for deeper lifting and XERF for overall firmness",
    phrase: "XERF for overall firmness",
    href: "/ubud-bali/xerf",
  },
  // "What XERF cannot do" — the injectable it does not replace.
  {
    doc: "treatment",
    contains: "does not replace treatments such as dermal fillers",
    phrase: "dermal fillers",
    href: "/ubud-bali/dermal-filler",
  },
  // "Doctor-Led Treatment" — who the doctor is.
  {
    doc: "treatment",
    contains: "XERF is performed by our doctor",
    phrase: "our doctor",
    href: "/our-doctor",
  },
];

const POST_SLUG = "xerf-vs-hifu";
const TREATMENT_ID = "treatment.xerf";

type Span = { _key: string; _type: string; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string; blank?: boolean };
type Block = {
  _key: string;
  _type: string;
  style?: string;
  heading?: string;
  children?: Span[];
  markDefs?: MarkDef[];
  body?: Block[];
  columns?: string[];
  rows?: Array<{ cells?: string[] }>;
};
type Doc = {
  _id: string;
  _type: string;
  body?: Block[];
  sections?: Array<{ _key: string; blocks?: Block[] }>;
  [k: string]: unknown;
};

/** One paragraph, with where it lives and how far into the page it starts. */
type Paragraph = { path: string; block: Block; startWord: number };

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;
const paragraphText = (block: Block) => (block.children ?? []).map((s) => s.text ?? "").join("");

/** Every paragraph in reading order, with its running word offset. */
function paragraphsOf(doc: Doc): Paragraph[] {
  const out: Paragraph[] = [];
  let offset = 0;

  const countTable = (block: Block) => {
    for (const column of block.columns ?? []) offset += words(column);
    for (const row of block.rows ?? []) for (const cell of row.cells ?? []) offset += words(cell);
  };
  const visit = (block: Block, path: string) => {
    if (block._type === "block") {
      out.push({ path, block, startWord: offset });
      offset += words(paragraphText(block));
    } else if (block._type === "treatmentTable") {
      countTable(block);
    }
  };

  if (doc._type === "post") {
    for (const block of doc.body ?? []) visit(block, `body[_key=="${block._key}"]`);
  } else {
    for (const section of doc.sections ?? []) {
      for (const block of section.blocks ?? []) {
        const base = `sections[_key=="${section._key}"].blocks[_key=="${block._key}"]`;
        if (block._type === "treatmentTable") {
          countTable(block);
          continue;
        }
        if (block.heading) offset += words(block.heading);
        for (const paragraph of block.body ?? []) visit(paragraph, `${base}.body[_key=="${paragraph._key}"]`);
      }
    }
  }
  return out;
}

/** Word offset of every link already in the document. */
function linkOffsets(doc: Doc): Array<{ at: number; href: string }> {
  const found: Array<{ at: number; href: string }> = [];
  for (const { block, startWord } of paragraphsOf(doc)) {
    const hrefByKey = new Map((block.markDefs ?? []).map((def) => [def._key, def.href ?? ""]));
    let local = 0;
    for (const span of block.children ?? []) {
      const link = (span.marks ?? []).find((mark) => hrefByKey.has(mark));
      if (link) found.push({ at: startWord + local, href: hrefByKey.get(link) ?? "" });
      local += words(span.text ?? "");
    }
  }
  return found;
}

function backup(document: Doc) {
  const dir = new URL("./backups/", import.meta.url);
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = new URL(`${document._id.replace(/[^\w.-]/g, "_")}.${stamp}.json`, dir);
  writeFileSync(file, JSON.stringify(document, null, 2));
  console.log(`    backup → scripts/sanity/backups/${file.pathname.split("/").pop()}`);
}

async function load(query: string, params: Record<string, string>) {
  const documents = await client.fetch<Doc[]>(query, params);
  const draft = documents.find((document) => document._id.startsWith("drafts."));
  const published = documents.find((document) => !document._id.startsWith("drafts."));
  const source = draft ?? published;
  if (!source) return null;
  return { source, draft, published, baseId: source._id.replace(/^drafts\./, "") };
}

async function ensureDraft(baseId: string, draft: Doc | undefined, published: Doc | undefined) {
  const draftId = `drafts.${baseId}`;
  if (!draft && published) {
    const { _rev, _createdAt, _updatedAt, ...clonable } = published as Doc & {
      _rev?: string;
      _createdAt?: string;
      _updatedAt?: string;
    };
    void _rev;
    void _createdAt;
    void _updatedAt;
    await client.createIfNotExists({ ...clonable, _id: draftId });
  }
  return draftId;
}

/** `before ‹phrase› after`, trimmed, so a dry run shows where the link lands. */
function preview(text: string, phrase: string): string {
  const i = text.indexOf(phrase);
  const before = text.slice(Math.max(0, i - 45), i);
  const after = text.slice(i + phrase.length, i + phrase.length + 45);
  return `…${before}‹${phrase}›${after}…`;
}

async function applyTo(label: string, found: NonNullable<Awaited<ReturnType<typeof load>>>, anchors: Anchor[]) {
  const { source, draft, published, baseId } = found;
  console.log(label);

  type Change = { path: string; children: Span[]; markDefs: MarkDef[] };
  const changes: Change[] = [];

  // Work on a copy so the gap check sees anchors added earlier in this run.
  const working: Doc = JSON.parse(JSON.stringify(source));

  for (const anchor of anchors) {
    const paragraph = paragraphsOf(working).find(({ block }) =>
      paragraphText(block).includes(anchor.contains),
    );
    if (!paragraph) {
      console.log(`    ✗ "${anchor.phrase}" — paragraph not found, skipped`);
      continue;
    }
    const { block, path, startWord } = paragraph;

    const hrefByKey = new Map((block.markDefs ?? []).map((def) => [def._key, def.href ?? ""]));
    const spans = block.children ?? [];
    const alreadyLinked = spans.some(
      (span) =>
        (span.text ?? "").includes(anchor.phrase) &&
        (span.marks ?? []).some((mark) => hrefByKey.get(mark) === anchor.href),
    );
    if (alreadyLinked) {
      console.log(`    · "${anchor.phrase}" → ${anchor.href} — already in place`);
      continue;
    }

    const index = spans.findIndex(
      (span) => (span.text ?? "").includes(anchor.phrase) && !(span.marks ?? []).some((m) => hrefByKey.has(m)),
    );
    if (index === -1) {
      console.log(`    ✗ "${anchor.phrase}" — not found outside an existing link, skipped`);
      continue;
    }

    const span = spans[index];
    const text = span.text ?? "";
    const at = text.indexOf(anchor.phrase);
    const position =
      startWord + words(spans.slice(0, index).map((s) => s.text ?? "").join(" ")) + words(text.slice(0, at));

    const others = linkOffsets(working);
    const nearest = others.reduce<{ gap: number; href: string } | null>((best, other) => {
      const gap = Math.abs(other.at - position);
      return !best || gap < best.gap ? { gap, href: other.href } : best;
    }, null);
    if (nearest && nearest.gap < MIN_GAP_WORDS) {
      console.log(
        `    ✗ "${anchor.phrase}" — only ${nearest.gap} words from a link to ${nearest.href} (need ${MIN_GAP_WORDS}), skipped`,
      );
      continue;
    }

    const linkKey = `link-anchor-${block.markDefs?.length ?? 0}-${spans.length}`;
    const pieces: Span[] = [];
    if (at > 0) pieces.push({ ...span, _key: `${span._key}-a`, text: text.slice(0, at) });
    pieces.push({
      ...span,
      _key: `${span._key}-link`,
      text: anchor.phrase,
      marks: [...(span.marks ?? []), linkKey],
    });
    if (at + anchor.phrase.length < text.length) {
      pieces.push({ ...span, _key: `${span._key}-z`, text: text.slice(at + anchor.phrase.length) });
    }
    block.children = [...spans.slice(0, index), ...pieces, ...spans.slice(index + 1)];
    block.markDefs = [
      ...(block.markDefs ?? []),
      { _key: linkKey, _type: "textLink", href: anchor.href, blank: false },
    ];

    changes.push({ path, children: block.children, markDefs: block.markDefs });
    const gapNote = nearest ? `nearest link ${nearest.gap} words away` : "first link in the document";
    console.log(`    + "${anchor.phrase}" → ${anchor.href}  (${gapNote})`);
    console.log(`      ${preview(paragraphText(block), anchor.phrase)}`);
  }

  if (changes.length === 0) {
    console.log("    nothing to add\n");
    return;
  }

  if (WRITE) {
    backup(source);
    const draftId = await ensureDraft(baseId, draft, published);
    const set: Record<string, unknown> = {};
    for (const change of changes) {
      set[`${change.path}.children`] = change.children;
      set[`${change.path}.markDefs`] = change.markDefs;
    }
    await client.patch(draftId).set(set).commit();
  }
  console.log();
}

async function main() {
  if (!env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN is missing from .env.local.");
  }
  console.log(
    WRITE ? "Writing drafts.\n" : "DRY RUN — nothing is written. Pass --write to apply.\n",
  );

  const post = await load(`*[_type=="post" && slug.current==$slug]`, { slug: POST_SLUG });
  if (post) await applyTo("Post · xerf-vs-hifu", post, ANCHORS.filter((a) => a.doc === "post"));
  else console.log("Post · xerf-vs-hifu not found — skipped\n");

  const treatment = await load(`*[_id in [$id, "drafts." + $id]]`, { id: TREATMENT_ID });
  if (treatment) await applyTo("Treatment · xerf", treatment, ANCHORS.filter((a) => a.doc === "treatment"));
  else console.log("Treatment · xerf not found — skipped\n");

  console.log(
    WRITE
      ? "All DRAFT only — nothing on the live site changes until each draft is published in Studio."
      : "Nothing was written. Re-run with --write to apply.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
