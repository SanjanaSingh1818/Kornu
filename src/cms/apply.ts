// Maps Sanity documents onto the local content shapes. Any field left empty in
// Sanity keeps its local fallback value, so a partly filled dataset is safe.
import { HOME_SECTION_KEYS, type HomeSectionKey, type NavItem, type Site } from "../content/defaults";
import type { Lang, Translations } from "../content/translations";
import type { PagePath } from "../types";
import type { CmsData } from "./sanity";

type Any = CmsData | undefined | null;
const PAGE_PATHS: PagePath[] = ["/", "/courses", "/packages", "/simulator", "/gallery", "/about", "/contact"];

export function applyCms(lang: Lang, baseT: Translations, baseSite: Site, cms: CmsData | null): { t: Translations; site: Site } {
  if (!cms) return { t: baseT, site: baseSite };

  // Localised value: { sv, en, ar } objects pick the active language, falling back to Swedish.
  const loc = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      const v = value as Record<string, unknown>;
      const hit = [v[lang], v.sv, v.en, v.ar].find((x) => typeof x === "string" && x.trim());
      return typeof hit === "string" ? hit : "";
    }
    return "";
  };
  const str = (value: unknown, fallback: string) => loc(value) || fallback;
  const list = <S, T>(value: S[] | undefined | null, map: (item: S, index: number) => T, fallback: T[]): T[] =>
    Array.isArray(value) && value.length > 0 ? value.map(map) : fallback;
  const labels = <T extends Record<K, unknown>, K extends keyof T & string>(doc: Any, base: T, keys: K[]): T => {
    const next = { ...base };
    for (const key of keys) next[key] = str(doc?.[key], String(base[key])) as T[K];
    return next;
  };
  const header = (doc: Any, base: string[]) => [str(doc?.header?.eyebrow, base[0]), str(doc?.header?.title, base[1]), str(doc?.header?.text, base[2])];
  const path = (value: unknown, fallback: PagePath): PagePath => (PAGE_PATHS.includes(value as PagePath) ? (value as PagePath) : fallback);

  const { settings, navigation, footer, home, packagesPage, quizSection, brakingSection, reviewsSection, visitSection, finalCta, aboutPage, contactForm, paymentPages, simulatorPage, contactPage, trainersSection } = cms;
  const hero = home?.hero;
  const journey = home?.journey;
  const socialLinks = list(
    footer?.social,
    (s: Any) => ({ platform: s?.platform || "facebook", url: s?.url || "" }),
    list(settings?.social, (s: Any) => ({ platform: s?.platform || "facebook", url: s?.url || "" }), baseSite.social),
  );

  const t: Translations = {
    ...baseT,
    nav: { ...baseT.nav, book: str(navigation?.bookLabel, baseT.nav.book) },
    hero: {
      ...labels(hero, baseT.hero, ["badge", "titleA", "titleB", "text"]),
      book: str(hero?.bookLabel, baseT.hero.book),
      packages: str(hero?.packagesLabel, baseT.hero.packages),
      stats: list(hero?.stats, (s: Any) => [loc(s?.value), loc(s?.label)], baseT.hero.stats),
    },
    benefits: list(home?.benefits, (b: Any, i) => [loc(b?.title), loc(b?.text), b?.icon || baseT.benefits[i]?.[2] || "car"], baseT.benefits),
    journey: {
      ...labels(journey, baseT.journey, ["tag", "title", "text"]),
      steps: list(journey?.steps, (s: Any) => [loc(s?.label), loc(s?.detail)], baseT.journey.steps),
    },
    packages: labels(packagesPage, baseT.packages, ["tag", "title", "text", "popular", "price", "buy", "readMore", "moreBenefits", "help", "call"]),
    quiz: {
      ...labels(quizSection, baseT.quiz, ["tag", "title", "text", "all", "question", "result", "next", "retry", "good", "practice", "got", "of", "correct"]),
      questions: list(cms.quizQuestions, (q: Any, i) => ({
        id: i + 1,
        category: loc(q?.category),
        question: loc(q?.question),
        options: (q?.options ?? []).map(loc),
        correct: Math.max(0, Number(q?.correct ?? 1) - 1), // Studio numbers answers from 1
        explanation: loc(q?.explanation),
      }), baseT.quiz.questions),
    },
    simulator: labels(simulatorPage, baseT.simulator, ["tag", "title", "text", "start", "city", "motorway", "night"]),
    braking: {
      ...labels(brakingSection, baseT.braking, ["tag", "title", "text", "variables", "speed", "choose", "stopping", "reaction", "braking", "total"]),
      conditions: baseT.braking.conditions.map((fallback, i) => str(brakingSection?.conditions?.[i], fallback)),
    },
    reviews: {
      ...labels(reviewsSection, baseT.reviews, ["tag", "title", "based", "verified"]),
      items: list(cms.reviews, (r: Any) => [loc(r?.author), loc(r?.time), loc(r?.text), loc(r?.initials)], baseT.reviews.items),
    },
    visit: labels(visitSection, baseT.visit, ["tag", "title", "text", "address", "contact", "hours", "open", "schedule"]),
    final: labels(finalCta, baseT.final, ["tag", "title", "button", "location"]),
    pay: {
      ...labels(paymentPages, baseT.pay, ["checkout", "successPending", "successPendingText", "cancelled", "cancelledText"]),
      ...labels(contactForm, { transmission: baseT.pay.transmission, manual: baseT.pay.manual, automatic: baseT.pay.automatic }, ["transmission", "manual", "automatic"]),
      phone: str(contactPage?.phoneLabel, baseT.pay.phone),
      email: str(contactPage?.emailLabel, baseT.pay.email),
    } as Translations["pay"],
    footer: labels(footer, baseT.footer, ["text", "quick", "courses", "contact", "rights", "city"]),
    about: {
      ...labels(aboutPage, baseT.about, ["eyebrow", "title", "findUs", "imageAlt"]),
      text: baseT.about.text,
      paragraphs: list(aboutPage?.paragraphs, loc, baseT.about.paragraphs),
    },
    pages: {
      courses: header(cms.coursesPage, baseT.pages.courses),
      packages: header(packagesPage, baseT.pages.packages),
      gallery: header(cms.galleryPage, baseT.pages.gallery),
      simulator: header(simulatorPage, baseT.pages.simulator),
      contact: header(contactPage, baseT.pages.contact),
    },
    galleryUi: { photos: str(cms.galleryPage?.photosLabel, baseT.galleryUi.photos) },
    contactForm: labels(contactForm, baseT.contactForm, Object.keys(baseT.contactForm) as (keyof Translations["contactForm"])[]),
  };
  t.pay = { ...baseT.pay, ...t.pay };

  // Links moved from Site settings to the sections that show them; older data is still read.
  const ecommerceUrl = str(navigation?.ecommerceUrl, str(settings?.ecommerceUrl, baseSite.links.ecommerce));
  const studentLoginUrl = str(navigation?.studentLoginUrl, str(settings?.studentLoginUrl, baseSite.links.studentLogin));
  const bookingUrl = str(navigation?.bookUrl, str(settings?.bookingUrl, baseSite.links.booking));
  const coursesBooking = str(cms.coursesPage?.defaultBookingUrl, str(settings?.coursesBookingUrl, baseSite.links.coursesBooking));

  // "link" accepts pages and URLs; older documents only have "path".
  const navItem = (item: Any, fallback: NavItem): NavItem => ({ label: str(item?.label, fallback.label), href: str(item?.link, str(item?.path, fallback.href)) });
  const sections = (home?.sections ?? []).filter((key: string): key is HomeSectionKey => (HOME_SECTION_KEYS as readonly string[]).includes(key));

  const site: Site = {
    ...baseSite,
    siteName: str(settings?.siteName, baseSite.siteName),
    logo: settings?.logo || baseSite.logo,
    seo: {
      title: str(settings?.seoTitle, baseSite.seo.title),
      description: str(settings?.seoDescription, baseSite.seo.description),
      image: settings?.seoImage || baseSite.seo.image,
    },
    phone: { display: str(settings?.phoneDisplay, baseSite.phone.display), href: str(settings?.phoneLink, baseSite.phone.href) },
    email: str(settings?.email, baseSite.email),
    address: str(settings?.address, baseSite.address),
    mapsUrl: str(settings?.mapsUrl, baseSite.mapsUrl),
    aboutMapsUrl: str(aboutPage?.mapsUrl, baseSite.aboutMapsUrl),
    orgNumber: str(settings?.orgNumber, baseSite.orgNumber),
    social: ["facebook", "instagram", "tiktok"].map((platform) =>
      socialLinks.find((item) => item.platform === platform && item.url && item.url !== "#") ?? { platform, url: "" },
    ),
    links: { ecommerce: ecommerceUrl, studentLogin: studentLoginUrl, booking: bookingUrl, coursesBooking },
    header: {
      ecommerce: str(navigation?.ecommerceLabel, baseSite.header.ecommerce),
      studentLogin: str(navigation?.studentLoginLabel, baseSite.header.studentLogin),
      extraLabel: str(navigation?.extraLabel, baseSite.header.extraLabel),
      extraPath: path(navigation?.extraPath, baseSite.header.extraPath),
      showLanguage: navigation?.showLanguage ?? baseSite.header.showLanguage,
    },
    nav: list(navigation?.items, (item: Any, i) => navItem(item, baseSite.nav[i] ?? baseSite.nav[0]), baseSite.nav),
    footerCourseLinks: list(footer?.courseLinks, (item: Any, i) => navItem(item, baseSite.footerCourseLinks[i] ?? { label: "", href: "/courses" }), baseSite.footerCourseLinks),
    footerHelpLinks: list(footer?.helpLinks, (item: Any, i) => navItem(item, baseSite.footerHelpLinks[i] ?? { label: "", href: "/vanliga-fragor" }), baseSite.footerHelpLinks),
    footerLegalLinks: list(footer?.legalLinks, (item: Any, i) => navItem(item, baseSite.footerLegalLinks[i] ?? { label: "", href: "/integritetspolicy" }), baseSite.footerLegalLinks),
    drivingLicenceUrl: str(footer?.drivingLicenceUrl, baseSite.drivingLicenceUrl),
    infoPages: baseSite.infoPages.map((fallback) => {
      const page = (cms.policyPages ?? []).find((item: Any) => item?._id === fallback.id);
      const legacy = cms.legacyPolicyPages?.pages?.find((item: Any) => item?.slug === fallback.path.slice(1));
      const content = page ?? legacy;
      return {
        ...fallback,
        title: str(content?.title, fallback.title),
        paragraphs: list(content?.paragraphs, loc, fallback.paragraphs),
      };
    }),
    copyright: str(settings?.copyright, baseSite.copyright),
    homeSections: sections.length > 0 ? sections : baseSite.homeSections,
    images: {
      hero: hero?.image || baseSite.images.hero,
      heroAlt: str(hero?.imageAlt, baseSite.images.heroAlt),
      simulator: simulatorPage?.image || baseSite.images.simulator,
      simulatorAlt: str(simulatorPage?.imageAlt, baseSite.images.simulatorAlt),
      car: journey?.carImage || baseSite.images.car,
      about: aboutPage?.image || baseSite.images.about,
      contactForm: contactForm?.image || baseSite.images.contactForm,
    },
    simulatorChips: list(simulatorPage?.chips, loc, [`🏙️ ${t.simulator.city}`, `🛣️ ${t.simulator.motorway}`, `🌙 ${t.simulator.night}`]),
    courses: list(cms.courses, (c: Any, i) => {
      const fallback = baseSite.courses[i];
      return {
        title: str(c?.title, fallback?.title ?? ""),
        text: str(c?.text, fallback?.text ?? ""),
        price: str(c?.price, fallback?.price ?? ""),
        image: c?.image || fallback?.image || "",
        url: str(c?.url, coursesBooking),
      };
    }, baseSite.courses),
    gallery: list(cms.gallery, (g: Any) => ({ src: g?.image || "", title: loc(g?.title), tag: loc(g?.tag) }), baseSite.gallery).filter((g) => g.src),
    trainers: list(cms.trainers, (tr: Any) => ({
      name: loc(tr?.name),
      experience: loc(tr?.experience),
      role: loc(tr?.role),
      languages: loc(tr?.languages),
      quote: loc(tr?.quote),
      image: tr?.image || "",
      position: tr?.hotspot ? `${Math.round(tr.hotspot.x * 100)}% ${Math.round(tr.hotspot.y * 100)}%` : "50% 33%",
    }), baseSite.trainers),
    trainersText: labels(trainersSection, baseSite.trainersText, ["tag", "title", "highlight", "languagesLabel"]),
    reviews: list(cms.reviews, (r: Any) => ({ author: loc(r?.author), time: loc(r?.time), text: loc(r?.text), initials: loc(r?.initials), rating: Math.min(5, Math.max(1, Number(r?.rating ?? 5))) }), baseSite.reviews),
    reviewRating: str(reviewsSection?.rating, baseSite.reviewRating),
    reviewsUrl: str(reviewsSection?.googleUrl, baseSite.reviewsUrl),
    openingHours: list(settings?.openingHours, (h: Any) => ({ days: loc(h?.days), hours: loc(h?.hours) }), baseSite.openingHours),
    contactLabels: {
      phone: t.pay.phone,
      email: t.pay.email,
      org: str(contactPage?.orgLabel, baseSite.contactLabels.org),
    },
    buttons: {
      heroBook: str(hero?.bookLink, baseSite.buttons.heroBook),
      heroSecondary: str(hero?.packagesLink, baseSite.buttons.heroSecondary),
      finalCta: str(finalCta?.buttonLink, baseSite.buttons.finalCta),
      coursesLink: str(cms.coursesPage?.link, baseSite.buttons.coursesLink),
      galleryLink: str(cms.galleryPage?.link, baseSite.buttons.galleryLink),
    },
    coursesLinkLabel: str(cms.coursesPage?.linkLabel, baseSite.coursesLinkLabel),
    galleryLinkLabel: str(cms.galleryPage?.linkLabel, baseSite.galleryLinkLabel),
  };

  return { t, site };
}
