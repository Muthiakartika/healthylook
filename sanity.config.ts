"use client";

import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import {
  resolvedSanityProjectId,
  sanityDataset,
  sanityPreviewOrigin,
} from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { newDocumentOptions, structure } from "./src/sanity/structure";
import { presentationLocations } from "./src/sanity/presentation/locations";

export default defineConfig({
  name: "default",
  title: "Healthy Look Aesthetic",
  projectId: resolvedSanityProjectId,
  dataset: sanityDataset,
  basePath: "/studio",
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (previous) => newDocumentOptions(previous),
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: sanityPreviewOrigin,
        previewMode: { enable: "/api/draft-mode/enable" },
      },
      resolve: { locations: presentationLocations },
    }),
    visionTool(),
  ],
});
