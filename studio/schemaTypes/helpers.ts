import { defineField, defineType } from "sanity";

export const LANGUAGES = [
  { id: "sv", title: "Svenska" },
  { id: "en", title: "English" },
  { id: "ar", title: "العربية" },
];

// Every visible text has one field per language. Empty languages fall back to Swedish on the site.
export const localeString = defineType({
  name: "localeString",
  title: "Text",
  type: "object",
  fields: LANGUAGES.map((lang) => defineField({ name: lang.id, title: lang.title, type: "string" })),
  preview: { select: { title: "sv", subtitle: "en" } },
});

export const localeText = defineType({
  name: "localeText",
  title: "Long text",
  type: "object",
  fields: LANGUAGES.map((lang) => defineField({ name: lang.id, title: lang.title, type: "text", rows: 3 })),
  preview: { select: { title: "sv", subtitle: "en" } },
});

export const ls = (name: string, title: string, description?: string) => defineField({ name, title, type: "localeString", description });
export const lt = (name: string, title: string, description?: string) => defineField({ name, title, type: "localeText", description });
export const img = (name: string, title: string, description?: string) => defineField({ name, title, type: "image", options: { hotspot: true }, description });
// Where a button goes. Plain string so editors can use site pages, anchors and external links alike.
export const link = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    description: "A page (/packages, /contact, /courses, /gallery, /about, /simulator, /), a section on the same page (#paket), a full web address (https://…), or tel:/mailto:.",
    validation: (rule) =>
      rule.custom((value?: string) =>
        !value || /^(\/|#|https?:\/\/|tel:|mailto:)/.test(value) ? true : "Start with /, #, https://, tel: or mailto:",
      ),
  });

export const PAGE_OPTIONS = [
  { title: "Home", value: "/" },
  { title: "Courses", value: "/courses" },
  { title: "Packages", value: "/packages" },
  { title: "Simulator", value: "/simulator" },
  { title: "Gallery", value: "/gallery" },
  { title: "About", value: "/about" },
  { title: "Contact", value: "/contact" },
];

export const pagePath = (name = "path", title = "Links to page") =>
  defineField({ name, title, type: "string", options: { list: PAGE_OPTIONS }, validation: (rule) => rule.required() });

export const pageHeader = defineField({
  name: "header",
  title: "Page header (dark banner at the top)",
  type: "object",
  fields: [ls("eyebrow", "Small label above title"), ls("title", "Title"), lt("text", "Intro text")],
});

export const ICON_OPTIONS = ["calendar", "car", "person", "pin", "phone", "mail", "check", "lock", "star"].map((value) => ({ title: value, value }));

export const HOME_SECTIONS = [
  { title: "Hero (big image at the top)", value: "hero" },
  { title: "Benefits bar", value: "benefits" },
  { title: "Journey (road to licence)", value: "journey" },
  { title: "Courses", value: "courses" },
  { title: "Packages & prices (from Stripe)", value: "packages" },
  { title: "Theory quiz", value: "quiz" },
  { title: "Simulator", value: "simulator" },
  { title: "Braking distance visualizer", value: "braking" },
  { title: "Reviews", value: "reviews" },
  { title: "Trainers", value: "trainers" },
  { title: "Gallery preview", value: "gallery" },
  { title: "Final call to action", value: "finalCta" },
  { title: "Visit us (map)", value: "visit" },
];
