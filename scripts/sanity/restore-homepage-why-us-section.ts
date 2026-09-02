/**
 * The homepage's "why us" section was migrated from the original bespoke
 * `curatedSection` (component: "whyUs" — numbered highlights, the clinic's
 * safety statement, licence badge, devices photo, and a link to all seven
 * safety protocols) into a generic featureGridSection, which dropped all of
 * that in favour of a plain 3-column grid. WhyUs.tsx still exists in the
 * codebase and is still a registered curatedSection component — it was
 * just switched away from, not deleted. Its content comes from
 * getSiteCopy(), which falls back to the original hardcoded copy in
 * src/data/clinic.ts when Sanity's siteSettings document doesn't have a
 * value, so swapping back is safe even without checking that document.
 *
 * Run via: npx sanity exec scripts/sanity/restore-homepage-why-us-section.ts
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

type Section = { _key: string; _type: string; [key: string]: unknown };
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

  const sections = [...(existingDraft ?? published).sections];
  const index = sections.findIndex((s) => s._key === SECTION_KEY);
  if (index === -1) {
    console.log(`No section with _key "${SECTION_KEY}" found — nothing to do.`);
    return;
  }
  if (sections[index]._type === "curatedSection") {
    console.log(`"${SECTION_KEY}" is already a curatedSection — nothing to do.`);
    return;
  }

  sections[index] = {
    _key: SECTION_KEY,
    _type: "curatedSection",
    component: "whyUs",
  };

  await client.patch(draftId).set({ sections }).commit();
  console.log(
    `Replaced "${SECTION_KEY}" (was ${(existingDraft ?? published).sections[index]._type}) with curatedSection/whyUs in ${draftId}.\n` +
      `This is a DRAFT only — nothing on the live site changes until it's reviewed and published in Studio.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
