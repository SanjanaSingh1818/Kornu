import { defineField, defineType } from "sanity";

export const LANGUAGES = [
  { id: "sv", title: "Svenska" },
  { id: "en", title: "English" },
  { id: "ar", title: "العربية" },
];

// Varje textfält finns på flera språk. Om ett språk lämnas tomt visas svenska på webbplatsen.
export const localeString = defineType({
  name: "localeString",
  title: "Kort text",
  type: "object",
  fields: LANGUAGES.map((lang) => defineField({ name: lang.id, title: lang.title, type: "string" })),
  preview: { select: { title: "sv", subtitle: "en" } },
});

export const localeText = defineType({
  name: "localeText",
  title: "Lång text",
  type: "object",
  fields: LANGUAGES.map((lang) => defineField({ name: lang.id, title: lang.title, type: "text", rows: 3 })),
  preview: { select: { title: "sv", subtitle: "en" } },
});

export const ls = (name: string, title: string, description?: string) => defineField({ name, title, type: "localeString", description });
export const lt = (name: string, title: string, description?: string) => defineField({ name, title, type: "localeText", description });
export const img = (name: string, title: string, description?: string) => defineField({ name, title, type: "image", options: { hotspot: true }, description });
// Länkar kan gå till sidor, avsnitt, externa webbplatser eller kontaktuppgifter.
export const link = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    description: "Ange en sida (/packages, /contact, /courses, /gallery, /about, /simulator, /vanliga-fragor, /integritetspolicy), ett avsnitt (#paket), en webbadress (https://…) eller tel:/mailto:.",
    validation: (rule) =>
      rule.custom((value?: string) =>
        !value || /^(\/|#|https?:\/\/|tel:|mailto:)/.test(value) ? true : "Börja med /, #, https://, tel: eller mailto:",
      ),
  });

export const PAGE_OPTIONS = [
  { title: "Startsida", value: "/" },
  { title: "Kurser", value: "/courses" },
  { title: "Paket", value: "/packages" },
  { title: "Simulator", value: "/simulator" },
  { title: "Galleri", value: "/gallery" },
  { title: "Om oss", value: "/about" },
  { title: "Kontakt", value: "/contact" },
  { title: "Vanliga frågor", value: "/vanliga-fragor" },
  { title: "Villkor och information", value: "/villkor-och-info" },
  { title: "Integritetspolicy", value: "/integritetspolicy" },
  { title: "Kontaktinformation", value: "/kontaktinformation" },
  { title: "Användarvillkor", value: "/anvandarvillkor" },
  { title: "Fraktpolicy", value: "/fraktpolicy" },
  { title: "Rättsligt meddelande", value: "/rattsligt-meddelande" },
  { title: "Återbetalningspolicy", value: "/aterbetalningspolicy" },
];

export const pagePath = (name = "path", title = "Links to page") =>
  defineField({ name, title, type: "string", options: { list: PAGE_OPTIONS }, validation: (rule) => rule.required() });

export const pageHeader = defineField({
  name: "header",
  title: "Sidhuvud (mörkt fält högst upp)",
  type: "object",
  fields: [ls("eyebrow", "Liten etikett ovanför rubriken"), ls("title", "Rubrik"), lt("text", "Inledning")],
});

export const ICON_OPTIONS = [
  ["calendar", "Kalender"], ["car", "Bil"], ["person", "Person"], ["pin", "Plats"], ["phone", "Telefon"],
  ["mail", "E-post"], ["check", "Bock"], ["lock", "Lås"], ["star", "Stjärna"],
].map(([value, title]) => ({ title, value }));

export const HOME_SECTIONS = [
  { title: "Toppsektion", value: "hero" },
  { title: "Fördelar", value: "benefits" },
  { title: "Vägen till körkortet", value: "journey" },
  { title: "Kurser", value: "courses" },
  { title: "Paket och priser (från Stripe)", value: "packages" },
  { title: "Teorifrågor", value: "quiz" },
  { title: "Simulator", value: "simulator" },
  { title: "Bromssträcka", value: "braking" },
  { title: "Recensioner", value: "reviews" },
  { title: "Trafiklärare", value: "trainers" },
  { title: "Galleri", value: "gallery" },
  { title: "Avslutande uppmaning", value: "finalCta" },
  { title: "Hitta hit och karta", value: "visit" },
];
