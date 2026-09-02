/**
 * Publishes the current /before-after draft: the published document is
 * replaced with the draft's content, and the draft is removed — the same
 * effect as clicking "Publish" in Studio. Used here instead of Studio
 * because the draft has been silently wiped by a stale Studio session
 * publishing over it three times this session before anyone could review
 * it; publishing straight from here, right after building the draft,
 * closes that window.
 *
 * Run via: npx sanity exec scripts/sanity/publish-before-after.ts
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

type PageDoc = { _id: string; _type: "page"; [key: string]: unknown };

async function main() {
  const candidates = await client.fetch<PageDoc[]>(
    `*[_type == "page" && path == $path]`,
    { path: PAGE_PATH },
  );
  const published = candidates.find((c) => !c._id.startsWith("drafts."));
  const draft = candidates.find((c) => c._id.startsWith("drafts."));
  if (!draft) throw new Error(`No draft found for ${PAGE_PATH} — nothing to publish.`);
  if (!published) throw new Error(`No published document found for ${PAGE_PATH}.`);

  const { _id, _rev, _createdAt, _updatedAt, ...rest } = draft as PageDoc & {
    _rev?: string;
    _createdAt?: string;
    _updatedAt?: string;
  };
  void _id;
  void _rev;
  void _createdAt;
  void _updatedAt;

  await client
    .transaction()
    .createOrReplace({ ...rest, _id: published._id })
    .delete(draft._id)
    .commit();

  console.log(`Published ${published._id} from ${draft._id}, and removed the draft.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
