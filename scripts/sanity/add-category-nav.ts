/**
 * Re-adds the categoryNavSection to /pricing after the first attempt
 * (an object type with no real fields, just inherited settings fields)
 * turned out to be unreliable in Studio's array editor and disappeared
 * from the sections array during an unrelated edit. The schema now gives
 * it a real `label` field with an initialValue — this script re-inserts
 * it using that corrected shape.
 *
 * Run via: npx sanity exec scripts/sanity/add-category-nav.ts
 *
 * Draft-only, same reasoning as fix-pricing-page.ts: clones published into
 * a draft (or reuses one already there) rather than touching published
 * directly, so nothing on the live site changes until it's published.
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
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
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
});

type Section = { _key: string; _type: string; [key: string]: unknown };
type PageDoc = { _id: string; _type: "page"; sections: Section[]; [key: string]: unknown };

async function main() {
  const candidates = await client.fetch<PageDoc[]>(`*[_type == "page" && path == "/pricing"]`);
  const published = candidates.find((c) => !c._id.startsWith("drafts."));
  const existingDraft = candidates.find((c) => c._id.startsWith("drafts."));
  if (!published) throw new Error("No published /pricing document found.");

  const draftId = `drafts.${published._id}`;
  if (!existingDraft) {
    const { _rev, _createdAt, _updatedAt, ...clonable } = published as PageDoc & {
      _rev?: string;
      _createdAt?: string;
      _updatedAt?: string;
    };
    void _rev;
    void _createdAt;
    void _updatedAt;
    await client.createIfNotExists({ ...clonable, _id: draftId });
    console.log(`Created ${draftId} from the published document.`);
  } else {
    console.log(`A draft already exists at ${draftId} — editing it as-is.`);
  }

  const base = existingDraft ?? published;
  const sections = [...base.sections];

  if (sections.some((s) => s._type === "categoryNavSection")) {
    console.log("A categoryNavSection is already present — nothing to do.");
    return;
  }

  const directoryIndex = sections.findIndex(
    (s) => s._type === "collectionSection" && s.source === "pricingDirectory",
  );
  if (directoryIndex === -1) {
    throw new Error("Could not find the pricingDirectory collectionSection.");
  }

  sections.splice(directoryIndex, 0, {
    _key: `category-nav-${Date.now()}`,
    _type: "categoryNavSection",
    label: "Treatment category jump nav",
  });

  await client.patch(draftId).set({ sections }).commit();
  console.log(
    `Updated ${draftId}: re-inserted the category nav (now with a real 'label' field).\n` +
      `This is a DRAFT only — nothing on the live site changes until it's reviewed and published in Studio.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
