import { localeString, localeText } from "./helpers";
import { aboutPage, benefitsSection, contactPage, coursesPage, galleryPage, heroSection, homePage, journeySection, packagesPage, paymentPages, simulatorPage } from "./pages";
import { brakingSection, contactForm, finalCta, quizSection, reviewsSection, trainersSection, visitSection } from "./sections";
import { footer, navigation, siteSettings } from "./settings";

export const schemaTypes = [
  localeString, localeText,
  siteSettings, navigation, footer, contactForm,
  homePage, heroSection, benefitsSection, journeySection,
  coursesPage, packagesPage, simulatorPage, galleryPage, aboutPage, contactPage, paymentPages,
  quizSection, brakingSection, reviewsSection, visitSection, finalCta, trainersSection,
];

// Every document is a singleton with a fixed ID (= its type name). The site reads them by these IDs.
export const SINGLETON_IDS = schemaTypes.map((type) => type.name).filter((name) => !name.startsWith("locale"));

type Item = { id: string; title: string };
export type PageFolder = { title: string; icon: string; items: Item[] };

// The sidebar mirrors the website: one folder per page with its sections in page order.
// A shared section (e.g. the green call-to-action box) is listed on every page that shows it.
const PAGES: PageFolder[] = [
  {
    title: "Home page",
    icon: "🏠",
    items: [
      { id: "homePage", title: "① Section order (show / hide / reorder)" },
      { id: "heroSection", title: "Hero (top image, title, buttons)" },
      { id: "benefitsSection", title: "Benefits bar" },
      { id: "journeySection", title: "Journey (road to licence)" },
      { id: "packagesPage", title: "Packages & prices texts" },
      { id: "quizSection", title: "Theory quiz + questions" },
      { id: "simulatorPage", title: "Simulator" },
      { id: "brakingSection", title: "Braking distance visualizer" },
      { id: "reviewsSection", title: "Reviews" },
      { id: "finalCta", title: "Final call to action (green box)" },
      { id: "visitSection", title: "Visit us (map)" },
      { id: "trainersSection", title: "Trainers (hidden unless added in Section order)" },
      { id: "galleryPage", title: "Gallery preview (hidden unless added in Section order)" },
    ],
  },
  {
    title: "Courses page",
    icon: "📚",
    items: [
      { id: "coursesPage", title: "Header + course cards" },
      { id: "journeySection", title: "Journey (road to licence)" },
    ],
  },
  { title: "Packages page", icon: "📦", items: [{ id: "packagesPage", title: "Header + texts" }] },
  { title: "Simulator page", icon: "🎮", items: [{ id: "simulatorPage", title: "Header + simulator section" }] },
  { title: "Gallery page", icon: "🖼️", items: [{ id: "galleryPage", title: "Header + photos" }] },
  { title: "About page", icon: "ℹ️", items: [{ id: "aboutPage", title: "Texts + image" }] },
  {
    title: "Contact page",
    icon: "✉️",
    items: [
      { id: "contactPage", title: "Header + labels" },
      { id: "finalCta", title: "Final call to action (green box)" },
      { id: "visitSection", title: "Headings & opening hours text" },
    ],
  },
  { title: "Payment result pages", icon: "💳", items: [{ id: "paymentPages", title: "Success & cancelled texts" }] },
  {
    title: "Every page",
    icon: "⚙️",
    items: [
      { id: "navigation", title: "Header & menu (links + buttons)" },
      { id: "footer", title: "Footer" },
      { id: "contactForm", title: "Contact form + photo (bottom of every page)" },
      { id: "siteSettings", title: "Site settings (logo, phone, email, address, Google)" },
    ],
  },
];

// The contact form (photo + "Boka din första lektion") sits at the bottom of every page,
// so it is listed last in each page folder as well as under "Every page".
const CONTACT_FORM_ITEM: Item = { id: "contactForm", title: "Contact form + photo (bottom of every page)" };
export const PAGE_FOLDERS: PageFolder[] = PAGES.map((folder) =>
  folder.title === "Every page" || folder.title === "Payment result pages" ? folder : { ...folder, items: [...folder.items, CONTACT_FORM_ITEM] },
);
