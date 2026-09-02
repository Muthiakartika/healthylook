/**
 * Consolidated, idempotent restore of everything /before-after lost in the
 * Sanity migration: the tagline, the disclaimer, and the results jump nav.
 * Replaces add-tagline.ts and add-results-nav-and-disclaimer.ts, which run
 * as separate `sanity exec` processes — two back-to-back writes hit a real
 * eventual-consistency window in Sanity's query API (a just-committed
 * mutation isn't always visible to the very next fetch yet), so the second
 * script's "does a draft already exist" check could see a stale answer and
 * clone a *fresh* draft from published, silently discarding the first
 * script's change. Doing all three in one fetch-then-commit avoids that
 * entirely — there's only one read of "what's already there" and one write.
 *
 * Run via: npx sanity exec scripts/sanity/restore-before-after-sections.ts
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

const PAGE_PATH = "/before-after";

type Section = { _key: string; _type: string; [key: string]: unknown };
type PageDoc = { _id: string; _type: "page"; sections: Section[]; [key: string]: unknown };

async function main() {
  const candidates = await client.fetch<PageDoc[]>(
    `*[_type == "page" && path == $path]`,
    { path: PAGE_PATH },
  );
  const published = candidates.find((c) => !c._id.startsWith("drafts."));
  const existingDraft = candidates.find((c) => c._id.startsWith("drafts."));
  if (!published) throw new Error(`No published ${PAGE_PATH} document found.`);

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
  const added: string[] = [];

  if (!sections.some((s) => s._type === "taglineSection")) {
    const heroIndex = sections.findIndex((s) => s._type === "heroSection");
    sections.splice(heroIndex === -1 ? 0 : heroIndex + 1, 0, {
      _key: `tagline-${Date.now()}`,
      _type: "taglineSection",
      text: "Real patients, real results. No filter, no edit.",
    });
    added.push("tagline");
  }

  if (!sections.some((s) => s._type === "disclaimerSection")) {
    const taglineIndex = sections.findIndex((s) => s._type === "taglineSection");
    const heroIndex = sections.findIndex((s) => s._type === "heroSection");
    const insertAt = taglineIndex !== -1 ? taglineIndex + 1 : heroIndex !== -1 ? heroIndex + 1 : 0;
    sections.splice(insertAt, 0, {
      _key: `disclaimer-${Date.now()}`,
      _type: "disclaimerSection",
      lead: "Individual results vary.",
      text:
        "Every photograph shows one patient’s outcome. What is achievable for you depends on your anatomy, and a doctor will tell you honestly at consultation.",
    });
    added.push("disclaimer");
  }

  if (!sections.some((s) => s._type === "resultsNavSection")) {
    const disclaimerIndex = sections.findIndex((s) => s._type === "disclaimerSection");
    const taglineIndex = sections.findIndex((s) => s._type === "taglineSection");
    const heroIndex = sections.findIndex((s) => s._type === "heroSection");
    const insertAt =
      disclaimerIndex !== -1
        ? disclaimerIndex + 1
        : taglineIndex !== -1
          ? taglineIndex + 1
          : heroIndex !== -1
            ? heroIndex + 1
            : 0;
    sections.splice(insertAt, 0, {
      _key: `results-nav-${Date.now()}`,
      _type: "resultsNavSection",
      label: "Results jump nav",
    });
    added.push("results nav");
  }

  if (added.length === 0) {
    console.log("All three sections are already present — nothing to do.");
    return;
  }

  await client.patch(draftId).set({ sections }).commit();
  console.log(
    `Updated ${draftId}: added ${added.join(", ")}.\n` +
      `This is a DRAFT only — nothing on the live site changes until it's reviewed and published in Studio.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
