import type { Package, PagePath } from "./types";

export const SCHOOL_ADDRESS = "FO Petersons gata 6, 421 31 Västra Frölunda";
export const SCHOOL_MAPS_URL = "https://maps.google.com/?q=FO+Petersons+gata+6,+421+31+V%C3%A4stra+Fr%C3%B6lunda";

export const NAV: { label: string; path: PagePath }[] = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Packages", path: "/packages" },
  { label: "Simulator", path: "/simulator" },
  { label: "Gallery", path: "/gallery" },
  { label: "About", path: "/about" },
  { label: "Kontakt", path: "/contact" },
];

export const BENEFITS = [
  { title: "Flexibla tider", text: "Körlektioner kvällar, helger och vardagar – när det passar dig.", icon: "calendar" },
  { title: "Moderna bilar", text: "Säkra fordon med dubbelkommandon och automatisk växellåda.", icon: "car" },
  { title: "Certifierade lärare", text: "Tålmodiga, erfarna instruktörer som undervisar på fyra språk.", icon: "person" },
  { title: "Nära Trafikverket", text: "I Västra Frölunda, bredvid Trafikverkets provkontor i Högsbo.", icon: "pin" },
];

export const JOURNEY = [
  { label: "Körkortstillstånd", detail: "Ansök hos Transportstyrelsen och starta din plan.", x: "5%", y: "63%" },
  { label: "Risk 1", detail: "Teoretisk kurs om alkohol, droger och trötthet.", x: "20%", y: "38%" },
  { label: "Risk 2", detail: "Halkkörning och kontrollövningar.", x: "35%", y: "58%" },
  { label: "Teoriprov", detail: "Öva smart och gör provet hos Trafikverket.", x: "50%", y: "33%" },
  { label: "Uppkörning", detail: "Uppvärmning och sista förberedelser.", x: "79%", y: "35%" },
  { label: "Körkort!", detail: "Grattis – du är nu en licensierad förare.", x: "93%", y: "59%" },
];

export const PACKAGES: Package[] = [
  { id: "pkt-5", name: "Grundpaketet", description: "Grundpaketet för körkortet.", lessons: "5 körlektioner (80 min)", includes: ["5 körlektioner (80 min)", "Digitalt teoripaket", "Personlig studieplan"], price: 4900, currency: "sek", priceId: "legacy-pkt-5", features: ["5 körlektioner (80 min)", "Digitalt teoripaket", "Personlig studieplan"], originalPrice: null, popular: false, sortOrder: 1, collections: ["driving-lesson-package"] },
  { id: "pkt-total-5", name: "Mellanpaketet", description: "Mellanpaket med risk 1 inkluderat.", lessons: "10 körlektioner (80 min) + Risk 1", includes: ["10 körlektioner (80 min)", "Riskettan", "Obegränsade teoriprov", "Låna bil till prov"], price: 9800, currency: "sek", priceId: "legacy-pkt-total-5", features: ["10 körlektioner (80 min)", "Riskettan", "Obegränsade teoriprov", "Låna bil till prov"], originalPrice: null, popular: true, sortOrder: 2, collections: ["total-package"] },
  { id: "pkt-10", name: "Intensivpaket", description: "Intensivpaket för snabbare utveckling.", lessons: "15 körlektioner (80 min) + Risk 1 & 2", includes: ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Komplett teoripaket", "Provförberedelse"], price: 15200, currency: "sek", priceId: "legacy-pkt-10", features: ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Komplett teoripaket", "Provförberedelse"], originalPrice: null, popular: false, sortOrder: 3, collections: ["best-prices"] },
  { id: "pkt-mellan", name: "Mellanpaket", description: "Mellanpaket med teori och risk 1-2.", lessons: "10 körlektioner (80 min) + Risk 1-2 + Teori", includes: ["10 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"], price: 12999, currency: "sek", priceId: "legacy-pkt-mellan", features: ["10 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"], originalPrice: 14500, popular: false, sortOrder: 4, collections: ["courses"] },
  { id: "pkt-stor", name: "Stort Paket", description: "Stort paket för ett bredare körkortsuppdrag.", lessons: "15 körlektioner (80 min) + Risk 1-2 + Teori", includes: ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"], price: 19300, currency: "sek", priceId: "legacy-pkt-stor", features: ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"], originalPrice: null, popular: false, sortOrder: 5, collections: ["start-up-package"] },
  { id: "pkt-intensiv", name: "Komplettpaket", description: "Komplett paket med intensiv körträning.", lessons: "25 körlektioner (80 min) + Risk 1-2 + Teori", includes: ["25 körlektioner (80 min)", "Risk 1 & Risk 2", "Handledarutbildning", "Prioriterade tider", "Låna bil till uppkörning"], price: 24500, currency: "sek", priceId: "legacy-pkt-intensiv", features: ["25 körlektioner (80 min)", "Risk 1 & Risk 2", "Handledarutbildning", "Prioriterade tider", "Låna bil till uppkörning"], originalPrice: null, popular: false, sortOrder: 6, collections: ["total-package"] },
];

export const PAYMENT_TEST_PACKAGE: Package = {
  id: "payment-test",
  name: "Payment Test",
  description: "Live payment test",
  lessons: "One-time payment",
  includes: ["Payment Test", "1 SEK", "SEK"],
  currency: "sek",
  priceId: "legacy-payment-test",
  features: ["Payment Test", "1 SEK", "SEK"],
  price: 1,
  originalPrice: null,
  popular: false,
  sortOrder: 999,
  collections: [],
};

export const GALLERY_IMAGES = [
  { src: "/images/gallery1.webp", title: "Kör Nu Trafikskola", tag: "Göteborg" },
  { src: "/images/img5.webp", title: "Våra elever", tag: "Körkortsglädje" },
  { src: "/images/kornu.webp", title: "Kör Nu", tag: "Trafikskola" },
  { src: "/images/Bob.webp", title: "Bob", tag: "Godkänd elev" },
  { src: "/images/Amran.webp", title: "Amran", tag: "Godkänd elev" },
  { src: "/images/Zana.webp", title: "Zana", tag: "Godkänd elev" },
  { src: "/images/Kevin_1d853a57-4e3b-4437-87e6-333e80836813.webp", title: "Kevin", tag: "Godkänd elev" },
  { src: "/images/Josef.webp", title: "Josef", tag: "Godkänd elev" },
  { src: "/images/Elliot.webp", title: "Elliot", tag: "Godkänd elev" },
  { src: "/images/Omar.webp", title: "Omar", tag: "Godkänd elev" },
  { src: "/images/Faris.webp", title: "Faris", tag: "Godkänd elev" },
];
