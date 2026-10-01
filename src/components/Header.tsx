import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { handleRouteClick } from "../routing";
import type { PagePath } from "../types";
import { languageOptions, useLanguage } from "../i18n";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Header({ path, onNavigate }: { path: PagePath; onNavigate: (path: PagePath) => void }) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang, t, site } = useLanguage();
  const activeLanguage = languageOptions.find((item) => item.code === lang) || languageOptions[0];

  const closeMenus = () => {
    setLangOpen(false);
  };

  const navLinkClass = (active: boolean) =>
    `whitespace-nowrap rounded-lg px-2 py-2 transition 2xl:px-3.5 ${active ? "bg-white text-primary shadow-sm" : "hover:bg-white/70 hover:text-primary"}`;
  const mobileLinkClass = (active: boolean) =>
    `rounded-xl px-4 py-3 text-center text-sm font-semibold transition hover:bg-primary-50 ${active ? "bg-primary-50 text-primary" : "text-slate-800"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/88 px-3 py-2.5 shadow-[0_14px_48px_rgba(6,78,59,0.12)] backdrop-blur-2xl sm:gap-3 sm:px-4 lg:px-5 xl:gap-2 xl:px-3 2xl:max-w-[96rem] 2xl:gap-3 2xl:px-5">
        <a
          href="/"
          onClick={(e) => handleRouteClick(e, "/", onNavigate)}
          className="flex shrink-0 items-center rounded-xl bg-white/75 px-1.5 py-1 transition hover:scale-[1.01] sm:px-3 sm:py-1.5 xl:px-2 2xl:px-3"
          aria-label={site.siteName}
        >
          <Logo className="h-8 sm:h-11 xl:h-10 2xl:h-12" />
        </a>

        <nav className="hidden min-w-0 items-center rounded-xl bg-slate-950/[0.035] p-1 text-xs font-semibold text-slate-700 xl:flex">
          {site.nav.map((item) => (
            <a
              key={`${item.path}-${item.label}`}
              href={item.path}
              onClick={(e) => handleRouteClick(e, item.path, onNavigate)}
              className={navLinkClass(path === item.path)}
            >
              {item.label}
            </a>
          ))}
          {site.header.extraLabel && <a href={site.header.extraPath} onClick={(event) => handleRouteClick(event, site.header.extraPath, onNavigate)} className={navLinkClass(false)}>{site.header.extraLabel}</a>}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 xl:gap-1.5 2xl:gap-3">
          {site.header.showLanguage && <div className="relative hidden lg:block">
            <button
              onClick={() => {
                setLangOpen((value) => !value);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition xl:gap-1.5 xl:px-2.5 2xl:gap-2 2xl:px-3 hover:border-primary-100 hover:bg-primary-50 hover:text-primary"
              aria-expanded={langOpen}
            >
              <span className="text-base xl:hidden 2xl:inline">🌐</span>
              <span>{activeLanguage.flag}</span>
              <svg className={`h-3.5 w-3.5 transition ${langOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                {languageOptions.map((option) => (
                  <button key={option.code} onClick={() => { setLang(option.code); closeMenus(); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition hover:bg-primary-50 hover:text-primary ${lang === option.code ? "bg-primary-50 text-primary" : "text-slate-700"}`}>
                    <span className="text-lg">{option.flag}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>}

          <div className="hidden items-center gap-2 whitespace-nowrap lg:flex xl:gap-1 2xl:gap-2">
            <a href={site.links.ecommerce} target="_blank" rel="noopener noreferrer" className="rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 xl:px-2 2xl:px-2.5 transition hover:bg-primary-50 hover:text-primary">{site.header.ecommerce}</a>
            <a href={site.links.studentLogin} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-primary-100 bg-primary-50 px-2.5 py-2 text-xs font-bold text-primary-dark xl:px-2 2xl:px-2.5 transition hover:bg-primary-100">{site.header.studentLogin}</a>
          </div>

          <a href={site.phone.href} aria-label={site.phone.display} className="hidden items-center gap-2 whitespace-nowrap rounded-xl px-2 py-2 text-sm font-bold text-slate-800 transition hover:bg-primary-50 lg:flex">
            <Icon name="phone" className="h-4 w-4 text-primary" />
            <span className="hidden 2xl:inline">{site.phone.display}</span>
          </a>
          <a href={site.links.booking} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-white shadow-[0_10px_28px_rgba(11,132,87,0.25)] transition hover:-translate-y-0.5 hover:bg-primary-600 sm:px-5 sm:text-sm xl:px-3.5 xl:text-xs 2xl:px-5 2xl:text-sm">
            {t.nav.book}
          </a>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-950/[0.04] text-slate-800 transition hover:bg-primary-50 xl:hidden" aria-label="Meny" aria-expanded={open}>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} /></svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mx-auto mt-2 max-h-[calc(100vh-6rem)] max-w-7xl overflow-y-auto rounded-2xl border border-white/70 bg-white/96 p-3 shadow-xl backdrop-blur-xl xl:hidden">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {site.nav.map((item) => (
                <a key={`${item.path}-${item.label}`} href={item.path} onClick={(e) => { handleRouteClick(e, item.path, onNavigate); setOpen(false); }} className={mobileLinkClass(path === item.path)}>{item.label}</a>
              ))}
              {site.header.extraLabel && <a href={site.header.extraPath} onClick={(event) => { handleRouteClick(event, site.header.extraPath, onNavigate); setOpen(false); }} className={mobileLinkClass(false)}>{site.header.extraLabel}</a>}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 sm:grid-cols-3 lg:hidden">
              <a href={site.links.ecommerce} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-primary-50 px-4 py-3 text-center text-sm font-semibold text-primary">{site.header.ecommerce}</a>
              <a href={site.links.studentLogin} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-primary-50 px-4 py-3 text-center text-sm font-semibold text-primary">{site.header.studentLogin}</a>
              <a href={site.phone.href} className="col-span-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-primary-50 sm:col-span-1">
                <Icon name="phone" className="h-4 w-4 text-primary" />
                {site.phone.display}
              </a>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2 border-t border-slate-100 pt-3 lg:hidden">
              {languageOptions.map((option) => (
                <button key={option.code} onClick={() => setLang(option.code)} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition hover:bg-primary-50 hover:text-primary ${lang === option.code ? "bg-primary-50 text-primary" : "text-slate-700"}`}>
                  <span className="text-lg">{option.flag}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
