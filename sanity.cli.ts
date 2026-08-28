import { defineCliConfig } from "sanity/cli";
import { resolvedSanityProjectId, sanityDataset } from "./src/sanity/env";

export default defineCliConfig({
  api: {
    projectId: resolvedSanityProjectId,
    dataset: sanityDataset,
  },
  studioHost: "healthy-look-aesthetic",
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "./src/sanity/schema.json",
    generates: "./src/sanity/types.generated.ts",
    overloadClientMethods: true,
  },
});
