/**
 * Sync the /before-after galleries from src/data/results.ts into Sanity.
 *
 * ── WHY THIS EXISTS SEPARATELY FROM migrate.ts ────────────────────────
 * `migrateInnerPages` skips any page that is no longer the generated
 * placeholder, with or without `--replace`, so an editor's arrangement is
 * never destroyed. /before-after was arranged in the Studio on 2026-08-28,
 * which means every result photo the clinic has published since then — 95
 * of them, plus three whole new groups — could not reach the CMS at all.
 * The page kept rendering 56 photos while the repository carried 151.
 *
 * A full page regeneration would fix the count and throw away the
 * arrangement. This does the narrow thing instead:
 *
 *   - existing gallery sections are matched by `anchor` and ONLY their
 *     `images` array is replaced. Heading, eyebrow, description, tone,
 *     position and _key are left exactly as the editor set them.
 *   - groups with no gallery yet are appended directly after the last
 *     gallery, in results.ts order, so they land inside the run of
 *     galleries rather than after the testimonials and booking blocks.
 *   - galleries whose anchor matches no group are left alone. They are not
 *     assumed to be stale; deleting an editor's section is not this
 *     script's business.
 *
 * Every other section on the page is passed through untouched.
 *
 * Re-runnable: image assets are deduplicated by the same `hla-public:<path>`
 * source id migrate.ts uses, so a second run uploads nothing new.
 *
 * Usage:
 *   npx sanity exec scripts/sanity/sync-results.ts --with-user-token
 *   npx sanity exec scripts/sanity/sync-results.ts --with-user-token -- --dry-run
 */
import { createReadStream, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";
import { resultGroups } from "../../src/data/results";

const dryRun = process.argv.includes("--dry-run");
const client = getCliClient({ apiVersion: "2025-02-19" });

const PAGE_ID = "page.before-after";

type SanityImage = {
  _type: "image";
  _key?: string;
  asset: { _type: "reference"; _ref: string };
  alt?: string;
};

type Section = {
  _type?: string;
  _key?: string;
  anchor?: string;
  images?: SanityImage[];
  [key: string]: unknown;
};

function imageKey(slug: string, index: number): string {
  const safe = slug.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
  return `${safe}-${String(index + 1).padStart(3, "0")}`;
}

/** Same asset identity as migrate.ts, so the two scripts share uploads. */
async function migratedImage(path: string, alt: string): Promise<SanityImage | undefined> {
  const sourceId = `hla-public:${path}`;
  let assetId = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && source.id == $sourceId][0]._id`,
    { sourceId },
  );

  if (!assetId) {
    const filePath = join(process.cwd(), "public", path.replace(/^\/+/, ""));
    if (!existsSync(filePath)) {
      console.warn(`  ! file not found, skipped: ${path}`);
      return undefined;
    }
    if (dryRun) return { _type: "image", asset: { _type: "reference", _ref: "DRY-RUN" }, alt };
    const asset = await client.assets.upload("image", createReadStream(filePath), {
      filename: basename(filePath),
      source: {
        id: sourceId,
        name: "Website migration",
        url: `https://healthylook-aesthetic.com${path}`,
      },
    });
    assetId = asset._id;
    console.log(`  + uploaded ${path}`);
  }

  return { _type: "image", asset: { _type: "reference", _ref: assetId }, alt };
}

async function imagesFor(group: (typeof resultGroups)[number]): Promise<SanityImage[]> {
  const images: SanityImage[] = [];
  for (const [index, path] of group.images.entries()) {
    const image = await migratedImage(path, `${group.label} before and after result`);
    if (image) images.push({ ...image, _key: imageKey(group.slug, index) });
  }
  return images;
}

async function main() {
  console.log(dryRun ? "Mode: dry run (no writes)" : "Mode: writing to Sanity");

  const page = await client.fetch<{ _id: string; sections?: Section[] } | null>(
    `*[_id == $id][0]{_id, sections}`,
    { id: PAGE_ID },
  );
  if (!page) throw new Error(`${PAGE_ID} not found. Run the migration first.`);

  const sections: Section[] = page.sections ? [...page.sections] : [];
  const byAnchor = new Map(
    sections
      .map((section, index) => [section, index] as const)
      .filter(([section]) => section._type === "gallerySection" && section.anchor)
      .map(([section, index]) => [String(section.anchor), index]),
  );

  const appended: Section[] = [];

  for (const [groupIndex, group] of resultGroups.entries()) {
    const at = byAnchor.get(group.slug);
    const images = await imagesFor(group);
    if (images.length < 2) {
      console.warn(`  ! ${group.slug}: ${images.length} usable image(s), skipped`);
      continue;
    }

    if (at !== undefined) {
      const before = sections[at].images?.length ?? 0;
      sections[at] = { ...sections[at], images };
      console.log(`~ ${group.slug}: ${before} → ${images.length} images`);
    } else {
      appended.push({
        _type: "gallerySection",
        _key: `results-${group.slug.replace(/[^a-z0-9_-]+/gi, "-")}`,
        anchor: group.slug,
        eyebrow: String(groupIndex + 1).padStart(2, "0"),
        title: group.label,
        description: "Published treatment outcomes shared with patient consent.",
        images,
        tone: groupIndex % 2 ? "wash" : "paper",
      });
      console.log(`+ ${group.slug}: new gallery, ${images.length} images`);
    }
  }

  if (appended.length) {
    // Directly after the last existing gallery, so new groups join the run of
    // galleries instead of landing below testimonials and booking.
    let lastGallery = -1;
    sections.forEach((section, index) => {
      if (section._type === "gallerySection") lastGallery = index;
    });
    sections.splice(lastGallery + 1, 0, ...appended);
  }

  const untouched = sections.filter(
    (section) => section._type !== "gallerySection",
  ).length;
  console.log(`\nSections: ${sections.length} total, ${untouched} non-gallery passed through`);

  if (dryRun) {
    console.log("Dry run — nothing written.");
    return;
  }

  await client.patch(PAGE_ID).set({ sections }).commit();
  console.log("Patched", PAGE_ID);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
