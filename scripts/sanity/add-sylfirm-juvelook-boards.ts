/**
 * Adds "Sylfirm X" and "Juvelook" before/after boards to /before-after and
 * links each to its treatment page, so both pages get the embedded results
 * grid that Botox, HIFU, XERF and the rest already have.
 *
 * ── WHY THESE TWO PAGES HAD NO PHOTOS ──────────────────────────────────
 * A treatment page only shows photos when a board on /before-after is
 * linked to it (see getResultsForTreatment). Neither treatment had a board,
 * so both pages fell back to the heading and a link out — while the
 * clinic's own pages on the WordPress site show six and nine photos.
 *
 * ── WHERE THE PHOTOS COME FROM ─────────────────────────────────────────
 * Two sources, the clinic's own captioned photos first:
 *
 *   • Reused, not re-uploaded: the Canva photos already in the Skin
 *     Treatment board whose baked-in caption names the treatment —
 *     "Sylfirm X 1 Session" (2) and "Juvelook 1 Session" (5). They stay in
 *     Skin Treatment too; removing them from there is the client's call.
 *   • Uploaded: the photos under the clinic's own before/after headings on
 *     staging.healthylook-aesthetic.com/ubud-bali/microneedling/rf/ (6) and
 *     /ubud-bali/juvelook/ (the first 6 of 9 — the other 3 are uncaptioned
 *     copies of Canva photos reused above).
 *
 * Captioned first because a treatment page embeds only the first six, and
 * those are the ones that are unmistakably this clinic's own patients.
 *
 * Draft-only, like the rest of this folder: review in Studio and publish.
 * Refuses to run if either anchor already exists, so it cannot add a board
 * twice.
 *
 * Dry run:  npx tsx scripts/sanity/add-sylfirm-juvelook-boards.ts
 * Apply:    npx tsx scripts/sanity/add-sylfirm-juvelook-boards.ts --apply
 */
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

const PAGE_ID = "page.before-after";
const DRAFT_ID = `drafts.${PAGE_ID}`;
const apply = process.argv.includes("--apply");

const WP = "https://staging.healthylook-aesthetic.com/wp-content/uploads";

type Board = {
  anchor: string;
  title: string;
  eyebrow: string;
  treatmentSlug: string;
  /** Assets already in the Skin Treatment board, in the order to show them. */
  reuse: string[];
  /** Originals (no WordPress size suffix), in the page's own order. */
  upload: string[];
};

const BOARDS: Board[] = [
  {
    anchor: "sylfirm-x",
    title: "Sylfirm X",
    eyebrow: "11",
    treatmentSlug: "microneedling/rf",
    reuse: [
      "image-93c6da31e20fa0d226fdbc5ba0a14b335c03860f-1080x1080-png",
      "image-4507b26f91b7f9353271978c163b5d17ecac1a51-1080x1080-png",
    ],
    upload: [
      `${WP}/2024/06/B472AB5A-3834-4B56-8D19-1986C9F811DD-min.jpg`,
      `${WP}/2024/06/1A3B5256-D720-4863-B45C-1908DEDC1F2A-min.jpg`,
      `${WP}/2024/06/4D275E8D-501E-4913-B811-ABD4CA68DCCB-min.jpg`,
      `${WP}/2024/06/429BC1EF-FE49-482F-BD58-63DFA1A334ED-min.jpg`,
      `${WP}/2024/06/23E624C1-AF4D-4374-A928-A0F7AAB730DF-min.jpg`,
      `${WP}/2024/06/427B55D2-F56A-4B4E-9FBC-C39BAA494A42-min.jpg`,
    ],
  },
  {
    anchor: "juvelook",
    title: "Juvelook",
    eyebrow: "12",
    treatmentSlug: "juvelook",
    reuse: [
      "image-8d77016ae21c29a2cfa087da58633c1bae11235a-1080x1080-png",
      "image-44795e789210b4aa060f922e148ff3915fe87e8c-1080x1080-png",
      "image-05e8961a71f3be66e3576e9a31e2a216d5f4d114-1080x1080-png",
      "image-9dbe9ec9211757cf918a8ca7a33154f5651b9d3a-1080x1080-png",
      "image-8af89afd612efaa7fb7ac4a8440773a190f9d357-1080x1080-png",
    ],
    upload: [
      `${WP}/2025/01/1-1.jpg`,
      `${WP}/2025/01/2.jpg`,
      `${WP}/2025/01/6.jpg`,
      `${WP}/2025/01/4.jpg`,
      `${WP}/2025/01/3.jpg`,
      `${WP}/2025/01/5.jpg`,
    ],
  },
];

type ImageItem = {
  _key: string;
  _type: "imageWithAlt";
  asset: { _type: "reference"; _ref: string };
  alt: string;
};
type Section = { _key: string; _type: string; anchor?: string };
type PageDoc = { _id: string; _type: "page"; sections: Section[] };

async function main() {
  if (!env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN is missing from .env.local.");
  }

  const [published, existingDraft] = await Promise.all([
    client.getDocument<PageDoc>(PAGE_ID),
    client.getDocument<PageDoc>(DRAFT_ID),
  ]);
  if (!published) throw new Error(`No published ${PAGE_ID}.`);
  const base = existingDraft ?? published;

  // Every check runs before anything is uploaded or written — a run that
  // refuses to start is far easier to deal with than half a board.
  const taken = new Set([...published.sections, ...base.sections].map((s) => s.anchor));
  const plan = await Promise.all(
    BOARDS.map(async (board) => {
      if (taken.has(board.anchor)) {
        throw new Error(`A section with anchor "${board.anchor}" already exists.`);
      }
      const treatment = await client.fetch<{ _id: string; name?: string } | null>(
        `*[_type == "treatment" && slug.current == $slug && !(_id in path("drafts.**"))][0]{_id, name}`,
        { slug: board.treatmentSlug },
      );
      if (!treatment) throw new Error(`No published treatment "${board.treatmentSlug}".`);
      const found = await client.fetch<string[]>(
        `*[_id in $ids]._id`,
        { ids: board.reuse },
      );
      const missing = board.reuse.filter((id) => !found.includes(id));
      if (missing.length) throw new Error(`Missing assets: ${missing.join(", ")}`);
      for (const url of board.upload) {
        const head = await fetch(url, { method: "HEAD" });
        if (!head.ok || !head.headers.get("content-type")?.startsWith("image/")) {
          throw new Error(`Not an image (${head.status}): ${url}`);
        }
      }
      return { ...board, treatment };
    }),
  );

  // New boards go after the last existing one, ahead of the testimonials
  // and booking sections that close the page.
  const lastGallery = [...base.sections].reverse().find((s) => s._type === "gallerySection");
  if (!lastGallery) throw new Error("No gallerySection to insert after.");

  for (const p of plan) {
    console.log(
      `  ${p.title.padEnd(10)} #${p.anchor.padEnd(10)} -> ${p.treatment.name}  ` +
        `(${p.reuse.length} reused + ${p.upload.length} uploaded)`,
    );
  }
  console.log(`  inserted after #${lastGallery.anchor ?? lastGallery._key}`);

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write the draft.");
    return;
  }

  const sections = [];
  for (const p of plan) {
    const refs = [...p.reuse];
    for (const [i, url] of p.upload.entries()) {
      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());
      const asset = await client.assets.upload("image", buffer, {
        filename: `${p.anchor}-${String(p.reuse.length + i + 1).padStart(2, "0")}.jpg`,
      });
      refs.push(asset._id);
    }
    const images: ImageItem[] = refs.map((ref, i) => ({
      _key: `${p.anchor}-${String(i + 1).padStart(3, "0")}`,
      _type: "imageWithAlt",
      asset: { _type: "reference", _ref: ref },
      alt: `${p.title} before and after result`,
    }));
    sections.push({
      _key: `results-${p.anchor}`,
      _type: "gallerySection",
      anchor: p.anchor,
      eyebrow: p.eyebrow,
      title: p.title,
      description: "Published treatment outcomes shared with patient consent.",
      tone: "paper",
      isHidden: false,
      treatment: { _type: "reference", _ref: p.treatment._id },
      images,
    });
    console.log(`  ${p.title}: ${images.length} images ready.`);
  }

  if (!existingDraft) {
    const { _rev, _createdAt, _updatedAt, ...clonable } = published as PageDoc & {
      _rev?: string;
      _createdAt?: string;
      _updatedAt?: string;
    };
    void _rev;
    void _createdAt;
    void _updatedAt;
    await client.createIfNotExists({ ...clonable, _id: DRAFT_ID });
    console.log(`\nCreated ${DRAFT_ID} from the published document.`);
  } else {
    console.log(`\nPatching the existing ${DRAFT_ID}.`);
  }

  await client
    .patch(DRAFT_ID)
    .insert("after", `sections[_key=="${lastGallery._key}"]`, sections)
    .commit();

  console.log(`\nDone. Review ${DRAFT_ID} in the Studio and publish.`);
}

main().catch((error) => {
  console.error(`\n  ${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
