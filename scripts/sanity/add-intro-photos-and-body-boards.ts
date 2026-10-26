/**
 * Puts back the opening photos that five treatment pages had on the old
 * WordPress site and lost here, and gives the two treatments that had
 * before/after photos there — and none here — their board.
 *
 * ── WHERE THIS COMES FROM ──────────────────────────────────────────────
 * Client, via Irene (WhatsApp, 2026-10-26): "it seems there are some photos
 * that haven't uploaded yet", with the Botox and Sculptra pages as examples.
 * The Botox photo is on the new page already (as its hero); the Sculptra box
 * was not. A re-audit of the 57 staging pages found the same gap on others.
 * Each photo below sits on staging in the first text section, beside the
 * paragraph that opens the page, which is the section that takes it here.
 *
 * Instruction (2026-10-26): add before/after photos only for a treatment that
 * had them on WordPress and has none now, and never leave a picture twice.
 *
 * ── NOT DONE, ON PURPOSE ───────────────────────────────────────────────
 *  - Chemical Peel's before/after: the same photo is already on /before-after
 *    (Hair & Skin Treatment board, #3). Adding it again would be a duplicate.
 *  - Juvelook: the section that holds it already has a picture.
 *  - Medi Facial: the page has no opening section to put it in.
 *  - Dermal Filler's lip photo is the "Popular areas" picture, which was left
 *    out deliberately on 2026-10-20.
 *  - Exosome's three before/after photos carry "Credit to Exosome" — the
 *    manufacturer's patients, not the clinic's.
 *  - The 34 extra photos the 2026-10-20 draft of /before-after added to boards
 *    that already exist: not asked for. That draft is replaced by published +
 *    the two new boards; its previous content is saved next to this run.
 *
 * ── NO DUPLICATES ──────────────────────────────────────────────────────
 * Uploads are looked up by source id first (and Sanity itself returns the
 * existing asset for identical bytes). A slot that already holds a picture is
 * left alone and reported, and an asset already on the board is never added
 * twice.
 *
 * Draft-only. Dry run:  npx tsx scripts/sanity/add-intro-photos-and-body-boards.ts
 * Apply:                npx tsx scripts/sanity/add-intro-photos-and-body-boards.ts --apply
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
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

/** One opening photo: where it was on staging, and the section that takes it. */
const INTRO: Array<{ doc: string; section: string; file: string; alt: string }> = [
  { doc: "treatment.sculptra", section: "section-001", file: "2026/05/IMG_3599.jpg", alt: "Sculptra box and vials on red satin" },
  { doc: "treatment.hair-mesotherapy", section: "section-001", file: "2023/10/14.jpg", alt: "A man receiving a hair mesotherapy injection at the temple" },
  { doc: "treatment.muscle-sculpting", section: "section-001", file: "2024/07/Body-Treatment.jpg", alt: "A woman standing beside the CM Slim muscle sculpting device" },
  { doc: "treatment.skin-booster", section: "section-002", file: "2024/07/Skin-treatment-profhilo.jpg", alt: "A woman receiving a skin booster treatment on the forehead" },
  { doc: "treatment.salmon-dna", section: "section-002", file: "2025/10/Rejuran_Boxes_Updated_2021_v22.jpg", alt: "Rejuran salmon DNA product boxes" },
];

/** The two treatments with before/after photos on staging and no board here. */
const BOARDS: Array<{
  anchor: string;
  title: string;
  treatment: string;
  photos: Array<{ file: string; alt: string }>;
}> = [
  {
    anchor: "hifu-body",
    title: "HIFU Body",
    treatment: "treatment.hifu-body",
    photos: [
      { file: "2024/11/198.jpg", alt: "Before and after HIFU Body on the upper arm" },
      { file: "2024/11/199.jpg", alt: "Before and after HIFU Body on the waist" },
      { file: "2024/11/200.jpg", alt: "Before and after HIFU Body on the thighs" },
    ],
  },
  {
    anchor: "autologous-micrograft",
    title: "Autologous Micrograft Hair Restoration",
    treatment: "treatment.autologues-micrograft-hair-restoration",
    photos: [
      { file: "2025/07/Best-Before-After-2-min.jpg", alt: "Before and after autologous micrograft hair restoration at the temples" },
      { file: "2025/07/Best-Before-After-2-1-min.jpg", alt: "Before and after autologous micrograft hair restoration on the crown" },
    ],
  },
];

type Doc = Record<string, unknown> & { _id: string; _type: string; _rev?: string };
type Section = Record<string, unknown> & { _key: string; _type: string; title?: string; anchor?: string; image?: unknown; images?: unknown[] };

const key = (seed: string) => createHash("sha1").update(seed).digest("hex").slice(0, 12);
const image = (ref: string, alt: string) => ({
  _type: "imageWithAlt",
  asset: { _type: "reference", _ref: ref },
  alt,
  uncropped: true,
});

async function retry<T>(label: string, work: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await work();
    } catch (error) {
      if (attempt >= attempts) throw new Error(`${label}: ${error instanceof Error ? error.message : error}`);
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }
}

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
  const body = await retry(`download ${file}`, async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return Buffer.from(await response.arrayBuffer());
  });
  const asset = await retry(`upload ${file}`, () =>
    client.assets.upload("image", body, {
      filename: file.split("/").pop()!,
      source: { name: "Staging WordPress", id: sourceId, url },
    }),
  );
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

  const files = [...new Set([...INTRO.map((i) => i.file), ...BOARDS.flatMap((b) => b.photos.map((p) => p.file))])];
  const refs = new Map<string, string>();
  for (const file of files) refs.set(file, await assetFor(file));
  const toUpload = [...refs.values()].filter((v) => v.startsWith("(upload)")).length;
  console.log(`${files.length} photos: ${toUpload} to upload, ${files.length - toUpload} already in the media library.`);

  const skipped: string[] = [];

  // ── Opening photos, one treatment each ──────────────────────────────
  for (const item of INTRO) {
    const [published, draft] = await Promise.all([
      client.getDocument<Doc>(item.doc),
      client.getDocument<Doc>(`drafts.${item.doc}`),
    ]);
    const base = draft ?? published;
    if (!base) throw new Error(`No document ${item.doc}`);
    const sections = structuredClone((base.sections as Section[]) ?? []);
    const target = sections.find((s) => s._key === item.section);
    if (!target) throw new Error(`${item.doc}: no section ${item.section}`);
    const ref = refs.get(item.file)!;
    const taken = JSON.stringify(sections).includes(ref);
    if (target.image || taken) {
      skipped.push(`${item.doc} ${item.section}: ${target.image ? "already has a picture" : "that photo is already on the page"}`);
      continue;
    }
    target.image = image(ref, item.alt);
    console.log(`\n${item.doc}${draft ? "  (editing its existing draft)" : ""}\n  photo         "${target.title?.slice(0, 50)}" ← ${item.file}`);
    if (!apply) continue;
    if (draft) await client.patch(draft._id).ifRevisionId(draft._rev!).set({ sections }).commit();
    else await client.create({ ...strip(published!), _id: `drafts.${item.doc}`, sections });
  }

  // ── /before-after: published + the two new boards, nothing else ─────
  const id = "page.before-after";
  const [published, draft] = await Promise.all([client.getDocument<Doc>(id), client.getDocument<Doc>(`drafts.${id}`)]);
  if (!published) throw new Error("page.before-after is not published");
  const sections = structuredClone((published.sections as Section[]) ?? []);
  const galleries = sections.filter((s) => s._type === "gallerySection");
  let eyebrow = Math.max(...galleries.map((g) => Number(g.eyebrow) || 0));
  for (const spec of BOARDS) {
    if (sections.some((s) => s._type === "gallerySection" && s.anchor === spec.anchor)) {
      skipped.push(`#${spec.anchor} already exists on the published page`);
      continue;
    }
    eyebrow += 1;
    const board: Section = {
      _key: `results-${spec.anchor}`,
      _type: "gallerySection",
      anchor: spec.anchor,
      eyebrow: String(eyebrow),
      title: spec.title,
      description: "Published treatment outcomes shared with patient consent.",
      tone: "paper",
      isHidden: false,
      treatment: { _type: "reference", _ref: spec.treatment },
      images: spec.photos.map((p) => ({ _key: key(`${spec.anchor}:${p.file}`), ...image(refs.get(p.file)!, p.alt) })),
    };
    const refsOnBoard = (board.images as Array<{ asset: { _ref: string } }>).map((i) => i.asset._ref);
    if (new Set(refsOnBoard).size !== refsOnBoard.length) throw new Error(`#${spec.anchor} lists a photo twice`);
    const last = sections.findLastIndex((s) => s._type === "gallerySection");
    sections.splice(last + 1, 0, board);
    console.log(`\n${id}\n  new board     #${spec.anchor} → ${spec.treatment} (${spec.photos.length} photos)`);
  }
  if (draft) {
    console.log(`  replaces its existing draft (${(draft.sections as Section[]).length} sections) with published + new boards`);
  }
  if (apply) {
    if (draft) {
      const dir = join(process.cwd(), "scripts", "sanity", "backups");
      mkdirSync(dir, { recursive: true });
      const file = join(dir, `drafts.page.before-after.${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
      writeFileSync(file, JSON.stringify(draft, null, 1));
      console.log(`  previous draft saved: ${file}`);
    }
    await client.createOrReplace({ ...strip(published), _id: `drafts.${id}`, sections });
  }

  if (skipped.length) {
    console.log(`\nLeft alone (${skipped.length}):`);
    for (const s of skipped) console.log(`  ${s}`);
  }
  console.log(apply ? "\nDone. Review the drafts, then publish." : "\nDry run. Re-run with --apply.");
}

main().catch((error) => {
  console.error(`\n  ${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
