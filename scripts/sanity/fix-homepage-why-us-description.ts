/**
 * The homepage's "Not all aesthetic providers are equal" featureGridSection
 * carries a leftover migration note in its `description` field —
 * "Every point below can be edited independently." — the same
 * placeholder-text-leaked-into-a-public-field bug already found on the
 * pricing page's collectionSection. The sibling featureGridSection on this
 * same page (International Patients) has no description at all, which is
 * the correct pattern here: SectionHeading's description paragraph is
 * optional, and this section never had real "why us" summary copy to put
 * there. Unsetting it — not inventing replacement copy — restores the
 * intended state.
 *
 * Run via: npx sanity exec scripts/sanity/fix-homepage-why-us-description.ts
 *
 * Draft-only, same reasoning as every other script in this folder.
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

const PAGE_PATH = "/";
const SECTION_KEY = "home-why-us";
const PLACEHOLDER_TEXT = "Every point below can be edited independently.";

type Section = { _key: string; _type: string; description?: string; [key: string]: unknown };
type PageDoc = { _id: string; _type: "page"; sections: Section[]; [key: string]: unknown };

async function main() {
  const candidates = await client.fetch<PageDoc[]>(
    `*[_type == "page" && path == $path]`,
    { path: PAGE_PATH },
  );
  const published = candidates.find((c) => !c._id.startsWith("drafts."));
  const existingDraft = candidates.find((c) => c._id.startsWith("drafts."));
  if (!published) throw new Error(`No published page found at ${PAGE_PATH}.`);

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

  const sections = (existingDraft ?? published).sections;
  const target = sections.find((s) => s._key === SECTION_KEY);
  if (!target) {
    console.log(`No section with _key "${SECTION_KEY}" found — nothing to do.`);
    return;
  }
  if (target.description !== PLACEHOLDER_TEXT) {
    console.log(
      `Section "${SECTION_KEY}" description is not the expected placeholder (found: ${JSON.stringify(target.description)}) — leaving it untouched.`,
    );
    return;
  }

  const index = sections.indexOf(target);
  await client
    .patch(draftId)
    .unset([`sections[${index}].description`])
    .commit();
  console.log(
    `Removed the placeholder description from "${SECTION_KEY}" in ${draftId}.\n` +
      `This is a DRAFT only — nothing on the live site changes until it's reviewed and published in Studio.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
