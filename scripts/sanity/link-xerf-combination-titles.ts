/**
 * Links the card titles in the XERF page's "Can XERF Be Combined with Other
 * Treatments?" section to the treatment each card is about, as a DRAFT.
 *
 * ── WHAT IT SETS ───────────────────────────────────────────────────────
 * `headingLink` on each card block — the field that makes a subheading a
 * link. Only the title is touched; the card text is not.
 *
 * ── WHICH CARDS ────────────────────────────────────────────────────────
 * A card is linked only when its text does not already link to its page.
 * HIFU, Skin booster, Botox and Collagen stimulator each carry a link in
 * their own paragraph, so they are left alone and reported: a second link
 * to the same page one line above it adds nothing. Dermal filler, Sylfirm
 * RF microneedling, Microneedling and Chemical peeling have none.
 *
 * A target is checked against the published treatments first, and a card
 * whose page does not exist is skipped rather than linked to a 404.
 *
 * ── DRY RUN BY DEFAULT, DRAFT ONLY ─────────────────────────────────────
 * No flag prints what would change. --write backs up the document it is
 * about to patch (scripts/sanity/backups/), then patches drafts.<id> and
 * never the published document. Safe to re-run: a card that already has a
 * link is left as it is.
 *
 * Run:
 *   npx tsx scripts/sanity/link-xerf-combination-titles.ts
 *   npx tsx scripts/sanity/link-xerf-combination-titles.ts --write
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

const TREATMENT_ID = "treatment.xerf";
const SECTION_TITLE = "Can XERF Be Combined with Other Treatments?";

/** The words before the dash in a card title → the treatment's slug. */
const CARD_TO_SLUG: Record<string, string> = {
  HIFU: "hifu",
  "Skin booster": "skin-booster",
  Botox: "botox",
  "Collagen stimulator": "collagen-stimulator",
  "Dermal filler": "dermal-filler",
  "Sylfirm RF microneedling": "microneedling/rf",
  Microneedling: "microneedling",
  "Chemical peeling": "chemical-peel",
};

type Span = { text?: string };
type Paragraph = { _type: string; children?: Span[]; markDefs?: Array<{ href?: string }> };
type Block = {
  _key: string;
  _type: string;
  heading?: string;
  headingLink?: string;
  body?: Paragraph[];
};
type Doc = {
  _id: string;
  _type: string;
  sections?: Array<{ _key: string; title?: string; blocks?: Block[] }>;
  [k: string]: unknown;
};

/** "Dermal filler — yes, on the same day" → "Dermal filler". */
const cardName = (heading: string) => heading.split(/\s+[—–-]\s+/)[0].trim();

/** A link's path, whether it was written as /x or as the full site URL. */
function pathOf(href: string): string {
  try {
    return new URL(href, "https://healthylook-aesthetic.com").pathname.replace(/\/$/, "");
  } catch {
    return href;
  }
}

function backup(document: Doc) {
  const dir = new URL("./backups/", import.meta.url);
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = new URL(`${document._id.replace(/[^\w.-]/g, "_")}.${stamp}.json`, dir);
  writeFileSync(file, JSON.stringify(document, null, 2));
  console.log(`  backup → scripts/sanity/backups/${file.pathname.split("/").pop()}`);
}

async function main() {
  if (!env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN is missing from .env.local.");
  }
  console.log(
    WRITE ? "Writing drafts.\n" : "DRY RUN — nothing is written. Pass --write to apply.\n",
  );

  const documents = await client.fetch<Doc[]>(`*[_id in [$id, "drafts." + $id]]`, {
    id: TREATMENT_ID,
  });
  const draft = documents.find((document) => document._id.startsWith("drafts."));
  const published = documents.find((document) => !document._id.startsWith("drafts."));
  const source = draft ?? published;
  if (!source) throw new Error(`${TREATMENT_ID} not found.`);

  const section = source.sections?.find((item) => item.title === SECTION_TITLE);
  if (!section) throw new Error(`Section "${SECTION_TITLE}" not found.`);

  const liveSlugs = new Set(
    await client.fetch<string[]>(`*[_type=="treatment" && !(_id in path("drafts.**"))].slug.current`),
  );

  const set: Record<string, string> = {};
  for (const block of section.blocks ?? []) {
    if (block._type !== "treatmentContentBlock" || !block.heading) continue;
    const name = cardName(block.heading);
    const slug = CARD_TO_SLUG[name];
    const label = name.padEnd(26);

    if (!slug) {
      console.log(`  ${label} no page mapped — skipped`);
      continue;
    }
    const href = `/ubud-bali/${slug}`;
    if (block.headingLink) {
      console.log(`  ${label} title already links to ${block.headingLink} — left alone`);
      continue;
    }
    const linkedInText = (block.body ?? []).some((paragraph) =>
      (paragraph.markDefs ?? []).some((def) => def.href && pathOf(def.href) === href),
    );
    if (linkedInText) {
      console.log(`  ${label} text already links to ${href} — skipped`);
      continue;
    }
    if (!liveSlugs.has(slug)) {
      console.log(`  ${label} ${href} is not a published treatment — skipped`);
      continue;
    }

    set[`sections[_key=="${section._key}"].blocks[_key=="${block._key}"].headingLink`] = href;
    console.log(`  ${label} title → ${href}`);
  }

  if (Object.keys(set).length === 0) {
    console.log("\nNothing to add.");
    return;
  }

  if (WRITE) {
    backup(source);
    const draftId = `drafts.${TREATMENT_ID}`;
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
    await client.patch(draftId).set(set).commit();
  }

  console.log(
    WRITE
      ? "\nAll DRAFT only — nothing on the live site changes until the draft is published in Studio."
      : "\nNothing was written. Re-run with --write to apply.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
