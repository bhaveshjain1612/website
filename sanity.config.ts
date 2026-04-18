import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { sanityDataset, sanityProjectId } from "./lib/sanity/env";

export default defineConfig({
  name: "default",
  title: "Bhavesh Jain Studio",
  projectId: sanityProjectId || "missing-project-id",
  dataset: sanityDataset || "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
});
