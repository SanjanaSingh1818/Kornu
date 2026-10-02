/**
 * Copies all current local website content into Sanity (all 3 languages + images).
 *
 *   npm run seed:sanity -- --dry-run   # print what would be written
 *   npm run seed:sanity                # write to Sanity (needs SANITY_WRITE_TOKEN)
 *
 * Re-running overwrites the seeded documents with the local content again.
 * Packages & prices are not seeded: they stay in Stripe.
 */
import "dotenv/config";
import { createReadStream, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { translations, type Translations } from "../src/content/translations";
import { defaultSite, type Site } from "../src/content/defaults";

const dryRun = process.argv.includes("--dry-run");
const policiesOnly = process.argv.includes("--policies-only");
const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!dryRun && (!projectId || !token)) {
  console.error("Set VITE_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env (see .env.example), or run with --dry-run.");
  process.exit(1);
}

const client = dryRun ? null : createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false });

const LANGS = ["sv", "en", "ar"] as const;
const T = { sv: translations.sv, en: translations.en, ar: translations.ar };
const SITE = { sv: defaultSite(T.sv), en: defaultSite(T.en), ar: defaultSite(T.ar) };

type Get<S> = (source: S) => string | undefined;
const locale = <S>(type: "localeString" | "localeText", sources: Record<(typeof LANGS)[number], S>, get: Get<S>) =>
  Object.fromEntries([["_type", type], ...LANGS.map((lang) => [lang, get(sources[lang]) ?? ""])]);
const ls = (get: Get<Translations>) => locale("localeString", T, get);
const lt = (get: Get<Translations>) => locale("localeText", T, get);
const lsSite = (get: Get<Site>) => locale("localeString", SITE, get);
const same = (value: string) => ({ _type: "localeString", sv: value, en: value, ar: value });
const swedishOnly = (type: "localeString" | "localeText", value: string) => ({ _type: type, sv: value, en: "", ar: "" });
const keyed = <V extends object>(items: V[], prefix: string) => items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));
const header = (key: keyof Translations["pages"]) => ({
  eyebrow: ls((t) => t.pages[key][0]), title: ls((t) => t.pages[key][1]), text: lt((t) => t.pages[key][2]),
});

// ---- images --------------------------------------------------------------
const uploaded = new Map<string, string>();
async function image(publicPath: string, hotspot?: string) {
  let ref = uploaded.get(publicPath);
  if (!ref) {
    const file = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
    if (!existsSync(file)) throw new Error(`Image not found: ${file}`);
    if (client) {
      const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
      ref = asset._id;
    } else {
      ref = `image-dry-run-${path.basename(file)}`;
    }
    uploaded.set(publicPath, ref);
    console.log(`  image ${publicPath}`);
  }
  const result: Record<string, unknown> = { _type: "image", asset: { _type: "reference", _ref: ref } };
  if (hotspot) {
    const [x, y] = hotspot.split(" ").map((v) => parseFloat(v) / 100);
    result.hotspot = { _type: "sanity.imageHotspot", x, y, width: 0.6, height: 0.6 };
  }
  return result;
}

// ---- documents -----------------------------------------------------------
async function buildDocuments() {
  const sv = SITE.sv;
  const docs: Record<string, unknown>[] = [];
  const add = (doc: Record<string, unknown>) => docs.push(doc);

  add({
    _id: "siteSettings", _type: "siteSettings",
    siteName: sv.siteName,
    logo: await image(sv.logo),
    seoTitle: same(sv.seo.title),
    seoDescription: { ...same(sv.seo.description), _type: "localeText" },
    seoImage: await image(sv.seo.image),
    phoneDisplay: sv.phone.display,
    phoneLink: sv.phone.href,
    email: sv.email,
    address: sv.address,
    mapsUrl: sv.mapsUrl,
    orgNumber: sv.orgNumber,
    openingHours: keyed(sv.openingHours.map((h) => ({ days: same(h.days), hours: same(h.hours) })), "h"),
    social: keyed(sv.social, "s"),
    copyright: sv.copyright,
  });

  add({
    _id: "navigation", _type: "navigation",
    items: keyed(sv.nav.map((item, i) => ({ label: lsSite((s) => s.nav[i].label), link: item.href })), "n"),
    extraLabel: same(sv.header.extraLabel),
    extraPath: sv.header.extraPath,
    ecommerceLabel: same(sv.header.ecommerce),
    ecommerceUrl: sv.links.ecommerce,
    studentLoginLabel: same(sv.header.studentLogin),
    studentLoginUrl: sv.links.studentLogin,
    bookLabel: ls((t) => t.nav.book),
    bookUrl: sv.links.booking,
    showLanguage: true,
  });

  add({
    _id: "footer", _type: "footer",
    text: lt((t) => t.footer.text), quick: ls((t) => t.footer.quick), courses: ls((t) => t.footer.courses),
    contact: ls((t) => t.footer.contact), rights: ls((t) => t.footer.rights), city: ls((t) => t.footer.city),
    courseLinks: keyed(sv.footerCourseLinks.map((item, i) => ({ label: lsSite((s) => s.footerCourseLinks[i].label), link: item.href })), "c"),
    helpLinks: keyed(sv.footerHelpLinks.map((item, i) => ({ label: same(item.label), link: item.href })), "h"),
    legalLinks: keyed(sv.footerLegalLinks.map((item, i) => ({ label: same(item.label), link: item.href })), "l"),
    social: [],
    drivingLicenceUrl: sv.drivingLicenceUrl,
  });
  for (const page of sv.infoPages) {
    add({
      _id: page.id, _type: page.id,
      title: same(page.title),
      paragraphs: keyed(page.paragraphs.map((paragraph) => ({ _type: "localeText", sv: paragraph, en: "", ar: "" })), "p"),
    });
  }

  add({ _id: "homePage", _type: "homePage", sections: sv.homeSections });
  add({
    _id: "heroSection", _type: "heroSection",
    badge: ls((t) => t.hero.badge), titleA: ls((t) => t.hero.titleA), titleB: ls((t) => t.hero.titleB), text: lt((t) => t.hero.text),
    bookLabel: ls((t) => t.hero.book), bookLink: sv.buttons.heroBook,
    packagesLabel: ls((t) => t.hero.packages), packagesLink: sv.buttons.heroSecondary,
    image: await image(sv.images.hero), imageAlt: same(sv.images.heroAlt),
    stats: keyed(T.sv.hero.stats.map((_, i) => ({ value: ls((t) => t.hero.stats[i]?.[0]), label: ls((t) => t.hero.stats[i]?.[1]) })), "st"),
  });
  add({
    _id: "benefitsSection", _type: "benefitsSection",
    items: keyed(T.sv.benefits.map((b, i) => ({ title: ls((t) => t.benefits[i]?.[0]), text: lt((t) => t.benefits[i]?.[1]), icon: b[2] })), "b"),
  });
  add({
    _id: "journeySection", _type: "journeySection",
    tag: ls((t) => t.journey.tag), title: ls((t) => t.journey.title), text: lt((t) => t.journey.text),
    steps: keyed(T.sv.journey.steps.map((_, i) => ({ label: ls((t) => t.journey.steps[i]?.[0]), detail: lt((t) => t.journey.steps[i]?.[1]) })), "j"),
    carImage: await image(sv.images.car),
  });

  const courses = [];
  for (const [i, course] of sv.courses.entries()) {
    courses.push({
      _key: `course${i}`, _type: "courseCard",
      title: lsSite((s) => s.courses[i].title), text: { ...lsSite((s) => s.courses[i].text), _type: "localeText" }, price: lsSite((s) => s.courses[i].price),
      image: await image(course.image), url: course.url,
    });
  }
  add({
    _id: "coursesPage", _type: "coursesPage", header: header("courses"),
    linkLabel: lsSite((s) => s.coursesLinkLabel), link: sv.buttons.coursesLink, defaultBookingUrl: sv.links.coursesBooking, courses,
  });
  const photos = [];
  for (const [i, photo] of sv.gallery.entries()) {
    photos.push({ _key: `photo${i}`, _type: "galleryPhoto", image: await image(photo.src), title: same(photo.title), tag: same(photo.tag) });
  }
  add({
    _id: "galleryPage", _type: "galleryPage", header: header("gallery"),
    linkLabel: lsSite((s) => s.galleryLinkLabel), link: sv.buttons.galleryLink, photos,
    photosLabel: ls((t) => t.galleryUi.photos),
  });
  add({
    _id: "packagesPage", _type: "packagesPage", header: header("packages"),
    ...Object.fromEntries((["tag", "title", "popular", "price", "buy", "readMore", "moreBenefits", "help", "call"] as const).map((k) => [k, ls((t) => t.packages[k])])),
    text: lt((t) => t.packages.text),
  });
  add({
    _id: "simulatorPage", _type: "simulatorPage", header: header("simulator"),
    tag: ls((t) => t.simulator.tag), title: ls((t) => t.simulator.title), text: lt((t) => t.simulator.text), start: ls((t) => t.simulator.start),
    chips: keyed(sv.simulatorChips.map((_, i) => lsSite((s) => s.simulatorChips[i])), "ch"),
    image: await image(sv.images.simulator), imageAlt: same(sv.images.simulatorAlt),
  });
  add({
    _id: "aboutPage", _type: "aboutPage",
    eyebrow: ls((t) => t.about.eyebrow), title: ls((t) => t.about.title),
    paragraphs: keyed(T.sv.about.paragraphs.map((_, i) => lt((t) => t.about.paragraphs[i])), "p"),
    findUs: ls((t) => t.about.findUs), mapsUrl: sv.aboutMapsUrl,
    image: await image(sv.images.about), imageAlt: ls((t) => t.about.imageAlt),
  });
  add({
    _id: "contactPage", _type: "contactPage", header: header("contact"),
    phoneLabel: ls((t) => t.pay.phone), emailLabel: ls((t) => t.pay.email), orgLabel: same(sv.contactLabels.org),
  });
  add({
    _id: "paymentPages", _type: "paymentPages",
    checkout: ls((t) => t.pay.checkout), successPending: ls((t) => t.pay.successPending), successPendingText: lt((t) => t.pay.successPendingText),
    cancelled: ls((t) => t.pay.cancelled), cancelledText: lt((t) => t.pay.cancelledText),
  });

  add({
    _id: "quizSection", _type: "quizSection",
    ...Object.fromEntries((["tag", "title", "all", "question", "result", "next", "retry", "good", "practice", "got", "of", "correct"] as const).map((k) => [k, ls((t) => t.quiz[k])])),
    text: lt((t) => t.quiz.text),
    questions: T.sv.quiz.questions.map((q, i) => ({
      _key: `q${i}`, _type: "quizQuestion",
      category: ls((t) => t.quiz.questions[i]?.category), question: ls((t) => t.quiz.questions[i]?.question),
      options: keyed(q.options.map((_, j) => ls((t) => t.quiz.questions[i]?.options[j])), "o"),
      correct: q.correct + 1,
      explanation: lt((t) => t.quiz.questions[i]?.explanation),
    })),
  });
  add({
    _id: "brakingSection", _type: "brakingSection",
    ...Object.fromEntries((["tag", "title", "variables", "speed", "choose", "stopping", "reaction", "braking", "total"] as const).map((k) => [k, ls((t) => t.braking[k])])),
    text: lt((t) => t.braking.text),
    conditions: keyed(T.sv.braking.conditions.map((_, i) => ls((t) => t.braking.conditions[i])), "rc"),
  });
  add({
    _id: "reviewsSection", _type: "reviewsSection",
    tag: ls((t) => t.reviews.tag), title: ls((t) => t.reviews.title), based: ls((t) => t.reviews.based), verified: ls((t) => t.reviews.verified), rating: sv.reviewRating,
    items: sv.reviews.map((review, i) => ({
      _key: `r${i}`, _type: "reviewItem", author: review.author, initials: review.initials, rating: review.rating,
      time: lsSite((s) => s.reviews[i].time), text: { ...lsSite((s) => s.reviews[i].text), _type: "localeText" },
    })),
  });
  add({
    _id: "visitSection", _type: "visitSection",
    ...Object.fromEntries((["tag", "title", "address", "contact", "hours", "open"] as const).map((k) => [k, ls((t) => t.visit[k])])),
    text: lt((t) => t.visit.text), schedule: lt((t) => t.visit.schedule),
  });
  add({ _id: "finalCta", _type: "finalCta", ...Object.fromEntries((["tag", "title", "button", "location"] as const).map((k) => [k, ls((t) => t.final[k])])), buttonLink: sv.buttons.finalCta });
  const trainers = [];
  for (const [i, trainer] of sv.trainers.entries()) {
    trainers.push({
      _key: `t${i}`, _type: "trainerItem", name: trainer.name, languages: trainer.languages,
      experience: same(trainer.experience), role: same(trainer.role), quote: { ...same(trainer.quote), _type: "localeText" },
      image: await image(trainer.image, trainer.position),
    });
  }
  add({
    _id: "trainersSection", _type: "trainersSection",
    tag: same(sv.trainersText.tag), title: same(sv.trainersText.title), highlight: same(sv.trainersText.highlight), languagesLabel: same(sv.trainersText.languagesLabel),
    trainers,
  });
  const formKeys = Object.keys(T.sv.contactForm) as (keyof Translations["contactForm"])[];
  add({
    _id: "contactForm", _type: "contactForm",
    ...Object.fromEntries(formKeys.map((k) => [k, k === "text" ? lt((t) => t.contactForm[k]) : ls((t) => t.contactForm[k])])),
    transmission: ls((t) => t.pay.transmission), manual: ls((t) => t.pay.manual), automatic: ls((t) => t.pay.automatic),
    image: await image(sv.images.contactForm),
  });

  return docs;
}

async function main() {
  console.log(dryRun ? "Dry run: nothing is written." : `Seeding ${projectId}/${dataset}…`);
  if (policiesOnly) {
    if (!client) {
      console.log(`Would create ${SITE.sv.infoPages.length} separate Swedish page documents if they do not already exist.`);
      return;
    }
    const legacy = await client.fetch<{ pages?: Array<{ slug?: string; title?: unknown; paragraphs?: unknown[] }> } | null>("*[_id == 'policyPages'][0]{pages}");
    for (const page of SITE.sv.infoPages) {
      const previous = legacy?.pages?.find((item) => item.slug === page.path.slice(1));
      await client.createIfNotExists({
        _id: page.id,
        _type: page.id,
        title: previous?.title ?? swedishOnly("localeString", page.title),
        paragraphs: previous?.paragraphs?.length
          ? previous.paragraphs
          : keyed(page.paragraphs.map((paragraph) => swedishOnly("localeText", paragraph)), "p"),
      });
    }
    console.log(`Done: initialized ${SITE.sv.infoPages.length} separate pages if missing; existing page documents and legacy text were preserved.`);
    return;
  }
  const docs = await buildDocuments();
  if (!client) {
    const out = path.join(process.cwd(), "sanity-seed-preview.json");
    writeFileSync(out, JSON.stringify(docs, null, 2));
    console.log(`${docs.length} documents written to ${out}`);
    return;
  }
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc as { _id: string; _type: string });
  await tx.commit();
  console.log(`Done: ${docs.length} documents, ${uploaded.size} images.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
