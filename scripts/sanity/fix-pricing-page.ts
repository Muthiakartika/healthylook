/**
 * One-off content fix for the /pricing page, run once via:
 *   npx sanity exec scripts/sanity/fix-pricing-page.ts
 *
 * Does three things to the live /pricing page document's `sections` array:
 *  1. Replaces the old `richTextSection` "Our Pricing Promise" band with a
 *     `pricingPromiseSection` carrying the client's own original copy
 *     (restored verbatim from src/data/pricing.ts's PRICING_PROMISE,
 *     orphaned since the Sanity migration dropped the hardcoded page).
 *  2. Inserts a `categoryNavSection` (the sticky treatment-category jump
 *     nav) right before the pricing table's `collectionSection`.
 *  3. Fixes that collectionSection's title/description, which currently
 *     hold an internal migration note ("Edit each treatment's price
 *     groups from the Treatments collection") rather than public copy.
 *
 * Written directly against @sanity/client with the write token from
 * .env.local, rather than `getCliClient`/`--with-user-token` like
 * migrate.ts — this only needs to run once, from whichever machine has
 * the token, without requiring a `sanity login` session on it.
 *
 * ── WHY THIS ONLY EVER TOUCHES A DRAFT ─────────────────────────────────
 * The live site reads the *published* perspective — a draft is invisible
 * to it. So this never patches the published document directly, even
 * when no draft exists yet: it clones published into a new draft first
 * (or reuses one already sitting in Studio, untouched, if that's what's
 * there), then edits only that. Nothing changes on the live site until a
 * person opens Studio, reviews the result, and clicks Publish — which
 * matters here specifically because the new section types this content
 * references (pricingPromiseSection, categoryNavSection) only render
 * correctly once the matching code is deployed; publishing before that
 * deploy would make the two sections vanish rather than update.
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
  // Both the published id and a possible drafts.<id> share the same path.
  const candidates = await client.fetch<PageDoc[]>(`*[_type == "page" && path == "/pricing"]`);
  if (candidates.length === 0) throw new Error("No /pricing page document found.");

  const published = candidates.find((c) => !c._id.startsWith("drafts."));
  const existingDraft = candidates.find((c) => c._id.startsWith("drafts."));
  if (!published) throw new Error("No published /pricing document found to base a draft on.");

  const draftId = `drafts.${published._id}`;
  if (!existingDraft) {
    // _rev/_createdAt/_updatedAt are server-managed — stripped before the
    // clone so the create call can't be rejected over stale metadata.
    const { _rev, _createdAt, _updatedAt, ...clonable } = published as PageDoc & {
      _rev?: string;
      _createdAt?: string;
      _updatedAt?: string;
    };
    void _rev;
    void _createdAt;
    void _updatedAt;
    // Creates the draft only if one doesn't already exist — never
    // overwrites an editor's in-progress Studio changes.
    await client.createIfNotExists({ ...clonable, _id: draftId });
    console.log(`Created ${draftId} from the published document.`);
  } else {
    console.log(`A draft already exists at ${draftId} — editing it as-is.`);
  }

  const base = existingDraft ?? published;
  const sections = [...base.sections];

  const promiseIndex = sections.findIndex(
    (s) => s._type === "richTextSection" && s.eyebrow === "Our pricing promise",
  );
  if (promiseIndex === -1) {
    throw new Error('Could not find the existing "Our pricing promise" richTextSection.');
  }

  sections[promiseIndex] = {
    _key: sections[promiseIndex]._key,
    _type: "pricingPromiseSection",
    eyebrow: "Our pricing promise",
    title: "We believe in transparency",
    description:
      "So you can plan your journey to confidence, and know the full cost before anything begins.",
    points: [
      {
        _key: "nett",
        _type: "pricingPromisePoint",
        label: "Nett prices",
        detail: "The figure you see is the figure you pay.",
      },
      {
        _key: "tax",
        _type: "pricingPromisePoint",
        label: "Tax included",
        detail: "Already inside every price on this page.",
      },
      {
        _key: "fee",
        _type: "pricingPromisePoint",
        label: "No service fee",
        detail: "We don't add one, ever.",
      },
    ],
  };

  const directoryIndex = sections.findIndex(
    (s) => s._type === "collectionSection" && s.source === "pricingDirectory",
  );
  if (directoryIndex === -1) {
    throw new Error("Could not find the pricingDirectory collectionSection.");
  }

  sections[directoryIndex] = {
    ...sections[directoryIndex],
    title: "Complete price list",
    description: "Every treatment's full price breakdown, grouped by category.",
  };

  sections.splice(directoryIndex, 0, {
    _key: `category-nav-${Date.now()}`,
    _type: "categoryNavSection",
  });

  await client.patch(draftId).set({ sections }).commit();
  console.log(
    `Updated ${draftId}: replaced the pricing-promise band, added the category nav, and fixed the price-list heading text.\n` +
      `This is a DRAFT only — nothing on the live site changes until it's reviewed and published in Studio.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
