import { defineArrayMember, defineField, defineType } from "sanity";
import { HOME_SECTIONS, ICON_OPTIONS, img, link, ls, lt, pageHeader } from "./helpers";

const single = (name: string, title: string, fields: ReturnType<typeof defineField>[], description?: string) =>
  defineType({ name, title, type: "document", description, fields, preview: { prepare: () => ({ title }) } });

// ---- Home page --------------------------------------------------------------

export const homePage = single("homePage", "Section order", [
  defineField({
    name: "sections",
    title: "Sections shown on the home page",
    description: "Drag to reorder, remove to hide, “Add item” to show a section again.",
    type: "array",
    of: [defineArrayMember({ type: "string", options: { list: HOME_SECTIONS } })],
  }),
]);

export const heroSection = single("heroSection", "Hero (top of home page)", [
  ls("badge", "Badge"),
  ls("titleA", "Title (white part)"),
  ls("titleB", "Title (green part)"),
  lt("text", "Text"),
  ls("bookLabel", "Green button text"),
  link("bookLink", "Green button link"),
  ls("packagesLabel", "Second button text"),
  link("packagesLink", "Second button link"),
  img("image", "Background image"),
  ls("imageAlt", "Image description (accessibility)"),
  defineField({
    name: "stats",
    title: "Numbers under the buttons",
    type: "array",
    of: [defineArrayMember({ type: "object", fields: [ls("value", "Value", "e.g. 100+"), ls("label", "Label")], preview: { select: { title: "value.sv", subtitle: "label.sv" } } })],
  }),
]);

export const benefitsSection = single("benefitsSection", "Benefits bar", [
  defineField({
    name: "items",
    title: "Benefits",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      fields: [ls("title", "Title"), lt("text", "Text"), defineField({ name: "icon", title: "Icon", type: "string", options: { list: ICON_OPTIONS } })],
      preview: { select: { title: "title.sv", subtitle: "icon" } },
    })],
  }),
]);

export const journeySection = single("journeySection", "Journey (road to licence)", [
  ls("tag", "Small label"),
  ls("title", "Title"),
  lt("text", "Text"),
  defineField({
    name: "steps",
    title: "Steps",
    description: "The desktop road has room for 6 steps.",
    type: "array",
    validation: (rule) => rule.max(6),
    of: [defineArrayMember({ type: "object", fields: [ls("label", "Step"), lt("detail", "Detail")], preview: { select: { title: "label.sv", subtitle: "detail.sv" } } })],
  }),
  img("carImage", "Car image (also used in the simulator section)"),
]);

// ---- Pages ------------------------------------------------------------------

export const coursesPage = single("coursesPage", "Courses", [
  pageHeader,
  ls("linkLabel", "Link text next to the title", "Leave empty to hide."),
  link("link", "Link next to the title"),
  defineField({ name: "defaultBookingUrl", title: "Default course booking link", type: "url", description: "Used for courses without their own link." }),
  defineField({
    name: "courses",
    title: "Course cards",
    description: "Drag to reorder.",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      name: "courseCard",
      fields: [
        ls("title", "Title"),
        lt("text", "Text"),
        ls("price", "Price text", "e.g. “Från 495 kr / lektion”"),
        img("image", "Image"),
        defineField({ name: "url", title: "Card link", type: "url", description: "Leave empty to use the default course booking link." }),
      ],
      preview: { select: { title: "title.sv", subtitle: "price.sv", media: "image" } },
    })],
  }),
]);

export const galleryPage = single("galleryPage", "Gallery", [
  pageHeader,
  ls("photosLabel", "Label under the photo count", "e.g. “bilder” in “11 bilder”."),
  ls("linkLabel", "“See all” link text (home page preview)"),
  link("link", "“See all” link"),
  defineField({
    name: "photos",
    title: "Photos",
    description: "Drag to reorder. The home page preview shows the first 8.",
    type: "array",
    options: { layout: "grid" },
    of: [defineArrayMember({
      type: "object",
      name: "galleryPhoto",
      fields: [defineField({ ...img("image", "Photo"), validation: (rule) => rule.required() }), ls("title", "Caption", "Shown in the full-screen viewer and used as the image description."), ls("tag", "Tag", "Small label on the photo, e.g. “Godkänd elev”.")],
      preview: { select: { title: "title.sv", subtitle: "tag.sv", media: "image" } },
    })],
  }),
]);

export const packagesPage = single("packagesPage", "Packages & prices texts", [
  pageHeader,
  ls("tag", "Section small label"),
  ls("title", "Section title"),
  lt("text", "Section text"),
  ls("popular", "“Popular” badge"),
  ls("price", "“Price incl. VAT” label"),
  ls("buy", "Buy button"),
  ls("readMore", "“Read more” button"),
  ls("moreBenefits", "“more benefits” text"),
  ls("help", "“Need advice?” text"),
  ls("call", "“Call us at” text"),
], "Packages and prices themselves are managed in Stripe. Only the texts around them are edited here.");

export const simulatorPage = single("simulatorPage", "Simulator", [
  pageHeader,
  ls("tag", "Section small label"),
  ls("title", "Section title"),
  lt("text", "Section text"),
  ls("start", "Start button text", "The button opens the driving simulator."),
  defineField({ name: "chips", title: "Feature tags", type: "array", of: [defineArrayMember({ type: "localeString" })], description: "Emoji allowed, e.g. “🏙️ Stadskörning”." }),
  img("image", "Image"),
  ls("imageAlt", "Image description (accessibility)"),
]);

export const aboutPage = single("aboutPage", "About", [
  ls("eyebrow", "Small label"),
  ls("title", "Title"),
  defineField({ name: "paragraphs", title: "Paragraphs", type: "array", of: [defineArrayMember({ type: "localeText" })] }),
  ls("findUs", "Button text"),
  link("mapsUrl", "Button link"),
  img("image", "Image"),
  ls("imageAlt", "Image description (accessibility)"),
]);

export const contactPage = single("contactPage", "Contact page header & labels", [
  pageHeader, ls("phoneLabel", "“Phone” label"), ls("emailLabel", "“Email” label"), ls("orgLabel", "“Org. nr” label"),
], "Phone, email, address and opening hours are in Every page → Site settings.");

export const paymentPages = single("paymentPages", "Payment result pages", [
  ls("checkout", "Small label"),
  ls("successPending", "Success title"),
  lt("successPendingText", "Success text"),
  ls("cancelled", "Cancelled title"),
  lt("cancelledText", "Cancelled text"),
]);
