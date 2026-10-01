import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { applyCms } from "./cms/apply";
import { fetchCms, readCachedCms, sanityEnabled, type CmsData } from "./cms/sanity";
import { defaultSite, type Site } from "./content/defaults";
import { languageOptions, translations, type Lang, type Translations } from "./content/translations";

export { languageOptions, translations, type Lang };

const LanguageContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void; t: Translations; site: Site } | null>(null);
const LANGUAGE_STORAGE_KEY = "kornu-lang-v2";

function isLang(value: string | null): value is Lang {
  return value === "sv" || value === "en" || value === "ar";
}

function setMeta(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute("content", value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLang(stored) ? stored : "sv";
  });
  const [cms, setCms] = useState<CmsData | null>(() => (sanityEnabled ? readCachedCms() : null));
  // Where the content on screen came from; exposed as <html data-content-source> for debugging.
  const [source, setSource] = useState<"sanity" | "cache" | "local">(() => (cms ? "cache" : "local"));

  useEffect(() => {
    if (!sanityEnabled) {
      console.info("[content] Sanity not configured (VITE_SANITY_PROJECT_ID missing): using local content.");
      return;
    }
    let cancelled = false;
    fetchCms()
      .then((data) => {
        if (cancelled || !data) return;
        setCms(data);
        setSource("sanity");
        console.info("[content] Loaded from Sanity.");
      })
      .catch((error) => console.warn("[content] Sanity content could not be loaded; using cached/local content.", error));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.contentSource = source;
  }, [source]);

  const { t, site } = useMemo(() => {
    const baseT = translations[lang] || translations.sv;
    return applyCms(lang, baseT, defaultSite(baseT), cms);
  }, [lang, cms]);

  const setLang = (next: Lang) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    setLangState(next);
  };

  useEffect(() => {
    const option = languageOptions.find((item) => item.code === lang) || languageOptions[0];
    document.documentElement.lang = lang;
    document.documentElement.dir = option.dir;
  }, [lang]);

  useEffect(() => {
    document.title = site.seo.title;
    setMeta('meta[name="description"]', site.seo.description);
    setMeta('meta[property="og:title"]', site.seo.title);
    setMeta('meta[property="og:description"]', site.seo.description);
    setMeta('meta[property="og:image"]', site.seo.image);
    setMeta('meta[name="twitter:title"]', site.seo.title);
    setMeta('meta[name="twitter:description"]', site.seo.description);
    setMeta('meta[name="twitter:image"]', site.seo.image);
    const icon = document.querySelector('link[rel="icon"]');
    icon?.removeAttribute("type");
    icon?.setAttribute("href", site.logo);
    document.querySelector('link[rel="apple-touch-icon"]')?.setAttribute("href", site.logo);
  }, [site]);

  const value = useMemo(() => ({ lang, setLang, t, site }), [lang, t, site]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
