import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PACKAGES } from "../../data";
import { useLanguage } from "../../i18n";
import type { Package, ProductCategory } from "../../types";
import { Icon } from "../Icon";

const categoryLabels: Record<ProductCategory, string> = {
  all: "Alla",
  "driving-lesson-package": "Körlektioner",
  "best-prices": "Bäst pris",
  courses: "Kurser",
  "start-up-package": "Startpaket",
  "total-package": "Totalpaket",
};

function normalizePackage(product: Partial<Package>): Package {
  const features = Array.isArray(product.features) && product.features.length > 0
    ? product.features
    : Array.isArray(product.includes) && product.includes.length > 0
      ? product.includes
      : [product.description ?? product.name ?? "Inkluderat"];

  return {
    id: product.id ?? "stripe-product",
    name: product.name ?? "Produkt",
    description: product.description ?? "Produkt från Kör Nu Trafikskola.",
    price: typeof product.price === "number" ? product.price : 0,
    currency: product.currency ?? "sek",
    priceId: product.priceId ?? "",
    lessons: product.lessons ?? "",
    duration: product.duration ?? "",
    features,
    popular: Boolean(product.popular),
    badge: product.badge,
    sortOrder: Number(product.sortOrder ?? 0),
    collections: Array.isArray(product.collections) ? product.collections : [],
    image: product.image ?? null,
    originalPrice: typeof product.originalPrice === "number" ? product.originalPrice : null,
    includes: Array.isArray(product.includes) && product.includes.length > 0 ? product.includes : features,
  };
}

function PackageCard({ pkg, index, onSelect, loading }: { pkg: Package; index: number; onSelect: (pkg: Package) => void; loading: boolean }) {
  const { t } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  const unitLabel = pkg.currency?.toUpperCase() === "SEK" ? "SEK" : pkg.currency?.toUpperCase() ?? "SEK";
  const features = pkg.features.length > 0 ? pkg.features : pkg.includes;
  const visibleIncludes = features.slice(0, 3);

  return (
    <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * .04, duration: .55 }} className={`group h-[430px] rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg [perspective:1200px] ${pkg.popular ? "border-primary-300 ring-1 ring-primary-300" : "border-slate-200"}`}>
      <div className={`relative h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="absolute inset-0 flex flex-col justify-between rounded-3xl bg-white p-6 [backface-visibility:hidden]">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-dark"><Icon name={index % 2 ? "calendar" : "car"} className="h-5 w-5" /></div>
              {(pkg.badge || pkg.popular) && (
                <span className="inline-flex max-w-[70%] items-center gap-1 rounded-full border border-primary-50 bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary-dark">
                  <Icon name="calendar" className="h-3 w-3 shrink-0 text-primary" />
                  <span className="truncate">{pkg.badge || (pkg.popular ? t.packages.popular : "")}</span>
                </span>
              )}
            </div>
            <button type="button" onClick={() => setFlipped(true)} className="group/title text-left"><h3 className="inline-flex items-start gap-1 text-lg font-extrabold leading-snug text-primary-dark transition group-hover/title:text-primary">{pkg.name}<span className="mt-1 text-primary opacity-0 transition group-hover/title:opacity-100">↗</span></h3></button>
            <p className="mt-3 line-clamp-3 text-xs font-medium leading-relaxed text-slate-500">{pkg.description}</p>
            <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">{visibleIncludes.map((item) => <li key={`${pkg.id}-${item}`} className="flex items-start gap-2 text-xs font-medium leading-5 text-slate-600"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <span className="text-[10px] font-bold uppercase text-slate-400">{t.packages.price}</span>
              <span className="text-xl font-black text-primary-dark">{pkg.price.toLocaleString("sv-SE")} {unitLabel}</span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setFlipped(true)} className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">{t.packages.readMore}</button>
              <button type="button" disabled={loading} onClick={() => onSelect(pkg)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-dark px-3 py-2.5 text-xs font-bold text-white shadow transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60">{loading ? "..." : t.packages.buy}<Icon name="arrow" className="h-3.5 w-3.5 text-primary-300" /></button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-primary-100 bg-white p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-primary">{t.packages.readMore}</p>
                <h3 className="mt-1 text-lg font-extrabold leading-snug text-primary-dark">{pkg.name}</h3>
              </div>
              <button type="button" onClick={() => setFlipped(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-dark" aria-label={t.pay.close}>×</button>
            </div>
            <p className="text-xs font-medium leading-relaxed text-slate-500">{pkg.description}</p>
            <div className="mt-4 rounded-2xl bg-primary-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-primary-dark">{pkg.duration || pkg.lessons || "Körlektioner"}</p>
            </div>
            <ul className="mt-4 max-h-36 space-y-2 overflow-y-auto pr-1">{features.map((item) => <li key={`${pkg.id}-detail-${item}`} className="flex items-start gap-2 text-xs font-medium leading-5 text-slate-600"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <span className="text-[10px] font-bold uppercase text-slate-400">{t.packages.price}</span>
              <span className="text-xl font-black text-primary-dark">{pkg.price.toLocaleString("sv-SE")} {unitLabel}</span>
            </div>
            <button type="button" disabled={loading} onClick={() => onSelect(pkg)} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-dark px-3 py-2.5 text-xs font-bold text-white shadow transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60">{loading ? "..." : t.packages.buy}<Icon name="arrow" className="h-3.5 w-3.5 text-primary-300" /></button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={`skeleton-${index}`} className="h-[430px] animate-pulse rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 h-10 w-10 rounded-xl bg-slate-200" />
          <div className="mb-4 h-5 w-2/3 rounded bg-slate-200" />
          <div className="mb-2 h-3 w-full rounded bg-slate-200" />
          <div className="mb-2 h-3 w-5/6 rounded bg-slate-200" />
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <div className="h-3 w-full rounded bg-slate-200" />
            <div className="h-3 w-4/5 rounded bg-slate-200" />
            <div className="h-3 w-2/3 rounded bg-slate-200" />
          </div>
          <div className="mt-8 h-8 rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function Packages({ onSelect, loading = false }: { onSelect: (pkg: Package) => void; loading?: boolean }) {
  const { t, site } = useLanguage();
  const [catalog, setCatalog] = useState<Package[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory>("all");
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "empty">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = async () => {
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/products");
      const payload = await response.json() as { products?: Partial<Package>[]; error?: string };

      if (!response.ok || !Array.isArray(payload.products)) {
        throw new Error(payload.error || "Kunde inte hämta paket från Stripe.");
      }

      const nextCatalog = payload.products.map(normalizePackage).filter((product) => product.id !== "payment-test");
      setCatalog(nextCatalog);
      setStatus(nextCatalog.length > 0 ? "ready" : "empty");
    } catch (fetchError) {
      // `npm run dev` does not run the Vercel /api functions, so show the built-in sample
      // packages locally. Production always uses Stripe and shows the error instead.
      if (import.meta.env.DEV) {
        console.info("[packages] /api/products unavailable in local dev; showing sample packages.", fetchError);
        setCatalog(PACKAGES.map(normalizePackage));
        setStatus("ready");
        return;
      }
      setCatalog([]);
      setStatus("error");
      setError(fetchError instanceof Error ? fetchError.message : "Kunde inte hämta paket.");
    }
  };

  useEffect(() => {
    void fetchCatalog();
  }, []);

  // Phone carousel: track which card is centred to highlight its dot.
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const onTrackScroll = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    const step = first.offsetWidth + 16; // card width + gap-4
    setActiveSlide(Math.round(Math.abs(track.scrollLeft) / step));
  };
  const goToSlide = (index: number) => {
    const card = trackRef.current?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const visiblePackages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return catalog.filter((pkg) => {
      const matchesCategory = category === "all" || pkg.collections.includes(category);
      const searchSource = [pkg.name, pkg.description, pkg.lessons, pkg.duration, pkg.features.join(" "), pkg.collections.join(" ")].filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = !normalizedQuery || searchSource.includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [catalog, category, query]);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    setActiveSlide(0);
  }, [category, query]);

  return (
    <section id="paket" className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[.22em] text-primary">{t.packages.tag}</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">{t.packages.title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{t.packages.text}</p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-4">
          <label className="relative block">
            <span className="sr-only">Search packages</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.packages.tag}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(categoryLabels) as [ProductCategory, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${category === value ? "border-primary-300 bg-primary-dark text-white" : "border-slate-200 bg-white text-slate-700 hover:border-primary-200 hover:text-primary-dark"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {status === "loading" && <div className="mt-10"><CatalogSkeleton /></div>}

        {status === "error" && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
            <p className="mb-3">{error || "Det gick inte att ladda paket från Stripe."}</p>
            <button type="button" onClick={() => void fetchCatalog()} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-500">Försök igen</button>
          </div>
        )}

        {status === "ready" && (
          <div className="-mx-4 mt-10 sm:mx-0">
            {/* Phones: swipeable carousel. sm and up: the regular grid. */}
            <div
              ref={trackRef}
              onScroll={onTrackScroll}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:snap-none sm:grid-cols-1 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-2 lg:grid-cols-3"
            >
              {visiblePackages.map((pkg, index) => (
                <div key={pkg.id} className="w-[84%] shrink-0 snap-center sm:w-auto">
                  <PackageCard pkg={pkg} index={index} onSelect={onSelect} loading={loading} />
                </div>
              ))}
            </div>
            {visiblePackages.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-2 sm:hidden">
                {visiblePackages.map((pkg, index) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`${index + 1} / ${visiblePackages.length}`}
                    className={`h-2 rounded-full transition-all duration-300 ${index === activeSlide ? "w-7 bg-primary-dark" : "w-2 bg-slate-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {status === "empty" && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-600">
            <p>Inga paket hittades.</p>
            <button type="button" onClick={() => { setQuery(""); setCategory("all"); }} className="mt-4 rounded-xl bg-primary-dark px-4 py-2 text-sm font-bold text-white transition hover:bg-primary">Återställ filter</button>
          </div>
        )}

        {status === "ready" && visiblePackages.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-600">
            <p>Inga paket matchar din filtrering just nu.</p>
            <button type="button" onClick={() => { setQuery(""); setCategory("all"); }} className="mt-4 rounded-xl bg-primary-dark px-4 py-2 text-sm font-bold text-white transition hover:bg-primary">Återställ filter</button>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-primary-200/40 bg-primary-50/60 p-6 text-center">
          <p className="text-sm font-semibold text-slate-700"><Icon name="phone" className="mr-2 inline-block h-4 w-4 text-primary" />{t.packages.help} {t.packages.call} <a href={site.phone.href} className="font-bold text-primary underline">{site.phone.display}</a> / <a href={`mailto:${site.email}`} className="font-bold text-primary underline">{site.email}</a></p>
        </div>
      </div>
    </section>
  );
}