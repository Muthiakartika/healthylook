/**
 * Brings the pictures the old WordPress site shows, and this site lost, over
 * to their matching places here: icons on the "Why choose" lists, photos and
 * diagrams in treatment sections, before/after photos on their treatment's
 * board, photos inside blog articles, and the six gift card designs.
 *
 * ── WHERE THE LIST COMES FROM ──────────────────────────────────────────
 * Client, via Irene (WhatsApp, 2026-10-20): "as in new website, there are
 * many missing pictures". Every image in the main content of the 57 pages on
 * staging.healthylook-aesthetic.com (294 once the logo, partner logos and
 * footer icons are set aside) was compared with all 206 Sanity assets and
 * the 103 files in public/images — by name, by a visual fingerprint, and by
 * keypoint matching, which is what catches the clinic's Canva re-crops of
 * the same before/after photos. 141 were already here in some form and are
 * not uploaded again; the rest are in restore-staging-images.data.json with
 * the exact section, block, board or article paragraph each one belongs to.
 *
 * Three pairs on WordPress are the same picture uploaded twice. Each is
 * uploaded once and placed in both spots (`aliases` in the data file).
 *
 * ── ICONS BELONG TO THE HEADING BELOW THEM ─────────────────────────────
 * On staging every icon sits above its claim, so the heading that follows
 * an icon is the one it illustrates; photos follow their heading instead.
 * Read the other way round, HIFU's smile icon labels "Long-Lasting Results".
 *
 * Sections whose claims were stored as plain `points` become one block per
 * claim (the text kept word for word, split at its dash into label and
 * sentence) so each can carry its icon, and take the iconCards layout.
 *
 * ── SAFE TO RE-RUN ─────────────────────────────────────────────────────
 * Uploads are looked up by source id first, so a second run uploads
 * nothing. A slot that already holds a picture is left alone and reported.
 * Draft-only, like every script here: review in Studio, then publish.
 *
 * ⚠ Publish only after the matching code is deployed: the icon layout
 * printed a claim's heading alone until this change, so publishing first
 * would show the icons and hide every claim's sentence on the live site.
 *
 * Dry run:  npx tsx scripts/sanity/restore-staging-images.ts
 * Apply:    npx tsx scripts/sanity/restore-staging-images.ts --apply
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
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

type Upload =
  | { from: "staging"; url: string; filename: string; bytes?: number }
  | { from: "local"; path: string; filename: string };
type Placement = {
  kind: "icon" | "icon-point" | "section-image" | "block-image" | "board" | "post-image" | "gift-design";
  doc: string;
  /** A key of `uploads`, or an existing asset id. */
  file: string;
  staging: string;
  alt: string;
  section?: string;
  block?: string;
  point?: number;
  label?: string;
  display?: string;
  board?: string;
  after?: string | null;
};
const data = JSON.parse(
  readFileSync(new URL("./restore-staging-images.data.json", import.meta.url), "utf8"),
) as { uploads: Record<string, Upload>; placements: Placement[] };

/* New boards: the treatments that had before/after photos on staging and
 * no board of their own here. */
const NEW_BOARDS: Record<string, { anchor: string; title: string; treatment: string }> = {
  "NEW:hifu-body": { anchor: "hifu-body", title: "HIFU Body", treatment: "treatment.hifu-body" },
  "NEW:autologous-micrograft": {
    anchor: "autologous-micrograft",
    title: "Autologous Micrograft Hair Restoration",
    treatment: "treatment.autologues-micrograft-hair-restoration",
  },
};
const ICON_DISPLAYS = ["iconRow", "iconGrid", "iconCards"];

type Doc = Record<string, unknown> & { _id: string; _type: string; _rev?: string };
type Block = Record<string, unknown> & { _key: string; heading?: string; image?: unknown };
type Section = Record<string, unknown> & {
  _key: string;
  _type: string;
  title?: string;
  anchor?: string;
  display?: string;
  image?: unknown;
  blocks?: Block[];
  points?: string[];
  images?: unknown[];
};
type PtBlock = Record<string, unknown> & {
  _key: string;
  _type: string;
  style?: string;
  children?: Array<{ text?: string }>;
};

const key = (seed: string) => createHash("sha1").update(seed).digest("hex").slice(0, 12);
const norm = (text: string | undefined) =>
  (text ?? "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
const ptText = (block: PtBlock) => (block.children ?? []).map((c) => c.text ?? "").join("");
/** Same heading on both sites, allowing for one being a longer version. */
function sameHeading(a: string | undefined, b: string | undefined) {
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return false;
  return x === y || x.startsWith(`${y} `) || y.startsWith(`${x} `);
}
function textBlock(text: string, seed: string) {
  return [
    {
      _key: key(`${seed}:block`),
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{ _key: key(`${seed}:span`), _type: "span", text, marks: [] }],
    },
  ];
}

async function assetFor(file: string, upload: Upload | undefined): Promise<string> {
  if (!upload) return file; // an existing asset id
  const source =
    upload.from === "staging"
      ? { name: "Staging WordPress", id: `staging-wp:${file}`, url: upload.url }
      : {
          name: "Website migration",
          id: `hla-public:${upload.path.replace(/^public/, "")}`,
          url: `https://healthylook-aesthetic.com${upload.path.replace(/^public/, "")}`,
        };
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && source.id == $id][0]._id`,
    { id: source.id },
  );
  if (existing) return existing;
  if (!apply) return `(upload) ${upload.filename}`;
  const body =
    upload.from === "staging"
      ? await retry(`download ${upload.filename}`, async () => {
          const response = await fetch(upload.url);
          if (!response.ok) throw new Error(`${response.status} ${upload.url}`);
          return Buffer.from(await response.arrayBuffer());
        })
      : readFileSync(join(process.cwd(), upload.path));
  const asset = await retry(`upload ${upload.filename}`, () =>
    client.assets.upload("image", body, { filename: upload.filename, source }),
  );
  return asset._id;
}

/* The first run died on its fourth file with a bare "fetch failed" — a
 * dropped connection, not a bad file. 131 files one after another will
 * meet one of those; a run that has to be restarted by hand for each is
 * the wrong shape. Uploads are idempotent (looked up by source id), so a
 * retry can never produce a second copy. */
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

function image(ref: string, alt: string) {
  return { _type: "imageWithAlt", asset: { _type: "reference", _ref: ref }, alt, uncropped: true };
}

async function main() {
  const me = await client.request<{ roles?: Array<{ name: string }> }>({ uri: "/users/me" });
  const roles = (me.roles ?? []).map((r) => r.name);
  if (apply && !roles.some((r) => r === "editor" || r === "administrator")) {
    throw new Error(`SANITY_API_WRITE_TOKEN has roles [${roles.join(", ")}] — it cannot write.`);
  }

  // ── Uploads, one at a time ──────────────────────────────────────────
  const refs = new Map<string, string>();
  const needed = [...new Set(data.placements.map((p) => p.file))];
  let uploaded = 0;
  let reused = 0;
  for (const [i, file] of needed.entries()) {
    const upload = data.uploads[file];
    if (upload?.from === "staging" && !apply) {
      const head = await fetch(upload.url, { method: "HEAD" });
      if (!head.ok || !head.headers.get("content-type")?.startsWith("image/")) {
        throw new Error(`Not an image (${head.status}): ${upload.url}`);
      }
    }
    const ref = await assetFor(file, upload);
    if (ref.startsWith("(upload)")) uploaded += 1;
    else if (upload && apply && !ref.startsWith("image-")) throw new Error(`Upload failed: ${file}`);
    else reused += upload ? 1 : 0;
    refs.set(file, ref);
    if (apply && upload) process.stdout.write(`\r  assets ${i + 1}/${needed.length}`);
  }
  if (apply) process.stdout.write("\n");
  console.log(
    apply
      ? `Assets ready: ${needed.length}.`
      : `${uploaded} files to upload, ${reused} already uploaded, ${needed.length - uploaded - reused} existing assets reused.`,
  );

  // ── Edits, per document ─────────────────────────────────────────────
  const byDoc = new Map<string, Placement[]>();
  for (const p of data.placements) byDoc.set(p.doc, [...(byDoc.get(p.doc) ?? []), p]);
  const skipped: string[] = [];

  for (const [docRef, placements] of byDoc) {
    let id = docRef;
    if (docRef.startsWith("post:")) {
      const found = await client.fetch<string | null>(
        `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
        { slug: docRef.slice(5) },
      );
      if (!found) throw new Error(`No published post ${docRef}`);
      id = found;
    }
    const [published, draft] = await Promise.all([
      client.getDocument<Doc>(id),
      client.getDocument<Doc>(`drafts.${id}`),
    ]);
    const base = draft ?? published;
    if (!base) throw new Error(`No document ${id}`);
    const field = base._type === "post" ? "body" : "sections";
    const value = structuredClone((base[field] as unknown[]) ?? []) as Array<Section & PtBlock>;
    const notes: string[] = [];

    if (base._type === "treatment") {
      const sections = value as Section[];
      const pointIcons = new Map<string, Map<number, Placement>>();
      for (const p of placements) {
        const section = sections.find((s) => s._key === p.section);
        if (!section) throw new Error(`${id}: no section ${p.section}`);
        if (p.kind === "icon-point") {
          const icons = pointIcons.get(section._key) ?? new Map<number, Placement>();
          icons.set(p.point!, p);
          pointIcons.set(section._key, icons);
          continue;
        }
        const target = p.block ? section.blocks?.find((b) => b._key === p.block) : section;
        if (!target) throw new Error(`${id}: no block ${p.section}/${p.block}`);
        if (target.image) {
          skipped.push(`${id} ${p.section}/${p.block ?? ""} already has a picture — ${p.staging}`);
          continue;
        }
        target.image = image(refs.get(p.file)!, p.alt);
        if (p.kind === "icon" && !ICON_DISPLAYS.includes(section.display ?? "")) section.display = "iconCards";
        if (p.display) section.display = p.display;
        notes.push(`${p.kind.padEnd(13)} ${section.title?.slice(0, 40)} › ${p.label ?? p.block ?? "section"}`);
      }
      for (const [sectionKey, icons] of pointIcons) {
        const section = sections.find((s) => s._key === sectionKey)!;
        const points = section.points ?? [];
        if (!points.length) {
          // Already converted by an earlier run, or rewritten in Studio since.
          skipped.push(`${id} ${sectionKey} has no bullet points left to give icons`);
          continue;
        }
        const blocks: Block[] = points.map((point, index) => {
          const [heading, ...rest] = point.split(/\s+[—–-]\s+/);
          const seed = `${id}:${sectionKey}:${index}`;
          const icon = icons.get(index);
          return {
            _key: `${sectionKey}-claim-${String(index + 1).padStart(2, "0")}`,
            _type: "treatmentContentBlock",
            heading: heading.trim(),
            ...(rest.length ? { body: textBlock(rest.join(" – ").trim(), seed) } : {}),
            ...(icon ? { image: image(refs.get(icon.file)!, icon.alt) } : {}),
          };
        });
        section.blocks = [...(section.blocks ?? []), ...blocks];
        delete section.points;
        section.display = "iconCards";
        notes.push(`points→icons  ${section.title?.slice(0, 40)} (${icons.size}/${points.length} with an icon)`);
      }
    } else if (base._type === "post") {
      const body = value as PtBlock[];
      const isHeading = (b: PtBlock) => b._type === "block" && /^h\d$/.test(b.style ?? "");
      const cursor = new Map<string, number>();
      for (const p of placements) {
        const anchor = p.after ?? "";
        let at = cursor.get(anchor);
        if (at === undefined) {
          if (p.after) {
            const h = body.findIndex((b) => isHeading(b) && sameHeading(ptText(b), p.after!));
            if (h === -1) throw new Error(`${id}: no heading "${p.after}"`);
            at = body[h + 1]?._type === "block" && !isHeading(body[h + 1]) ? h + 2 : h + 1;
          } else {
            const h = body.findIndex(isHeading);
            at = h === -1 ? Math.min(1, body.length) : h;
          }
        }
        const ref = refs.get(p.file)!;
        if (body.some((b) => b._type === "imageWithAlt" && (b.asset as { _ref?: string })?._ref === ref)) {
          skipped.push(`${id} already shows ${p.staging}`);
          continue;
        }
        body.splice(at, 0, { _key: key(`${id}:${p.staging}`), ...image(ref, p.alt) } as PtBlock);
        cursor.set(anchor, at + 1);
        // Everything after the insertion point moved down by one.
        for (const [k, v] of cursor) if (k !== anchor && v >= at) cursor.set(k, v + 1);
        notes.push(`image         after "${p.after ?? "(intro)"}"`);
      }
    } else if (id === "page.before-after") {
      const sections = value as Section[];
      const galleries = sections.filter((s) => s._type === "gallerySection");
      let eyebrow = Math.max(...galleries.map((g) => Number(g.eyebrow) || 0));
      const added = new Map<string, number>();
      for (const p of placements) {
        const spec = NEW_BOARDS[p.board!];
        const anchor = spec?.anchor ?? p.board!;
        let board = sections.find((s) => s._type === "gallerySection" && s.anchor === anchor);
        if (!board && !spec) throw new Error(`No board #${anchor}`);
        if (!board) {
          eyebrow += 1;
          board = {
            _key: `results-${anchor}`,
            _type: "gallerySection",
            anchor,
            eyebrow: String(eyebrow),
            title: spec.title,
            description: "Published treatment outcomes shared with patient consent.",
            tone: "paper",
            isHidden: false,
            treatment: { _type: "reference", _ref: spec.treatment },
            images: [],
          };
          const last = sections.findLastIndex((s) => s._type === "gallerySection");
          sections.splice(last + 1, 0, board);
          notes.push(`new board     #${anchor} → ${spec.treatment}`);
        }
        const ref = refs.get(p.file)!;
        const images = (board.images ?? []) as Array<{ asset?: { _ref?: string } }>;
        if (images.some((img) => img.asset?._ref === ref)) {
          skipped.push(`#${anchor} already has ${p.staging}`);
          continue;
        }
        board.images = [...images, { _key: key(`${anchor}:${p.staging}`), ...image(ref, p.alt) }];
        added.set(anchor, (added.get(anchor) ?? 0) + 1);
      }
      for (const [anchor, count] of added) {
        const board = sections.find((s) => s._type === "gallerySection" && s.anchor === anchor)!;
        notes.push(`board         #${anchor}: +${count} → ${(board.images ?? []).length} photos`);
      }
    } else if (id === "page.gift-card") {
      const sections = value as Section[];
      if (sections.some((s) => s._key === "gift-designs")) {
        skipped.push("page.gift-card already has its designs gallery");
      } else {
        const form = sections.findIndex((s) => s._key === "gift-form");
        if (form === -1) throw new Error("page.gift-card: no gift-form section");
        sections.splice(form, 0, {
          _key: "gift-designs",
          _type: "gallerySection",
          title: "Gift card designs",
          tone: "paper",
          isHidden: false,
          images: placements.map((p) => ({ _key: key(`gift:${p.staging}`), ...image(refs.get(p.file)!, p.alt) })),
        });
        notes.push(`gallery       "Gift card designs" (${placements.length}) before the form`);
      }
    } else {
      throw new Error(`No handler for ${id}`);
    }

    console.log(`\n${id}${draft ? "  (editing its existing draft)" : ""}`);
    for (const n of notes) console.log(`  ${n}`);
    if (!apply || !notes.length) continue;

    if (draft) {
      await client.patch(draft._id).ifRevisionId(draft._rev!).set({ [field]: value }).commit();
    } else {
      const { _rev, _createdAt, _updatedAt, ...clonable } = published as Doc & {
        _createdAt?: string;
        _updatedAt?: string;
      };
      void _rev;
      void _createdAt;
      void _updatedAt;
      await client.create({ ...clonable, _id: `drafts.${id}`, [field]: value });
    }
  }

  if (skipped.length) {
    console.log(`\nLeft alone (${skipped.length}):`);
    for (const s of skipped) console.log(`  ${s}`);
  }
  console.log(apply ? "\nDone. Review the drafts in Studio, then publish." : "\nDry run. Re-run with --apply.");
}

main().catch((error) => {
  console.error(`\n  ${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
