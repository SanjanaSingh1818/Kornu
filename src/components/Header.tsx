import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "../data";
import { handleRouteClick } from "../routing";
import type { PagePath } from "../types";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Header({ path, onNavigate, onBook }: { path: PagePath; onNavigate: (path: PagePath) => void; onBook: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/88 px-3 py-2.5 shadow-[0_14px_48px_rgba(6,78,59,0.12)] backdrop-blur-2xl sm:px-4 lg:px-5">
        <a
          href="/"
          onClick={(e) => handleRouteClick(e, "/", onNavigate)}
          className="flex shrink-0 items-center rounded-xl bg-white/75 px-2 py-1.5 transition hover:scale-[1.01] sm:px-3"
          aria-label="Kör Nu Trafikskola"
        >
          <Logo className="h-9 sm:h-11 lg:h-12" />
        </a>

        <nav className="hidden items-center rounded-xl bg-slate-950/[0.035] p-1 text-sm font-semibold text-slate-700 xl:flex">
          {NAV.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => handleRouteClick(e, item.path, onNavigate)}
              className={`rounded-lg px-3.5 py-2 transition ${path === item.path ? "bg-white text-primary shadow-sm" : "hover:bg-white/70 hover:text-primary"}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a href="tel:031-3860086" className="hidden items-center gap-2 whitespace-nowrap rounded-xl px-2 py-2 text-sm font-bold text-slate-800 transition hover:bg-primary-50 lg:flex">
            <Icon name="phone" className="h-4 w-4 text-primary" />
            031‑386 00 86
          </a>
          <button onClick={onBook} className="rounded-xl bg-primary px-3.5 py-2.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(11,132,87,0.25)] transition hover:-translate-y-0.5 hover:bg-primary-600 sm:px-5">
            <span className="sm:hidden">Boka</span>
            <span className="hidden sm:inline">Boka lektion</span>
          </button>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950/[0.04] text-slate-800 transition hover:bg-primary-50 xl:hidden" aria-label="Meny">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} /></svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mx-auto mt-2 grid max-w-7xl grid-cols-2 gap-2 rounded-2xl border border-white/70 bg-white/96 p-3 shadow-xl backdrop-blur-xl sm:grid-cols-3 xl:hidden">
            {NAV.map((item) => (
              <a key={item.path} href={item.path} onClick={(e) => { handleRouteClick(e, item.path, onNavigate); setOpen(false); }} className={`rounded-xl px-4 py-3 text-center text-sm font-semibold transition hover:bg-primary-50 ${path === item.path ? "bg-primary-50 text-primary" : "text-slate-800"}`}>{item.label}</a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
