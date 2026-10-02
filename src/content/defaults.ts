// Non-translation content (images, links, contact details, lists) with the
// original hard-coded values as fallback. Sanity overrides these when configured.
import { COURSES, GALLERY_IMAGES, NAV } from "../data";
import type { InfoPagePath, PagePath } from "../types";
import { contactInformationParagraphs, legalNoticeParagraphs, privacyPolicyParagraphs, refundPolicyParagraphs, shippingPolicyParagraphs, userTermsParagraphs } from "./policies";
import type { Translations } from "./translations";

export const HOME_SECTION_KEYS = ["hero", "benefits", "journey", "courses", "packages", "quiz", "simulator", "braking", "reviews", "trainers", "gallery", "finalCta", "visit"] as const;
export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

// href: a site page ("/gallery") or a full URL (opens the external site).
export type NavItem = { label: string; href: string };
export type Course = { title: string; text: string; price: string; image: string; url: string };
export type GalleryItem = { src: string; title: string; tag: string };
export type Trainer = { name: string; experience: string; role: string; languages: string; quote: string; image: string; position: string };
export type Review = { author: string; time: string; text: string; initials: string; rating: number };
export type OpeningHour = { days: string; hours: string };
export type SocialLink = { platform: string; url: string };
export type InfoPage = { id: string; path: InfoPagePath; title: string; paragraphs: string[] };

export const DEFAULT_INFO_PAGES: InfoPage[] = [
  { id: "faqPage", path: "/vanliga-fragor", title: "Vanliga frågor", paragraphs: ["Här samlar vi svar på vanliga frågor om körkortsutbildningen.", "Har du frågor om bokning eller din utbildning? Kontakta oss på info@kornu.se eller 031-386 00 86."] },
  { id: "termsInfoPage", path: "/villkor-och-info", title: "Villkor & information", paragraphs: ["Här hittar du viktig information och villkor för Kör Nu Trafikskolas tjänster.", "Kontakta oss om du behöver hjälp eller vill veta mer innan du bokar."] },
  { id: "privacyPolicyPage", path: "/integritetspolicy", title: "Integritetspolicy", paragraphs: privacyPolicyParagraphs },
  { id: "contactInformationPage", path: "/kontaktinformation", title: "Kontaktinformation", paragraphs: contactInformationParagraphs },
  { id: "userTermsPage", path: "/anvandarvillkor", title: "Användarvillkor", paragraphs: userTermsParagraphs },
  { id: "shippingPolicyPage", path: "/fraktpolicy", title: "Fraktpolicy", paragraphs: shippingPolicyParagraphs },
  { id: "legalNoticePage", path: "/rattsligt-meddelande", title: "Rättsligt meddelande", paragraphs: legalNoticeParagraphs },
  { id: "refundPolicyPage", path: "/aterbetalningspolicy", title: "Återbetalningspolicy", paragraphs: refundPolicyParagraphs },
];

export type Site = {
  siteName: string;
  logo: string;
  seo: { title: string; description: string; image: string };
  phone: { display: string; href: string };
  email: string;
  address: string;
  mapsUrl: string;
  aboutMapsUrl: string;
  orgNumber: string;
  social: SocialLink[];
  links: { ecommerce: string; studentLogin: string; booking: string; coursesBooking: string };
  header: { ecommerce: string; studentLogin: string; extraLabel: string; extraPath: PagePath; showLanguage: boolean };
  nav: NavItem[];
  footerCourseLinks: NavItem[];
  footerHelpLinks: NavItem[];
  footerLegalLinks: NavItem[];
  drivingLicenceUrl: string;
  infoPages: InfoPage[];
  copyright: string;
  homeSections: HomeSectionKey[];
  images: { hero: string; heroAlt: string; simulator: string; simulatorAlt: string; car: string; about: string; contactForm: string };
  simulatorChips: string[];
  courses: Course[];
  gallery: GalleryItem[];
  trainers: Trainer[];
  trainersText: { tag: string; title: string; highlight: string; languagesLabel: string };
  reviews: Review[];
  reviewRating: string;
  openingHours: OpeningHour[];
  contactLabels: { phone: string; email: string; org: string };
  // Where each CMS-editable button goes: a page ("/packages"), an anchor ("#paket") or a URL.
  buttons: { heroBook: string; heroSecondary: string; finalCta: string; coursesLink: string; galleryLink: string };
  coursesLinkLabel: string;
  galleryLinkLabel: string;
};

const COURSE_BOOKING_URL = "https://www.trafikskolaonline.se/sv/skola/kornu/kurser";

export const DEFAULT_TRAINERS: Trainer[] = [
  { name: "Abbe", experience: "12 år", role: "Trafiklärare B – grundare", languages: "SV – EN – AR – KU", quote: "Om händerna skakar på första lektionen är du precis den elev jag tycker om att undervisa.", image: "/images/Bob.webp", position: "50% 35%" },
  { name: "Amran", experience: "9 år", role: "Stadskörning – nervositet", languages: "SV – EN – AR", quote: "Vi kan stanna på en tom parkering så länge du behöver. Staden kan vänta.", image: "/images/Amran.webp", position: "50% 32%" },
  { name: "Josef", experience: "14 år", role: "Motorväg & mörkerkörning", languages: "SV – EN", quote: "Påfarten handlar om rytm, inte om att kasta sig in. Vi tränar tills det känns naturligt.", image: "/images/Josef.webp", position: "50% 34%" },
  { name: "Zana", experience: "8 år", role: "Intensivkurs & uppkörning", languages: "SV – EN – AR", quote: "Intensivt betyder inte stressigt. Det betyder att vi tar vara på varje minut.", image: "/images/Zana.webp", position: "50% 32%" },
];

export const DEFAULT_OPENING_HOURS: OpeningHour[] = [
  { days: "Mån-Tors", hours: "11:00-15:00" },
  { days: "Fre", hours: "11:00-13:00" },
  { days: "Lör-Sön", hours: "Stängt" },
];

export function defaultSite(t: Translations): Site {
  const navLabels: Record<string, string> = {
    "/": t.nav.home, "/courses": t.nav.courses, "/packages": t.nav.packages, "/simulator": t.nav.simulator,
    "/gallery": t.nav.gallery, "/about": t.nav.about, "/contact": t.nav.contact,
  };
  return {
    siteName: "Kör Nu Trafikskola",
    logo: "/images/logo.avif",
    seo: {
      title: "Kör Nu Trafikskola – Körskola i Göteborg",
      description: "Kör Nu Trafikskola i Göteborg erbjuder körkortsutbildning på svenska, engelska, kurdiska och arabiska. Boka körlektion idag!",
      image: "/images/logo.avif",
    },
    phone: { display: "031‑386 00 86", href: "tel:031-3860086" },
    email: "info@kornu.se",
    address: "FO Petersons gata 6, 421 31 Västra Frölunda",
    mapsUrl: "https://maps.google.com/?q=FO+Petersons+gata+6,+421+31+V%C3%A4stra+Fr%C3%B6lunda",
    aboutMapsUrl: "https://www.google.com/maps/search/?api=1&query=K%C3%B6r+Nu+Trafikskola+V%C3%A4stra+Fr%C3%B6lunda+G%C3%B6teborg",
    orgNumber: "559288-1386",
    social: [{ platform: "facebook", url: "" }, { platform: "instagram", url: "" }, { platform: "tiktok", url: "" }],
    links: {
      ecommerce: "https://www.trafikskolaonline.se/sv/skola/kornu/ehandel",
      studentLogin: "https://www.trafikskolaonline.se/sv/skola/kornu/elevinloggning",
      booking: "https://www.trafikskolaonline.se/sv/skola/kornu/lektioner",
      coursesBooking: COURSE_BOOKING_URL,
    },
    header: { ecommerce: "E-Handle", studentLogin: "Elevinloggning", extraLabel: "Skriv in dig", extraPath: "/contact", showLanguage: true },
    // "Kontakt" is reached through the "Skriv in dig" link; "Kurser" opens the booking site.
    nav: NAV.filter((item) => item.path !== "/contact").map((item) => ({
      href: item.path === "/courses" ? COURSE_BOOKING_URL : item.path,
      label: navLabels[item.path] ?? item.label,
    })),
    footerCourseLinks: [
      { label: String(t.packages.items[0][1]), href: COURSE_BOOKING_URL },
      { label: t.pay.automatic, href: COURSE_BOOKING_URL },
      { label: "Risk 1", href: COURSE_BOOKING_URL },
      { label: "Risk 2", href: COURSE_BOOKING_URL },
      { label: String(t.packages.items[2][0]), href: COURSE_BOOKING_URL },
    ],
    footerHelpLinks: [
      { label: "Vanliga frågor", href: "/vanliga-fragor" },
      { label: "Villkor & info", href: "/villkor-och-info" },
    ],
    footerLegalLinks: DEFAULT_INFO_PAGES.slice(2).map(({ path, title }) => ({ label: title, href: path })),
    drivingLicenceUrl: "https://www.transportstyrelsen.se/sv/vagtrafik/e-tjanster-och-blanketter/blanketter-for-vagtrafik/korkort/privatperson/ansok-om-korkortstillstand-grupp-i/",
    infoPages: DEFAULT_INFO_PAGES,
    copyright: "© 2026 Kör Nu Trafikskola AB.",
    homeSections: ["hero", "benefits", "journey", "packages", "quiz", "simulator", "braking", "reviews", "finalCta", "visit"],
    images: {
      hero: "/images/hero-green.png",
      heroAlt: "Kör Nu Driving School",
      simulator: "/images/simulator.jpg",
      simulatorAlt: "Kör Nu körsimulatorn",
      car: "/images/car.png",
      about: "/images/kornu-about.webp",
      contactForm: "/images/kornu-about.webp",
    },
    simulatorChips: [`🏙️ ${t.simulator.city}`, `🛣️ ${t.simulator.motorway}`, `🌙 ${t.simulator.night}`],
    courses: COURSES.map((course, index) => {
      const [title, text, price] = t.courses.cards[index] ?? [course.title, course.text, course.price];
      return { title, text, price, image: course.image, url: COURSE_BOOKING_URL };
    }),
    gallery: GALLERY_IMAGES,
    trainers: DEFAULT_TRAINERS,
    trainersText: { tag: "Våra trafiklärare", title: "Människor du faktiskt vill sitta", highlight: "bredvid.", languagesLabel: "Språk" },
    reviews: t.reviews.items.map(([author, time, text, initials]) => ({ author, time, text, initials, rating: 5 })),
    reviewRating: "4.9",
    openingHours: DEFAULT_OPENING_HOURS,
    contactLabels: { phone: t.pay.phone, email: t.pay.email, org: "Org.nr" },
    buttons: { heroBook: "/packages", heroSecondary: "#paket", finalCta: "/packages", coursesLink: "/packages", galleryLink: "/gallery" },
    coursesLinkLabel: t.packages.tag,
    galleryLinkLabel: t.nav.gallery,
  };
}
