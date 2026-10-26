/**
 * Puts back the small icons that sit above each label on two pages of the old
 * WordPress site: "What Skin Conditions Improve with Salmon DNA?" (six) and
 * the "Why Should I choose Healthy Look Aesthetic?" list of the Hydra Facial
 * article (five).
 *
 * ── ICONS BELONG TO THE HEADING BELOW THEM ─────────────────────────────
 * On staging every icon sits above its claim, so the label that follows an
 * icon is the one it illustrates. The order below is read straight from the
 * staging page, not from the icons' file names.
 *
 * ── WHAT EACH PAGE GETS ────────────────────────────────────────────────
 *  - Salmon DNA: the six bullet points become one block each, in the
 *    iconCards layout (icon above its label, three across) — the same shape
 *    the 2026-10-20 restore gave the other treatment pages.
 *  - Hydra Facial: an icon is inserted directly before each label heading.
 *    The article renderer draws a run of icon + heading pairs as an icon
 *    list (groupBlocks in SanityPortableText.tsx).
 *
 * Not touched: Liquid Lifting (its article is edited by the clinic) and the
 * Personalized Mesotherapy article (it now redirects).
 *
 * Draft-only. A slot that already has its icon is left alone.
 * Dry run:  npx tsx scripts/sanity/add-salmon-dna-and-hydra-facial-icons.ts
 * Apply:    npx tsx scripts/sanity/add-salmon-dna-and-hydra-facial-icons.ts --apply
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
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
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19",
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: "raw",
});
const apply = process.argv.includes("--apply");
const STAGING = "https://staging.healthylook-aesthetic.com/wp-content/uploads/";

/** Label → icon, in the order they appear on staging. */
const SALMON: Array<[string, string]> = [
  ["Scars", "2023/10/Website-Pictures-21.png"],
  ["Enlarged pores", "2023/10/Website-Pictures-20.png"],
  ["Wrinkles & Fine Lines", "2023/10/14.png"],
  ["Dull Skin", "2023/10/Website-Pictures-23.png"],
  ["Redness", "2023/10/Website-Pictures-18.png"],
  ["Dark Circle", "2023/10/Website-Pictures-24.png"],
];
const HYDRA: Array<[string, string]> = [
  ["Free Personalized Facial Consultations", "2023/10/Website-Pictures-7.png"],
  ["Safe & Relaxing Experience", "2023/10/28.png"],
  ["Clinically Proven Result", "2023/10/Website-Pictures-8.png"],
  ["Real Result from the First Session", "2023/10/Website-Pictures-9.png"],
  ["Best Worldwide Products", "2023/10/Website-Pictures-10.png"],
];

type Doc = Record<string, unknown> & { _id: string; _type: string; _rev?: string };
type Block = Record<string, unknown> & { _key: string; _type: string; style?: string; children?: Array<{ text?: string }> };
type Section = Record<string, unknown> & { _key: string; _type: string; title?: string; display?: string; points?: string[]; blocks?: unknown[] };

const key = (seed: string) => createHash("sha1").update(seed).digest("hex").slice(0, 12);
const image = (ref: string, alt: string) => ({
  _type: "imageWithAlt",
  asset: { _type: "reference", _ref: ref },
  alt,
  uncropped: true,
});
const ptText = (b: Block) => (b.children ?? []).map((c) => c.text ?? "").join("").trim();
const isHeading = (b: Block | undefined) => b?._type === "block" && /^h\d$/.test(b.style ?? "");

async function assetFor(file: string): Promise<string> {
  const sourceId = `staging-wp:${file}`;
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && source.id == $id][0]._id`,
    { id: sourceId },
  );
  if (existing) return existing;
  const url = STAGING + file;
  const head = await fetch(url, { method: "HEAD" });
  if (!head.ok || !head.headers.get("content-type")?.startsWith("image/")) {
    throw new Error(`Not an image (${head.status}): ${url}`);
  }
  if (!apply) return `(upload) ${file}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const asset = await client.assets.upload("image", Buffer.from(await response.arrayBuffer()), {
    filename: file.split("/").pop()!,
    source: { name: "Staging WordPress", id: sourceId, url },
  });
  return asset._id;
}

function strip(doc: Doc) {
  const { _rev, _createdAt, _updatedAt, ...rest } = doc as Doc & { _createdAt?: string; _updatedAt?: string };
  void _rev;
  void _createdAt;
  void _updatedAt;
  return rest;
}

async function main() {
  const me = await client.request<{ roles?: Array<{ name: string }> }>({ uri: "/users/me" });
  const roles = (me.roles ?? []).map((r) => r.name);
  if (apply && !roles.some((r) => r === "editor" || r === "administrator")) {
    throw new Error(`SANITY_API_WRITE_TOKEN has roles [${roles.join(", ")}] — it cannot write.`);
  }

  const refs = new Map<string, string>();
  for (const [, file] of [...SALMON, ...HYDRA]) refs.set(file, await assetFor(file));
  const fresh = [...refs.values()].filter((v) => v.startsWith("(upload)")).length;
  console.log(`${refs.size} icons: ${fresh} to upload, ${refs.size - fresh} already in the media library.`);

  // ── Salmon DNA: bullet points → one icon block each ──────────────────
  {
    const id = "treatment.salmon-dna";
    const [published, draft] = await Promise.all([client.getDocument<Doc>(id), client.getDocument<Doc>(`drafts.${id}`)]);
    const base = draft ?? published;
    if (!base) throw new Error(`No document ${id}`);
    const sections = structuredClone((base.sections as Section[]) ?? []);
    const section = sections.find((s) => s._key === "section-001");
    if (!section) throw new Error(`${id}: no section-001`);
    const points = section.points ?? [];
    const expected = SALMON.map(([label]) => label);
    if (!points.length) {
      console.log(`\n${id}: section-001 has no bullet points left — nothing to do.`);
    } else if (JSON.stringify(points) !== JSON.stringify(expected)) {
      throw new Error(`${id}: section-001 points changed since this was written: ${JSON.stringify(points)}`);
    } else {
      section.blocks = [
        ...(section.blocks ?? []),
        ...SALMON.map(([label, file], index) => ({
          _key: `section-001-claim-${String(index + 1).padStart(2, "0")}`,
          _type: "treatmentContentBlock",
          heading: label,
          image: image(refs.get(file)!, `Icon for ${label}`),
        })),
      ];
      delete section.points;
      section.display = "iconCards";
      console.log(`\n${id}${draft ? "  (editing its existing draft)" : ""}\n  points→icons  "${section.title}" (${SALMON.length}/${points.length} with an icon)`);
      if (apply) {
        if (draft) await client.patch(draft._id).ifRevisionId(draft._rev!).set({ sections }).commit();
        else await client.create({ ...strip(published!), _id: `drafts.${id}`, sections });
      }
    }
  }

  // ── Hydra Facial: an icon before each label heading ──────────────────
  {
    const id = "post.hydra-facial-in-ubud";
    const [published, draft] = await Promise.all([client.getDocument<Doc>(id), client.getDocument<Doc>(`drafts.${id}`)]);
    const base = draft ?? published;
    if (!base) throw new Error(`No document ${id}`);
    const body = structuredClone((base.body as Block[]) ?? []);
    let added = 0;
    for (const [label, file] of HYDRA) {
      const at = body.findIndex((b) => isHeading(b) && ptText(b) === label);
      if (at === -1) throw new Error(`${id}: no "${label}" heading`);
      if (body[at - 1]?._type === "imageWithAlt") {
        console.log(`  already has an icon: ${label}`);
        continue;
      }
      body.splice(at, 0, { _key: key(`${id}:icon:${file}`), ...image(refs.get(file)!, `Icon for ${label}`) } as Block);
      added += 1;
    }
    console.log(`\n${id}${draft ? "  (editing its existing draft)" : ""}\n  icons         ${added} placed before their headings`);
    if (apply && added) {
      if (draft) await client.patch(draft._id).ifRevisionId(draft._rev!).set({ body }).commit();
      else await client.create({ ...strip(published!), _id: `drafts.${id}`, body });
    }
  }

  console.log(apply ? "\nDone. Review the drafts, then publish." : "\nDry run. Re-run with --apply.");
}

main().catch((error) => {
  console.error(`\n  ${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
