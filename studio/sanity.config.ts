import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { svSELocale } from "@sanity/locale-sv-se";
import { schemaTypes, SINGLETON_IDS } from "./schemaTypes";
import { structure } from "./structure";

const singletonTypes = new Set(SINGLETON_IDS);

export default defineConfig({
  name: "kornu",
  title: "Kör Nu Trafikskola",
  // Served by the website at https://new.kornu.se/studio (built into dist/studio on deploy).
  basePath: "/studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "s9tltfth",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool({ structure }), visionTool(), svSELocale({ title: "Svenska" })],
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+" menu; they are opened from the sidebar.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Singletons can be edited and published but not duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType) ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action)) : actions,
  },
});
