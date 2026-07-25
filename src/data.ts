import type { Package, PagePath } from "./types";

export const NAV: { label: string; path: PagePath }[] = [
  { label: "Hem", path: "/" },
  { label: "Kurser", path: "/courses" },
  { label: "Paket", path: "/packages" },
  { label: "Simulator", path: "/simulator" },
  { label: "Gallery", path: "/gallery" },
  { label: "Kontakt", path: "/contact" },
];

export const BENEFITS = [
  { title: "Flexibla tider", text: "Körlektioner kvällar, helger och vardagar – när det passar dig.", icon: "calendar" },
  { title: "Moderna bilar", text: "Säkra fordon med dubbelkommandon och automatisk växellåda.", icon: "car" },
  { title: "Certifierade lärare", text: "Tålmodiga, erfarna instruktörer som undervisar på fyra språk.", icon: "person" },
  { title: "Nära Trafikverket", text: "I Västra Frölunda, bredvid Trafikverkets provkontor i Högsbo.", icon: "pin" },
];

export const JOURNEY = [
  { label: "Syntest", detail: "Kontrollera din syn och starta din plan.", x: "5%", y: "63%" },
  { label: "Risk 1", detail: "Teoretisk kurs om alkohol, droger och trötthet.", x: "20%", y: "38%" },
  { label: "Risk 2", detail: "Halkkörning och kontrollövningar.", x: "35%", y: "58%" },
  { label: "Teori", detail: "Digitala teorifrågor med ljudstöd och övningar.", x: "50%", y: "33%" },
  { label: "Körlektioner", detail: "Stadskörning, landsväg, parkering och testrundor.", x: "64%", y: "56%" },
  { label: "Uppkörning", detail: "Uppvärmning och sista förberedelser.", x: "79%", y: "35%" },
  { label: "Körkort!", detail: "Grattis – du är nu en licensierad förare.", x: "93%", y: "59%" },
];

export const PACKAGES: Package[] = [
  { id: "pkt-5", name: "Paket 5", lessons: "5 körlektioner (40 min)", includes: ["5 körlektioner", "Inskrivningsavgift 100 kr på plats"], price: 2475, originalPrice: null, popular: false },
  { id: "pkt-total-5", name: "Totalpaket 1", lessons: "5 körlektioner + Risk 1-2 + Teori", includes: ["5 körlektioner (40 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"], price: 5393, originalPrice: 6945, popular: false },
  { id: "pkt-10", name: "Kör Nu Paket", lessons: "10 körlektioner + Risk 1 & 2", includes: ["10 körlektioner (40 min)", "Risk 1 & Risk 2", "Inskrivning", "Perfekt startpaket"], price: 7249, originalPrice: 7890, popular: true },
  { id: "pkt-mellan", name: "Mellanpaket", lessons: "10 körlektioner (80 min) + Risk 1-2 + Teori", includes: ["10 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"], price: 12999, originalPrice: 14500, popular: false },
  { id: "pkt-stor", name: "Stort Paket", lessons: "15 körlektioner (80 min) + Risk 1-2 + Teori", includes: ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"], price: 19300, originalPrice: null, popular: false },
  { id: "pkt-intensiv", name: "Intensivpaket", lessons: "40 körlektioner + Risk 1-2 + Teori", includes: ["40 körlektioner", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår", "Spara 2 560 kr"], price: 21499, originalPrice: 24059, popular: false },
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
