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
  {
    id: "termsInfoPage",
    path: "/villkor-och-info",
    title: "Villkor & information",
    paragraphs: [
      "Dessa allmänna villkor gäller mellan Kör nu Trafikskola AB (Org nr. 559288-1386), nedan kallad trafikskola, och dig som kund/elev, nedan kallad kund. I avtalet benämns angivna avtalsparter i förening “parterna”.",
      "Trafikskolan har följande webbplatser vilka omfattas av dessa allmänna villkor:",
      "- Hemsida: www.kornu.se",
      "- Läromedel och E-handel: www.trafikskolaonline.se/sv/skola/kornu",
      "## §1 Avtal",
      "När kund köper, bokar, anmäler sig eller skriver in sig, antingen själv eller via trafikskolans personal, ingås avtal med trafikskolan och kunden samtycker till dessa allmänna villkor.",
      "## §2 Minderårig",
      "En kund som är under 18 år måste enligt lag ha sina föräldrars eller förmyndares samtycke för att ingå avtal med trafikskolan. Om samtycke inte kan ske på annat godtagbart sätt ska kunden uppvisa ett intyg från sina föräldrar eller förmyndare. Trafikskolan dokumenterar hur kunden har identifierat sig.",
      "## §3 Dataskyddsförordningen (GDPR)",
      "Dataskyddsförordningen (General Data Protection Regulation) gäller som lag i alla EU:s medlemsländer från och med den 25 maj 2018. Förordningen reglerar trafikskolans användning av kunds personuppgifter och stärker rättigheterna för kunden när det gäller personlig integritet. Denna paragraf handlar om hur trafikskolan tillämpar denna förordning.",
      "### Personuppgifter vid försäljning",
      "Trafikskolan lagrar namn och adress som krävs för att skapa ett korrekt kvitto enligt bokföringslagens krav på en kontantfaktura. E-post lagras för att kunna sända kvitto till kunden. Uppgifterna lagras i sju år innan de raderas.",
      "### Personuppgifter vid utbildning",
      "Trafikskolan sparar namn, adress, telefonnummer, personnummer enligt trafikförordningens krav på trafikskolan. E-post lagras för att kunna sända lektionstider till kunden. Kunden loggar även in i sitt läromedel med sin e-postadress. Uppgifter om utbildningen lagras för att kunna genomföra en utbildning i enlighet med Transportstyrelsens krav på utbildningsplan och dokumentation. Vi lagrar inga känsliga uppgifter i samband med utbildningen, utöver personnummer, som till exempel personuppgifter som avslöjar etniskt ursprung, politiska åsikter, religiös eller filosofisk övertygelse eller uppgifter om sexualliv,  hälsa, t ex ADHD. Om du går på en anpassad utbildning, t ex för dyslexi, lagras information om detta.",
      "### Behandling av personuppgifter",
      "Personuppgifter hanteras endast av trafikskolans personal, myndighetsperson vid eventuell tillsyn samt eventuellt underleverantörer med speciella avtal, som ansvarar för datasystem eller liknande. Uppgifterna delas aldrig med någon övrig tredje part utan samtycke.",
      "### Samtycke till lagring av personuppgifter",
      "Inhämtning av samtycke till lagring av personuppgifter sker i enlighet med §1. Trafikskolan dokumenterar hur kunden har samtyckt. I samband med utskick av information, marknadsföring, från trafikskola till kund kan kund ange att man inte önskar denna typ av utskick. Obligatoriska utskick, t ex lektionstider och kvitton, kan inte väljas bort.",
      "### Utdrag av personuppgifter",
      "Kund kan begära att få ett utdrag av vad som finns lagrat om kunden. Trafikskolan ska då skyndsamt till kunden skapa en PDF med denna information.",
      "### Begäran om ändring av personuppgifter",
      "Kund kan begära att trafikskolan ändrar lagrade personuppgifter. Kund ska då tala om för trafikskolan vad som ska ändras. Trafikskolan ska då skyndsamt ändra personuppgifterna. Om någon personuppgift inte går att ändra på grund av rättsliga krav kommer kunden att få besked om detta.",
      "### Begäran om radering av personuppgifter",
      "Kund kan begära att trafikskolan raderar lagrade personuppgifter. Trafikskolan kommer då att skyndsamt radera uppgifterna. Om någon personuppgift inte går att radera på grund av rättsliga krav kommer kunden att få besked om detta.",
      "### Kund ändrar någon av sina tidigare uppgivna personuppgifter",
      "Kund ska alltid informera trafikskolan vid byte av adress, telefonnummer eller e-postadress under aktiv utbildning. Om trafikskolan behöver meddela kunden viktig information och inte får kontakt via angivna kontaktuppgifter kan trafikskolan inte hållas ansvarig för detta.",
      "### Säkerhet vid lagring av personuppgifter",
      "All data lagras på säkra servers inom EU som sköts av Trafikskola Online AB och dess underleverantör Microsoft Azure som är certifierat av ISO 27018. Trafikskola Online jobbar aktivt för hög säkerhet kring de personuppgifter som lagras. Endast personal som har speciella avtal har möjlighet att hantera trafikskolans uppgifter.",
      "### Incidenter med personuppgifter",
      "Om trafikskolan utsätts för intrång eller någon enhet förloras vid t ex stöld nollställs omgående enhetens inloggningsuppgifter. Inga data lagras på enheten. Vid omfattande dataintrång i systemet finns rutiner för att undersöka och säkerställa en fortsatt hög säkerhet. Vissa uppgifter, t ex lösenordet, är krypterade.",
      "Trafikskolan lagrar inte uppgifter av den typ som gör att ett dataintrång medför risker för enskildas fri- och rättigheter och behöver därför inte anmälas till tillsynsmyndighet inom 72 timmar.",
      "## §4 Bokningsregler",
      "En bokning är bindande.",
      "Av- eller ombokning av bokade tider måste ske senast klockan 13 vardagen innan bokad tid. Vid senare av- eller ombokning debiteras fullt avgift.",
      "Vid förhållande man inte kan råda över, t ex akut sjukdom, debiteras ingen avgift vid uppvisande av sjukintyg.",
      "## §5 Köp och priser",
      "Minderåriga (under 18 år) får ej genomföra köp utan målsmans godkännande. Återbetalning vid förskottsbetalning sker mot avgift på 10% av beloppet under förutsättning att övriga regler kring exempelvis avbokning har följts.",
      "Aktuella priser redovisas på trafikskolans webbplatser. Priserna kan ändras under utbildningens gång. Ibland krävs förskottsbetalning för att priset ska gälla. Alla priser är i SEK inklusive moms.",
      "Köpt tjänst, i form av exempelvis paket, är giltigt till samma pris i 1 år från inköpsdatum.",
      "Köp som genomförs online på distans omfattas av lagen om distansavtal och avtal utanför affärslokaler (lag 2005:59). Du har rätt att ångra detta inom 14 dagar från det att avtalet ingicks. Detta gäller ej tjänster som redan förbrukats, t ex digitalt material som aktiverats. För att utöva din ångerrätt måste du skicka ett klart och tydligt meddelande om ditt beslut att frånträda avtalet innan ångerfristen löper ut. Meddelandet skickas till trafikskolan via e-post.",
      "## §6 Personligt användarkonto för utbildning",
      "En kund som skrivs in på skolan som elev kan få ett användarkonto med möjlighet att nyttja bland annat trafikskolans läromedel. Användarkontot är personligt. Inloggning & lösenord ska endast användas av den elev det är avsett för. Eleven har ansvar för att välja ett säkert lösenord och skydda detta. Trafikskolan är inte ansvarig för eventuell skada som uppstår om någon utomstående loggar in och använder elevens konto.",
      "I regel gäller fritt personligt bruk av trafikskolans tjänster när användarkontot är aktivt. Detta förutsätter dock att bruket faller inom ramen för vad som kan anses vara rimligt för en elev, dess handledare och trafiklärare. Trafikskolan förbehåller sig rätten att stänga av kontot om det överskrider gränsen för rimligt bruk. Vid stängning av konto ska trafikskolan informera eleven, via av eleven angiven e-postadress, på vilket sätt man överskridit gränsen för bruk. Finns det en adekvat förklaring till den höga brukandegraden kan användarkontot återaktiveras.",
      "## §7 Upphovsrätt och nyttjanderätt",
      "Allt material på trafikskolans webbplatser är skyddat av lagen om upphovsrätt. Materialet får endast användas för privat bruk i samband med att man använder tjänsten. Det är inte tillåtet att kopiera, överlåta, hyra ut, ändra, vidaresälja eller på annat vis använda materialet på ett kommersiellt eller icke kommersiellt sätt.",
      "## §8 Friskrivning från ansvar",
      "Trafikskolan tar inte ansvar för avgifter som kan tillkomma vid påminnelse eller inkassokrav om eleven ej uppgett korrekta uppgifter, detta gäller även elevens e-postadress.",
      "## §9 Ändringar av dessa villkor",
      "Allmänna villkor och köpevillkor kan komma att ändras under utbildningen. Trafikskolan ska informera eleven om eventuella ändringar. Allmänna villkor publiceras alltid på vår webbplats. Köpevillkoren visas alltid i samband med bokning eller köp.",
      "## §10 Tvister",
      "Trafikskolan ska göra allt man kan för att man som elev ska bli nöjd. Som elev har man ett ansvara att följa de regler som finns.",
      "Vid tvister gäller svensk lag för trafikskolans anmälnings- och köpevillkor. Tvister som avser giltighet, tolkning och tillämpning ska avgöras i första hand med hjälp av \"Allmänna reklamationsnämnden\" och i andra hand, i allmän domstol, varvid närmaste tingsrätt ska vara första instans.",
      "## §11 Trafikskolans uppgifter",
      "Kör nu Trafikskola AB (984)\nF O Petersons gata 6\n42131 Västra Frölunda\n559288-1386\n031 386 00 86\nhttp://kornu.se\ninfo@kornu.se\n\nInnehar F-skattebevis",
    ],
  },
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
  reviewsUrl: string;
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
    header: { ecommerce: "E-Handel", studentLogin: "Elevinloggning", extraLabel: "Skriv in dig", extraPath: "/contact", showLanguage: true },
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
    reviewsUrl: "https://www.google.com/maps/search/?api=1&query=K%C3%B6r+Nu+Trafikskola+F+O+Petersons+Gata+6+V%C3%A4stra+Fr%C3%B6lunda",
    openingHours: DEFAULT_OPENING_HOURS,
    contactLabels: { phone: t.pay.phone, email: t.pay.email, org: "Org.nr" },
    buttons: { heroBook: "/packages", heroSecondary: "#paket", finalCta: "/packages", coursesLink: "/packages", galleryLink: "/gallery" },
    coursesLinkLabel: t.packages.tag,
    galleryLinkLabel: t.nav.gallery,
  };
}
