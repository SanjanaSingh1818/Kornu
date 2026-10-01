import { defineArrayMember, defineField, defineType } from "sanity";
import { img, link, ls, lt, pagePath } from "./helpers";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand & Google", default: true },
    { name: "contact", title: "Contact details" },
  ],
  fields: [
    defineField({ name: "siteName", title: "School name", type: "string", group: "brand" }),
    defineField({ ...img("logo", "Logo", "Also used as the browser tab icon."), group: "brand" }),
    defineField({ ...ls("seoTitle", "Browser tab / Google title"), group: "brand" }),
    defineField({ ...lt("seoDescription", "Google description"), group: "brand" }),
    defineField({ ...img("seoImage", "Share image (Facebook, WhatsApp, etc.)"), group: "brand" }),
    defineField({ name: "copyright", title: "Copyright line (footer)", type: "string", group: "brand" }),
    defineField({ name: "phoneDisplay", title: "Phone (as shown)", type: "string", group: "contact", description: "e.g. 031-386 00 86" }),
    defineField({ name: "phoneLink", title: "Phone link", type: "string", group: "contact", description: "e.g. tel:031-3860086" }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({ name: "address", title: "Address", type: "string", group: "contact", description: "Also used for the embedded map." }),
    defineField({ name: "mapsUrl", title: "Google Maps link", type: "url", group: "contact" }),
    defineField({ name: "orgNumber", title: "Org. number", type: "string", group: "contact" }),
    defineField({
      name: "openingHours",
      title: "Opening hours (contact page)",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "object", fields: [ls("days", "Days"), ls("hours", "Hours")], preview: { select: { title: "days.sv", subtitle: "hours.sv" } } })],
    }),
    defineField({
      name: "social",
      title: "Social media (footer)",
      type: "array",
      group: "contact",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "platform", title: "Platform", type: "string", options: { list: ["facebook", "instagram"] } }),
          defineField({ name: "url", title: "URL", type: "url" }),
        ],
        preview: { select: { title: "platform", subtitle: "url" } },
      })],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

const linkItem = defineArrayMember({
  type: "object",
  fields: [ls("label", "Label"), pagePath()],
  preview: { select: { title: "label.sv", subtitle: "path" } },
});

export const navigation = defineType({
  name: "navigation",
  title: "Header & menu",
  type: "document",
  fields: [
    defineField({ name: "items", title: "Menu links", type: "array", of: [linkItem], description: "Drag to reorder. Remove a link to hide it from the menu and footer." }),
    ls("extraLabel", "Extra menu link label", "e.g. “Skriv in dig”. Leave empty to hide."),
    pagePath("extraPath", "Extra menu link page"),
    ls("ecommerceLabel", "E-handel button text"),
    link("ecommerceUrl", "E-handel button link"),
    ls("studentLoginLabel", "Student login button text"),
    link("studentLoginUrl", "Student login button link"),
    ls("bookLabel", "Green booking button text"),
    link("bookUrl", "Green booking button link"),
    defineField({ name: "showLanguage", title: "Show language picker", type: "boolean", initialValue: true }),
  ],
  preview: { prepare: () => ({ title: "Header & menu" }) },
});

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    lt("text", "About text under the logo"),
    ls("quick", "Quick links heading"),
    ls("courses", "Courses heading"),
    defineField({ name: "courseLinks", title: "Courses links", type: "array", of: [linkItem] }),
    ls("contact", "Contact heading"),
    ls("rights", "“All rights reserved” text"),
    ls("city", "Bottom-right text"),
  ],
  preview: { prepare: () => ({ title: "Footer" }) },
});
