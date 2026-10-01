import { createClient, type SanityClient } from "@sanity/client";

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const projectId = env.VITE_SANITY_PROJECT_ID;
const dataset = env.VITE_SANITY_DATASET || "production";

export const sanityEnabled = Boolean(projectId);

let client: SanityClient | null = null;
function getClient() {
  if (!projectId) return null;
  client ??= createClient({ projectId, dataset, apiVersion: "2025-01-01", useCdn: true, perspective: "published" });
  return client;
}

const img = (field: string) => `"${field}": ${field}.asset->url`;
const header = `header{eyebrow, title, text}`;

// One round trip for the whole site. Field names match studio/schemaTypes.
export const SITE_QUERY = `{
  "settings": *[_id == "siteSettings"][0]{..., ${img("logo")}, ${img("seoImage")}},
  "navigation": *[_id == "navigation"][0],
  "footer": *[_id == "footer"][0],
  "home": {
    "sections": *[_id == "homePage"][0].sections,
    "hero": *[_id == "heroSection"][0]{..., ${img("image")}},
    "benefits": *[_id == "benefitsSection"][0].items,
    "journey": *[_id == "journeySection"][0]{..., ${img("carImage")}}
  },
  "coursesPage": *[_id == "coursesPage"][0]{${header}, linkLabel, link, defaultBookingUrl},
  "courses": *[_id == "coursesPage"][0].courses[]{..., ${img("image")}},
  "galleryPage": *[_id == "galleryPage"][0]{${header}, linkLabel, link, photosLabel},
  "gallery": *[_id == "galleryPage"][0].photos[]{..., ${img("image")}},
  "simulatorPage": *[_id == "simulatorPage"][0]{..., ${img("image")}},
  "aboutPage": *[_id == "aboutPage"][0]{..., ${img("image")}},
  "contactPage": *[_id == "contactPage"][0],
  "packagesPage": *[_id == "packagesPage"][0],
  "quizSection": *[_id == "quizSection"][0],
  "quizQuestions": *[_id == "quizSection"][0].questions,
  "brakingSection": *[_id == "brakingSection"][0],
  "reviewsSection": *[_id == "reviewsSection"][0],
  "reviews": *[_id == "reviewsSection"][0].items,
  "visitSection": *[_id == "visitSection"][0],
  "finalCta": *[_id == "finalCta"][0],
  "trainersSection": *[_id == "trainersSection"][0],
  "trainers": *[_id == "trainersSection"][0].trainers[]{..., ${img("image")}, "hotspot": image.hotspot},
  "contactForm": *[_id == "contactForm"][0]{..., ${img("image")}},
  "paymentPages": *[_id == "paymentPages"][0]
}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CmsData = Record<string, any>;

const CACHE_KEY = "kornu-cms-v2"; // bump when SITE_QUERY changes shape

export function readCachedCms(): CmsData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CmsData) : null;
  } catch {
    return null;
  }
}

export async function fetchCms(): Promise<CmsData | null> {
  const sanity = getClient();
  if (!sanity) return null;
  const data = await sanity.fetch<CmsData>(SITE_QUERY);
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or blocked: the site still works without the cache.
  }
  return data;
}
