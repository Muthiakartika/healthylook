/**
 * Fixes the Sanity-side SEO findings on the XERF pages, as DRAFTS.
 *
 * ── WHAT IT CHANGES ────────────────────────────────────────────────────
 * The "XERF vs HIFU" article (post, slug xerf-vs-hifu):
 *   - seo.title is shortened. The page <title> is seo.title plus the site
 *     template's " | Healthy Look Aesthetic", and the old value came to 93
 *     characters, which Google cuts at about 60.
 *   - Trailing spaces are trimmed from the title and seo.description.
 *   - The first body block is deleted when it only repeats the title. The
 *     hero already prints the title as the H1, so the page said it twice.
 *   - An empty seo.image (`{ _type }` with no asset, left behind when the SEO
 *     group is opened) is unset. The page code now copes with it as well;
 *     removing it just stops the document from carrying a dead field.
 *
 * The XERF treatment page (treatment.xerf):
 *   - One closing line with a link to /xerf-vs-hifu is added to the
 *     "HIFU vs Thermage vs XERF" section. It sits in a rich-text section on
 *     purpose: FAQ answers are flattened to plain text on the page, so a
 *     link placed there would be silently dropped.
 *
 * ── WHAT IT DELIBERATELY LEAVES ALONE ──────────────────────────────────
 * The treatment's meta description. It says "FDA-cleared … tightens skin",
 * while the article says the clearance covers electrocoagulation. Which
 * wording is right is the clinic's call, not ours.
 *
 * ── DRY RUN BY DEFAULT, DRAFT ONLY ─────────────────────────────────────
 * No flag prints what would change. --write backs up the document it is
 * about to patch (scripts/sanity/backups/), then patches drafts.<id> and
 * never the published document, so the live site is untouched until each
 * draft is published in Studio. Safe to re-run: every step checks first.
 *
 * Run:
 *   npx tsx scripts/sanity/fix-xerf-seo.ts
 *   npx tsx scripts/sanity/fix-xerf-seo.ts --write
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

/** 30 characters; the page title becomes 54 with the site suffix. */
const POST_SEO_TITLE = "XERF vs HIFU: Which Is Better?";
const POST_SLUG = "xerf-vs-hifu";
const TREATMENT_ID = "treatment.xerf";
const COMPARISON_SECTION = "HIFU vs Thermage vs XERF: Quick Comparison";
const LINK_KEY = "link-xerf-vs-hifu";

type Child = { _key?: string; _type?: string; text?: string; marks?: string[] };
type Block = {
  _key: string;
  _type: string;
  style?: string;
  children?: Child[];
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  body?: Block[];
};
type Doc = {
  _id: string;
  _type: string;
  title?: string;
  seo?: { title?: string; description?: string; image?: { asset?: unknown } };
  body?: Block[];
  sections?: Array<{ _key: string; title?: string; blocks?: Block[] }>;
  [k: string]: unknown;
};

function plainText(block: Block): string {
  return (block.children ?? []).map((child) => child.text ?? "").join("");
}

function normalise(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

/** The draft if one exists, else the published document. */
async function load(query: string, params: Record<string, string> = {}) {
  const documents = await client.fetch<Doc[]>(query, params);
  const baseId = (id: string) => id.replace(/^drafts\./, "");
  const draft = documents.find((document) => document._id.startsWith("drafts."));
  const published = documents.find((document) => !document._id.startsWith("drafts."));
  const source = draft ?? published;
  if (!source) return null;
  return { source, draft, published, baseId: baseId(source._id) };
}

async function ensureDraft(
  baseId: string,
  draft: Doc | undefined,
  published: Doc | undefined,
) {
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

function backup(document: Doc) {
  const dir = new URL("./backups/", import.meta.url);
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = new URL(`${document._id.replace(/[^\w.-]/g, "_")}.${stamp}.json`, dir);
  writeFileSync(file, JSON.stringify(document, null, 2));
  console.log(`    backup → scripts/sanity/backups/${file.pathname.split("/").pop()}`);
}

async function fixPost() {
  console.log("Post · xerf-vs-hifu");
  const found = await load(
    `*[_type=="post" && slug.current==$slug]`,
    { slug: POST_SLUG },
  );
  if (!found) {
    console.log("    not found — skipped\n");
    return;
  }
  const { source, draft, published, baseId } = found;

  const set: Record<string, unknown> = {};
  const unset: string[] = [];

  if (source.title && source.title !== source.title.trim()) {
    set.title = source.title.trim();
  }
  if (source.seo?.title !== POST_SEO_TITLE) set["seo.title"] = POST_SEO_TITLE;
  const description = source.seo?.description;
  if (description && description !== description.trim()) {
    set["seo.description"] = description.trim();
  }
  if (source.seo?.image && !source.seo.image.asset) unset.push("seo.image");

  const first = source.body?.[0];
  if (
    first &&
    first._type === "block" &&
    (first.style ?? "normal") === "normal" &&
    normalise(plainText(first)) === normalise(source.title ?? "")
  ) {
    unset.push(`body[_key=="${first._key}"]`);
  }

  if (Object.keys(set).length === 0 && unset.length === 0) {
    console.log("    already fixed — nothing to do\n");
    return;
  }

  for (const [path, value] of Object.entries(set)) {
    console.log(`    set    ${path.padEnd(16)} ${JSON.stringify(value)}`);
  }
  for (const path of unset) console.log(`    unset  ${path}`);

  if (WRITE) {
    backup(source);
    const draftId = await ensureDraft(baseId, draft, published);
    let patch = client.patch(draftId);
    if (Object.keys(set).length) patch = patch.set(set);
    if (unset.length) patch = patch.unset(unset);
    await patch.commit();
  }
  console.log();
}

async function fixTreatment() {
  console.log("Treatment · xerf");
  const found = await load(`*[_id in [$id, "drafts." + $id]]`, { id: TREATMENT_ID });
  if (!found) {
    console.log("    not found — skipped\n");
    return;
  }
  const { source, draft, published, baseId } = found;

  const section = source.sections?.find((item) => item.title === COMPARISON_SECTION);
  if (!section) {
    console.log(`    section "${COMPARISON_SECTION}" not found — skipped\n`);
    return;
  }

  const linked = (section.blocks ?? []).some((block) =>
    (block.body ?? []).some((paragraph) =>
      (paragraph.markDefs ?? []).some((def) => def.href === "/xerf-vs-hifu"),
    ),
  );
  if (linked) {
    console.log("    link already present — nothing to do\n");
    return;
  }

  const stem = `block-${String((section.blocks?.length ?? 0) + 1).padStart(3, "0")}`;
  const block: Block = {
    _key: stem,
    _type: "treatmentContentBlock",
    body: [
      {
        _key: `${stem}-p-1`,
        _type: "block",
        style: "normal",
        markDefs: [{ _key: LINK_KEY, _type: "textLink", href: "/xerf-vs-hifu" }],
        children: [
          {
            _key: `${stem}-p-1-a`,
            _type: "span",
            marks: [],
            text: "For a closer side-by-side of XERF and HIFU on comfort, depth, downtime and how long results last, read our ",
          },
          { _key: `${stem}-p-1-b`, _type: "span", marks: [LINK_KEY], text: "XERF vs HIFU guide" },
          { _key: `${stem}-p-1-c`, _type: "span", marks: [], text: "." },
        ],
      },
    ],
  };
  console.log(`    insert after the last block of "${COMPARISON_SECTION}" → link to /xerf-vs-hifu`);

  if (WRITE) {
    backup(source);
    const draftId = await ensureDraft(baseId, draft, published);
    await client
      .patch(draftId)
      .insert("after", `sections[_key=="${section._key}"].blocks[-1]`, [block])
      .commit();
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

  await fixPost();
  await fixTreatment();

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
