import type { Package, PagePath } from "./types";

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
  { id: "pkt-5", name: "Grundpaketet", lessons: "5 körlektioner (80 min)", includes: ["5 körlektioner (80 min)", "Digitalt teoripaket", "Personlig studieplan"], price: 4900, originalPrice: null, popular: false },
  { id: "pkt-total-5", name: "Mellanpaketet", lessons: "10 körlektioner (80 min) + Risk 1", includes: ["10 körlektioner (80 min)", "Riskettan", "Obegränsade teoriprov", "Låna bil till prov"], price: 9800, originalPrice: null, popular: true },
  { id: "pkt-10", name: "Intensivpaket", lessons: "15 körlektioner (80 min) + Risk 1 & 2", includes: ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Komplett teoripaket", "Provförberedelse"], price: 15200, originalPrice: null, popular: false },
  { id: "pkt-mellan", name: "Mellanpaket", lessons: "10 körlektioner (80 min) + Risk 1-2 + Teori", includes: ["10 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"], price: 12999, originalPrice: 14500, popular: false },
  { id: "pkt-stor", name: "Stort Paket", lessons: "15 körlektioner (80 min) + Risk 1-2 + Teori", includes: ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"], price: 19300, originalPrice: null, popular: false },
  { id: "pkt-intensiv", name: "Komplettpaket", lessons: "25 körlektioner (80 min) + Risk 1-2 + Teori", includes: ["25 körlektioner (80 min)", "Risk 1 & Risk 2", "Handledarutbildning", "Prioriterade tider", "Låna bil till uppkörning"], price: 24500, originalPrice: null, popular: false },
];

export const COURSES = [
  { title: "Manuell körning", text: "Lär dig kopplingskontroll och stadskörning med professionell handledning.", price: "Från 495 kr / lektion", image: "/images/course-city.jpg" },
  { title: "Automat körning", text: "Fokusera på trafikflöde, säkerhet och beslutsfattande utan växelstress.", price: "Från 495 kr / lektion", image: "/images/course-auto.jpg" },
  { title: "Intensivkurs", text: "Strukturerad och snabb väg till körkort med dagliga lektioner.", price: "Paket från 7 249 kr", image: "/images/course-intensive.jpg" },
  { title: "Motorvägskörning", text: "Infarter, hastighetsbedömning och säkra motorvägsrutiner.", price: "Från 1 450 kr", image: "/images/course-motorway.jpg" },
  { title: "Mörkerkörning", text: "Observation, hastighetval och körning på våt vägbana.", price: "Från 1 250 kr", image: "/images/course-night.jpg" },
];

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
