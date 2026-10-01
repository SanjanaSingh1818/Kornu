import { defineArrayMember, defineField, defineType } from "sanity";
import { img, link, ls, lt } from "./helpers";

const single = (name: string, title: string, fields: ReturnType<typeof defineField>[], description?: string) =>
  defineType({ name, title, type: "document", description, fields, preview: { prepare: () => ({ title }) } });

export const quizSection = single("quizSection", "Theory quiz", [
  ls("tag", "Small label"), ls("title", "Title"), lt("text", "Text"),
  defineField({
    name: "questions",
    title: "Questions",
    description: "Drag to reorder. Questions with the same category are grouped in a filter.",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      name: "quizQuestion",
      fields: [
        ls("category", "Category"),
        ls("question", "Question"),
        defineField({ name: "options", title: "Answers", type: "array", of: [defineArrayMember({ type: "localeString" })], validation: (rule) => rule.min(2).max(6) }),
        defineField({ name: "correct", title: "Correct answer number", type: "number", description: "1 = first answer, 2 = second, …", initialValue: 1, validation: (rule) => rule.required().min(1).integer() }),
        lt("explanation", "Explanation"),
      ],
      preview: { select: { title: "question.sv", subtitle: "category.sv" } },
    })],
  }),
  ls("all", "“All” filter"), ls("question", "“Question” label"), ls("result", "“See result” button"), ls("next", "“Next question” button"),
  ls("retry", "“Try again” button"), ls("good", "Good result message"), ls("practice", "Low result message"),
  ls("got", "“You got”"), ls("of", "“of”"), ls("correct", "“correct”"),
]);

export const brakingSection = single("brakingSection", "Braking distance visualizer", [
  ls("tag", "Small label"), ls("title", "Title"), lt("text", "Text"),
  ls("variables", "Panel heading"), ls("speed", "“Speed” label"), ls("choose", "“Choose condition” label"),
  ls("stopping", "“Stopping distance” label"), ls("reaction", "“Reaction” label"), ls("braking", "“Braking” label"), ls("total", "“Total” label"),
  defineField({
    name: "conditions",
    title: "Road condition names",
    description: "Keep this order: Ice/Snow, Wet, Dry, Gravel (the physics depend on it).",
    type: "array",
    validation: (rule) => rule.length(4),
    of: [defineArrayMember({ type: "localeString" })],
  }),
]);

export const reviewsSection = single("reviewsSection", "Reviews", [
  ls("tag", "Small label"), ls("title", "Title"),
  defineField({ name: "rating", title: "Average rating shown", type: "string", description: "e.g. 4.9" }),
  ls("based", "“based on 124 reviews” text"), ls("verified", "Card footer text"),
  defineField({
    name: "items",
    title: "Reviews",
    description: "Drag to reorder.",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      name: "reviewItem",
      fields: [
        defineField({ name: "author", title: "Name", type: "string" }),
        defineField({ name: "initials", title: "Initials (avatar)", type: "string", validation: (rule) => rule.max(3) }),
        ls("time", "When", "e.g. “för 2 veckor sedan”"),
        lt("text", "Review"),
        defineField({ name: "rating", title: "Stars", type: "number", initialValue: 5, validation: (rule) => rule.min(1).max(5).integer() }),
      ],
      preview: { select: { title: "author", subtitle: "text.sv" } },
    })],
  }),
]);

export const trainersSection = single("trainersSection", "Trainers", [
  ls("tag", "Small label"), ls("title", "Title"), ls("highlight", "Title (green italic part)"), ls("languagesLabel", "“Languages” label"),
  defineField({
    name: "trainers",
    title: "Trainers",
    description: "Drag to reorder.",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      name: "trainerItem",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        img("image", "Photo", "Click the crop icon to set the focus point."),
        ls("experience", "Experience", "e.g. “12 år”"),
        ls("role", "Role"),
        defineField({ name: "languages", title: "Languages", type: "string", description: "e.g. SV – EN – AR" }),
        lt("quote", "Quote"),
      ],
      preview: { select: { title: "name", subtitle: "role.sv", media: "image" } },
    })],
  }),
], "Shown on the home page when “Trainers” is added under Section order.");

export const visitSection = single("visitSection", "Visit us (map)", [
  ls("tag", "Small label"), ls("title", "Title"), lt("text", "Text"),
  ls("address", "“Address” heading"), ls("contact", "“Contact” heading"), ls("hours", "“Opening hours” heading"), ls("open", "“Open link” text"),
  lt("schedule", "Opening hours text (one line per row)"),
], "Address, phone and email come from Every page → Site settings.");

export const finalCta = single("finalCta", "Final call to action (green box)", [
  ls("tag", "Small label"), ls("title", "Title"), ls("button", "Button text"), link("buttonLink", "Button link"), ls("location", "Location text"),
]);

export const contactForm = single("contactForm", "Contact form (bottom of every page)", [
  ls("eyebrow", "Small label"), ls("title", "Title"), lt("text", "Text"),
  img("image", "Side image"), ls("imageAlt", "Image description (accessibility)"), ls("imageCaption", "Text on image"),
  ls("fullName", "Name label"), ls("namePlaceholder", "Name placeholder"),
  ls("email", "Email label"), ls("emailPlaceholder", "Email placeholder"),
  ls("phone", "Phone label"), ls("phonePlaceholder", "Phone placeholder"),
  ls("personalNumber", "Personal number label"), ls("personalNumberPlaceholder", "Personal number placeholder"),
  ls("startDate", "Start date label"),
  ls("transmission", "Transmission label"), ls("manual", "“Manual” option"), ls("automatic", "“Automatic” option"),
  ls("message", "Message label"), ls("messagePlaceholder", "Message placeholder"),
  ls("submit", "Submit button"), ls("sending", "“Sending…” text"), ls("success", "Success message"), ls("error", "Error message"), ls("close", "Close button (accessibility)"),
]);
