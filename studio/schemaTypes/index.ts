import { localeString, localeText } from "./helpers";
import { aboutPage, benefitsSection, contactPage, coursesPage, galleryPage, heroSection, homePage, infoPageSchemas, journeySection, packagesPage, paymentPages, simulatorPage } from "./pages";
import { brakingSection, contactForm, finalCta, quizSection, reviewsSection, trainersSection, visitSection } from "./sections";
import { footer, navigation, siteSettings } from "./settings";
import { DEFAULT_INFO_PAGES } from "../../src/content/defaults";

export const schemaTypes = [
  localeString, localeText,
  siteSettings, navigation, footer, contactForm,
  homePage, heroSection, benefitsSection, journeySection,
  coursesPage, packagesPage, simulatorPage, galleryPage, aboutPage, contactPage, paymentPages, ...infoPageSchemas,
  quizSection, brakingSection, reviewsSection, visitSection, finalCta, trainersSection,
];

// Varje dokument har ett fast ID som motsvarar dess schematyp.
export const SINGLETON_IDS = schemaTypes.map((type) => type.name).filter((name) => !name.startsWith("locale"));

type Item = { id: string; title: string };
export type PageFolder = { title: string; icon: string; items: Item[] };

// Sidomenyn följer webbplatsens sidstruktur. Delade sektioner visas där de används.
const PAGES: PageFolder[] = [
  {
    title: "Startsida",
    icon: "🏠",
    items: [
      { id: "homePage", title: "① Startsidessektioner (visa, dölj och sortera)" },
      { id: "heroSection", title: "Toppsektion (bild, rubrik och knappar)" },
      { id: "benefitsSection", title: "Fördelar" },
      { id: "journeySection", title: "Vägen till körkortet" },
      { id: "packagesPage", title: "Paket och priser" },
      { id: "quizSection", title: "Teorifrågor och quiz" },
      { id: "simulatorPage", title: "Simulator" },
      { id: "brakingSection", title: "Bromssträcka" },
      { id: "reviewsSection", title: "Recensioner" },
      { id: "finalCta", title: "Avslutande uppmaning" },
      { id: "visitSection", title: "Hitta hit och karta" },
      { id: "trainersSection", title: "Trafiklärare (visas om sektionen aktiveras)" },
      { id: "galleryPage", title: "Galleri (visas om sektionen aktiveras)" },
    ],
  },
  {
    title: "Kurssida",
    icon: "📚",
    items: [
      { id: "coursesPage", title: "Sidhuvud och kurskort" },
      { id: "journeySection", title: "Vägen till körkortet" },
    ],
  },
  { title: "Paketsida", icon: "📦", items: [{ id: "packagesPage", title: "Sidhuvud och texter" }] },
  { title: "Simulatorsida", icon: "🎮", items: [{ id: "simulatorPage", title: "Sidhuvud och simulator" }] },
  { title: "Gallerisida", icon: "🖼️", items: [{ id: "galleryPage", title: "Sidhuvud och bilder" }] },
  { title: "Om oss", icon: "ℹ️", items: [{ id: "aboutPage", title: "Texter och bild" }] },
  {
    title: "Kontaktsida",
    icon: "✉️",
    items: [
      { id: "contactPage", title: "Sidhuvud och etiketter" },
      { id: "finalCta", title: "Avslutande uppmaning" },
      { id: "contactForm", title: "Kontaktformulär och foto" },
      { id: "visitSection", title: "Adress, öppettider och karta" },
    ],
  },
  { title: "Betalningssidor", icon: "💳", items: [{ id: "paymentPages", title: "Texter för genomförd eller avbruten betalning" }] },
  { title: "Hjälp och juridik", icon: "⚖️", items: DEFAULT_INFO_PAGES.map((page) => ({ id: page.id, title: page.title })) },
  {
    title: "Alla sidor",
    icon: "⚙️",
    items: [
      { id: "navigation", title: "Sidhuvud och meny" },
      { id: "footer", title: "Sidfot, länkar och sociala medier" },
      { id: "contactForm", title: "Kontaktformulär och foto längst ned" },
      { id: "siteSettings", title: "Webbplatsinställningar, logotyp och kontaktuppgifter" },
    ],
  },
];

// Kontaktformuläret visas längst ned på alla sidor.
const CONTACT_FORM_ITEM: Item = { id: "contactForm", title: "Kontaktformulär och foto längst ned" };
export const PAGE_FOLDERS: PageFolder[] = PAGES.map((folder) =>
  ["Alla sidor", "Betalningssidor", "Kontaktsida", "Hjälp och juridik"].includes(folder.title) ? folder : { ...folder, items: [...folder.items, CONTACT_FORM_ITEM] },
);
