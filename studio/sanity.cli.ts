import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "s9tltfth",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME || "kornu",
  deployment: { appId: "d45c6o6m8uc0it10sq5vg6kw" },
});
