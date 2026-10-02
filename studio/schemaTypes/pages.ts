import { defineArrayMember, defineField, defineType } from "sanity";
import { HOME_SECTIONS, ICON_OPTIONS, img, link, ls, lt, pageHeader } from "./helpers";
import { DEFAULT_INFO_PAGES } from "../../src/content/defaults";

const single = (name: string, title: string, fields: ReturnType<typeof defineField>[], description?: string) =>
  defineType({ name, title, type: "document", description, fields, preview: { prepare: () => ({ title }) } });

// ---- Home page --------------------------------------------------------------

export const homePage = single("homePage", "Startsidessektioner", [
  defineField({
    name: "sections",
    title: "Sektioner på startsidan",
    description: "Dra för att ändra ordning. Ta bort en sektion för att dölja den eller lägg till den igen.",
    type: "array",
    of: [defineArrayMember({ type: "string", options: { list: HOME_SECTIONS } })],
  }),
]);

export const heroSection = single("heroSection", "Toppsektion", [
  ls("badge", "Etikett"),
  ls("titleA", "Rubrik, vit del"),
  ls("titleB", "Rubrik, grön del"),
  lt("text", "Text"),
  ls("bookLabel", "Text på gröna knappen"),
  link("bookLink", "Länk för bokning"),
  ls("packagesLabel", "Text på den andra knappen"),
  link("packagesLink", "Den andra knappens länk"),
  img("image", "Bakgrundsbild"),
  ls("imageAlt", "Bildbeskrivning för hjälpmedel"),
  defineField({
    name: "stats",
    title: "Siffror under knapparna",
    type: "array",
    of: [defineArrayMember({ type: "object", fields: [ls("value", "Värde", "Till exempel 100+"), ls("label", "Beskrivning")], preview: { select: { title: "value.sv", subtitle: "label.sv" } } })],
  }),
]);

export const benefitsSection = single("benefitsSection", "Fördelar", [
  defineField({
    name: "items",
    title: "Fördelar",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      fields: [ls("title", "Rubrik"), lt("text", "Text"), defineField({ name: "icon", title: "Ikon", type: "string", options: { list: ICON_OPTIONS } })],
      preview: { select: { title: "title.sv", subtitle: "icon" } },
    })],
  }),
]);

export const journeySection = single("journeySection", "Vägen till körkortet", [
  ls("tag", "Liten etikett"),
  ls("title", "Rubrik"),
  lt("text", "Text"),
  defineField({
    name: "steps",
    title: "Steg",
    description: "Vägen på dator har plats för högst sex steg.",
    type: "array",
    validation: (rule) => rule.max(6),
    of: [defineArrayMember({ type: "object", fields: [ls("label", "Steg"), lt("detail", "Beskrivning")], preview: { select: { title: "label.sv", subtitle: "detail.sv" } } })],
  }),
  img("carImage", "Bilbild (används även i simulatorsektionen)"),
]);

// ---- Pages ------------------------------------------------------------------

export const coursesPage = single("coursesPage", "Kurser", [
  pageHeader,
  ls("linkLabel", "Länktext intill rubriken", "Lämna tomt för att dölja."),
  link("link", "Länk intill rubriken"),
  defineField({ name: "defaultBookingUrl", title: "Standardlänk för kursbokning", type: "url", description: "Används för kurser som saknar egen länk." }),
  defineField({
    name: "courses",
    title: "Kurskort",
    description: "Dra för att ändra ordning.",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      name: "courseCard",
      fields: [
        ls("title", "Rubrik"),
        lt("text", "Text"),
        ls("price", "Pristtext", "Till exempel Från 495 kr per lektion"),
        img("image", "Bild"),
        defineField({ name: "url", title: "Kortets länk", type: "url", description: "Lämna tomt för att använda standardlänken för kursbokning." }),
      ],
      preview: { select: { title: "title.sv", subtitle: "price.sv", media: "image" } },
    })],
  }),
]);

export const galleryPage = single("galleryPage", "Galleri", [
  pageHeader,
  ls("photosLabel", "Text efter antalet bilder", "Till exempel bilder i 11 bilder."),
  ls("linkLabel", "Länktext för att visa alla bilder"),
  link("link", "Länk för att visa alla bilder"),
  defineField({
    name: "photos",
    title: "Bilder",
    description: "Dra för att ändra ordning. Förhandsvisningen på startsidan visar de första åtta.",
    type: "array",
    options: { layout: "grid" },
    of: [defineArrayMember({
      type: "object",
      name: "galleryPhoto",
      fields: [defineField({ ...img("image", "Foto"), validation: (rule) => rule.required() }), ls("title", "Bildtext", "Visas i bildvisaren och används som bildbeskrivning."), ls("tag", "Etikett", "Kort text på bilden, till exempel Godkänd elev.")],
      preview: { select: { title: "title.sv", subtitle: "tag.sv", media: "image" } },
    })],
  }),
]);

export const packagesPage = single("packagesPage", "Paket och priser", [
  pageHeader,
  ls("tag", "Liten etikett"),
  ls("title", "Rubrik"),
  lt("text", "Text"),
  ls("popular", "Etikett för populärt paket"),
  ls("price", "Text om pris inklusive moms"),
  ls("buy", "Köpknapp"),
  ls("readMore", "Knapp för att läsa mer"),
  ls("moreBenefits", "Text för fler fördelar"),
  ls("help", "Text för hjälp"),
  ls("call", "Text intill telefonnummer"),
], "Själva paketen och priserna hanteras i Stripe. Här redigerar du endast texterna runt dem.");

export const simulatorPage = single("simulatorPage", "Simulator", [
  pageHeader,
  ls("tag", "Liten etikett"),
  ls("title", "Rubrik"),
  lt("text", "Text"),
  ls("start", "Text på startknappen", "Knappen öppnar körsimulatorn."),
  defineField({ name: "chips", title: "Funktionsetiketter", type: "array", of: [defineArrayMember({ type: "localeString" })], description: "Emoji går bra, till exempel 🏙️ Stadskörning." }),
  img("image", "Bild"),
  ls("imageAlt", "Bildbeskrivning för hjälpmedel"),
]);

export const aboutPage = single("aboutPage", "Om oss", [
  ls("eyebrow", "Liten etikett"),
  ls("title", "Rubrik"),
  defineField({ name: "paragraphs", title: "Textstycken", type: "array", of: [defineArrayMember({ type: "localeText" })] }),
  ls("findUs", "Text på knappen"),
  link("mapsUrl", "Knappens länk"),
  img("image", "Bild"),
  ls("imageAlt", "Bildbeskrivning för hjälpmedel"),
]);

export const contactPage = single("contactPage", "Kontaktsida och etiketter", [
  pageHeader, ls("phoneLabel", "Telefonetikett"), ls("emailLabel", "E-postetikett"), ls("orgLabel", "Organisationsnummeretikett"),
], "Telefon, e-post, adress och öppettider finns under Alla sidor → Webbplatsinställningar.");

export const paymentPages = single("paymentPages", "Betalningssidor", [
  ls("checkout", "Liten etikett"),
  ls("successPending", "Rubrik vid lyckad betalning"),
  lt("successPendingText", "Text vid lyckad betalning"),
  ls("cancelled", "Rubrik vid avbruten betalning"),
  lt("cancelledText", "Text vid avbruten betalning"),
]);

export const infoPageSchemas = DEFAULT_INFO_PAGES.map((page) =>
  single(page.id, page.title, [
    ls("title", "Sidrubrik"),
    defineField({
      name: "paragraphs",
      title: "Textstycken",
      description: `Innehållet visas på ${page.path}. Lägg till ett textstycke per rad.`,
      type: "array",
      of: [defineArrayMember({ type: "localeText" })],
    }),
  ], `Redigera innehållet på ${page.path}.`),
);
