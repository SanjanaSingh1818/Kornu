import { defineArrayMember, defineField, defineType } from "sanity";
import { img, link, ls, lt } from "./helpers";

const single = (name: string, title: string, fields: ReturnType<typeof defineField>[], description?: string) =>
  defineType({ name, title, type: "document", description, fields, preview: { prepare: () => ({ title }) } });

export const quizSection = single("quizSection", "Teorifrågor", [
  ls("tag", "Liten etikett"), ls("title", "Rubrik"), lt("text", "Text"),
  defineField({
    name: "questions",
    title: "Frågor",
    description: "Dra för att ändra ordning. Frågor med samma kategori grupperas i ett filter.",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      name: "quizQuestion",
      fields: [
        ls("category", "Kategori"),
        ls("question", "Fråga"),
        defineField({ name: "options", title: "Svarsalternativ", type: "array", of: [defineArrayMember({ type: "localeString" })], validation: (rule) => rule.min(2).max(6) }),
        defineField({ name: "correct", title: "Nummer på rätt svar", type: "number", description: "1 = första svaret, 2 = andra svaret och så vidare.", initialValue: 1, validation: (rule) => rule.required().min(1).integer() }),
        lt("explanation", "Förklaring"),
      ],
      preview: { select: { title: "question.sv", subtitle: "category.sv" } },
    })],
  }),
  ls("all", "Filter: Alla"), ls("question", "Etikett: Fråga"), ls("result", "Knapp: Visa resultat"), ls("next", "Knapp: Nästa fråga"),
  ls("retry", "Knapp: Försök igen"), ls("good", "Meddelande vid bra resultat"), ls("practice", "Meddelande vid lågt resultat"),
  ls("got", "Text: Du fick"), ls("of", "Text: av"), ls("correct", "Text: rätt"),
]);

export const brakingSection = single("brakingSection", "Bromssträcka", [
  ls("tag", "Liten etikett"), ls("title", "Rubrik"), lt("text", "Text"),
  ls("variables", "Rubrik för inställningar"), ls("speed", "Etikett: Hastighet"), ls("choose", "Etikett: Välj väglag"),
  ls("stopping", "Etikett: Stoppsträcka"), ls("reaction", "Etikett: Reaktionssträcka"), ls("braking", "Etikett: Bromssträcka"), ls("total", "Etikett: Totalt"),
  defineField({
    name: "conditions",
    title: "Väglag",
    description: "Behåll ordningen: is/snö, vått, torrt, grus. Beräkningen är beroende av den.",
    type: "array",
    validation: (rule) => rule.length(4),
    of: [defineArrayMember({ type: "localeString" })],
  }),
]);

export const reviewsSection = single("reviewsSection", "Recensioner", [
  ls("tag", "Liten etikett"), ls("title", "Rubrik"),
  defineField({ name: "rating", title: "Visat genomsnittsbetyg", type: "string", description: "Till exempel 4,9" }),
  ls("based", "Text om antal recensioner"), ls("verified", "Text längst ned på kortet"),
  defineField({
    name: "items",
    title: "Recensioner",
    description: "Dra för att ändra ordning.",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      name: "reviewItem",
      fields: [
        defineField({ name: "author", title: "Namn", type: "string" }),
        defineField({ name: "initials", title: "Initialer (avatar)", type: "string", validation: (rule) => rule.max(3) }),
        ls("time", "Tidpunkt", "Till exempel för 2 veckor sedan"),
        lt("text", "Recension"),
        defineField({ name: "rating", title: "Stjärnor", type: "number", initialValue: 5, validation: (rule) => rule.min(1).max(5).integer() }),
      ],
      preview: { select: { title: "author", subtitle: "text.sv" } },
    })],
  }),
]);

export const trainersSection = single("trainersSection", "Trafiklärare", [
  ls("tag", "Liten etikett"), ls("title", "Rubrik"), ls("highlight", "Rubrikens gröna kursiva del"), ls("languagesLabel", "Etikett: Språk"),
  defineField({
    name: "trainers",
    title: "Trafiklärare",
    description: "Dra för att ändra ordning.",
    type: "array",
    of: [defineArrayMember({
      type: "object",
      name: "trainerItem",
      fields: [
        defineField({ name: "name", title: "Namn", type: "string" }),
        img("image", "Foto", "Välj beskärningsikonen för att ställa in bildens fokuspunkt."),
        ls("experience", "Erfarenhet", "Till exempel 12 år"),
        ls("role", "Inriktning"),
        defineField({ name: "languages", title: "Språk", type: "string", description: "Till exempel SV – EN – AR" }),
        lt("quote", "Citat"),
      ],
      preview: { select: { title: "name", subtitle: "role.sv", media: "image" } },
    })],
  }),
], "Visas på startsidan när Trafiklärare har lagts till bland startsidessektionerna.");

export const visitSection = single("visitSection", "Hitta hit och karta", [
  ls("tag", "Liten etikett"), ls("title", "Rubrik"), lt("text", "Text"),
  ls("address", "Rubrik: Adress"), ls("contact", "Rubrik: Kontakt"), ls("hours", "Rubrik: Öppettider"), ls("open", "Länktext till karta"),
  lt("schedule", "Öppettider, en rad per dag"),
], "Adress, telefon och e-post hämtas från Alla sidor → Webbplatsinställningar.");

export const finalCta = single("finalCta", "Avslutande uppmaning", [
  ls("tag", "Liten etikett"), ls("title", "Rubrik"), ls("button", "Knapptext"), link("buttonLink", "Knapplänk"), ls("location", "Platsinformation"),
]);

export const contactForm = single("contactForm", "Kontaktformulär på alla sidor", [
  ls("eyebrow", "Liten etikett"), ls("title", "Rubrik"), lt("text", "Text"),
  img("image", "Foto intill formuläret"), ls("imageCaption", "Text på fotot"), ls("imageAlt", "Fotobeskrivning för hjälpmedel"),
  ls("fullName", "Etikett: Namn"), ls("namePlaceholder", "Platshållare: Namn"),
  ls("email", "Etikett: E-post"), ls("emailPlaceholder", "Platshållare: E-post"),
  ls("phone", "Etikett: Telefon"), ls("phonePlaceholder", "Platshållare: Telefon"),
  ls("personalNumber", "Etikett: Personnummer"), ls("personalNumberPlaceholder", "Platshållare: Personnummer"),
  ls("startDate", "Etikett: Önskat startdatum"),
  ls("transmission", "Etikett: Växellåda"), ls("manual", "Alternativ: Manuell"), ls("automatic", "Alternativ: Automat"),
  ls("message", "Etikett: Meddelande"), ls("messagePlaceholder", "Platshållare: Meddelande"),
  ls("submit", "Skicka-knapp"), ls("sending", "Text medan formuläret skickas"), ls("success", "Bekräftelsemeddelande"), ls("error", "Felmeddelande"), ls("close", "Stängknapp för hjälpmedel"),
]);
