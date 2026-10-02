import { defineArrayMember, defineField, defineType } from "sanity";
import { img, link, ls, lt, pagePath } from "./helpers";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Webbplatsinställningar",
  type: "document",
  groups: [
    { name: "brand", title: "Varumärke och Google", default: true },
    { name: "contact", title: "Kontaktuppgifter" },
  ],
  fields: [
    defineField({ name: "siteName", title: "Trafikskolans namn", type: "string", group: "brand" }),
    defineField({ ...img("logo", "Logotyp", "Används även som webbplatsens ikon i webbläsaren."), group: "brand" }),
    defineField({ ...ls("seoTitle", "Webbläsar- och Google-rubrik"), group: "brand" }),
    defineField({ ...lt("seoDescription", "Beskrivning för Google"), group: "brand" }),
    defineField({ ...img("seoImage", "Delningsbild för sociala medier"), group: "brand" }),
    defineField({ name: "copyright", title: "Upphovsrättstext i sidfoten", type: "string", group: "brand" }),
    defineField({ name: "phoneDisplay", title: "Telefonnummer som visas", type: "string", group: "contact", description: "Till exempel 031-386 00 86." }),
    defineField({ name: "phoneLink", title: "Länk till telefonnummer", type: "string", group: "contact", description: "Till exempel tel:031-3860086." }),
    defineField({ name: "email", title: "E-postadress", type: "string", group: "contact" }),
    defineField({ name: "address", title: "Adress", type: "string", group: "contact", description: "Används även på den inbäddade kartan." }),
    defineField({ name: "mapsUrl", title: "Länk till Google Maps", type: "url", group: "contact" }),
    defineField({ name: "orgNumber", title: "Organisationsnummer", type: "string", group: "contact" }),
    defineField({
      name: "openingHours",
      title: "Öppettider på kontaktsidan",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "object", fields: [ls("days", "Dagar"), ls("hours", "Tider")], preview: { select: { title: "days.sv", subtitle: "hours.sv" } } })],
    }),
    defineField({
      name: "social",
      title: "Sociala medier (äldre inställning)",
      type: "array",
      group: "contact",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "platform", title: "Plattform", type: "string", options: { list: [{ title: "Facebook", value: "facebook" }, { title: "Instagram", value: "instagram" }, { title: "TikTok", value: "tiktok" }] } }),
          defineField({ name: "url", title: "Länk", type: "url" }),
        ],
        preview: { select: { title: "platform", subtitle: "url" } },
      })],
    }),
  ],
  preview: { prepare: () => ({ title: "Webbplatsinställningar" }) },
});

const linkItem = defineArrayMember({
  type: "object",
  fields: [
    ls("label", "Länktext"),
    defineField({ ...link("link", "Länkadress"), validation: (rule) => rule.required().custom((value?: string) => !value || /^(\/|#|https?:\/\/|tel:|mailto:)/.test(value) ? true : "Börja med /, #, https://, tel: eller mailto:") }),
  ],
  preview: { select: { title: "label.sv", subtitle: "link" } },
});

export const navigation = defineType({
  name: "navigation",
  title: "Sidhuvud och meny",
  type: "document",
  fields: [
    defineField({ name: "items", title: "Menylänkar", type: "array", of: [linkItem], description: "Dra för att ändra ordning. Ta bort en länk för att dölja den i menyn och sidfoten. En fullständig webbadress (https://…) öppnar den webbplatsen." }),
    ls("extraLabel", "Text för extra menylänk", "Till exempel Skriv in dig. Lämna tomt för att dölja."),
    pagePath("extraPath", "Sida för extra menylänk"),
    ls("ecommerceLabel", "Text på e-handelsknappen"),
    link("ecommerceUrl", "Länk för e-handelsknappen"),
    ls("studentLoginLabel", "Text på elevinloggningen"),
    link("studentLoginUrl", "Länk till elevinloggningen"),
    ls("bookLabel", "Text på bokningsknappen"),
    link("bookUrl", "Länk för bokningsknappen"),
    defineField({ name: "showLanguage", title: "Visa språkval", type: "boolean", initialValue: true }),
  ],
  preview: { prepare: () => ({ title: "Sidhuvud och meny" }) },
});

export const footer = defineType({
  name: "footer",
  title: "Sidfot",
  type: "document",
  fields: [
    lt("text", "Text under logotypen"),
    ls("quick", "Rubrik: Snabblänkar"),
    ls("courses", "Rubrik: Kurser"),
    defineField({ name: "courseLinks", title: "Kurslänkar", type: "array", of: [linkItem] }),
    defineField({ name: "helpLinks", title: "Hjälp och support", type: "array", of: [linkItem] }),
    defineField({ name: "legalLinks", title: "Juridiska länkar i sidfoten", type: "array", of: [linkItem] }),
    defineField({
      name: "social",
      title: "Sociala medier",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "platform", title: "Plattform", type: "string", options: { list: [{ title: "Facebook", value: "facebook" }, { title: "Instagram", value: "instagram" }, { title: "TikTok", value: "tiktok" }] } }),
          defineField({ name: "url", title: "Länk", type: "url" }),
        ],
        preview: { select: { title: "platform", subtitle: "url" } },
      })],
    }),
    defineField({ name: "drivingLicenceUrl", title: "Länk till ansökan om körkortstillstånd", type: "url" }),
    ls("contact", "Rubrik: Kontakt"),
    ls("rights", "Text efter upphovsrätt"),
    ls("city", "Text nere till höger"),
  ],
  preview: { prepare: () => ({ title: "Sidfot" }) },
});
