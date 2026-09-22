import { useState } from "react";
import { motion } from "framer-motion";
import { PACKAGES } from "../../data";
import { useLanguage } from "../../i18n";
import type { Package } from "../../types";
import { Icon } from "../Icon";

function PackageCard({ pkg, index, onSelect, loading }: { pkg: Package; index: number; onSelect: (pkg: Package) => void; loading: boolean }) {
  const { t } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  const translated = t.packages.items[index];
  const name = typeof translated?.[0] === "string" ? translated[0] : pkg.name;
  const lessons = typeof translated?.[1] === "string" ? translated[1] : pkg.lessons;
  const includes = Array.isArray(translated?.[2]) ? translated[2] : pkg.includes;
  const description = t.packages.descriptions[index];
  const visibleIncludes = includes.slice(0, 3);

  return (
    <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * .04, duration: .55 }} className={`group h-[430px] rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg [perspective:1200px] ${pkg.popular ? "border-primary-300 ring-1 ring-primary-300" : "border-slate-200"}`}>
      <div className={`relative h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="absolute inset-0 flex flex-col justify-between rounded-3xl bg-white p-6 [backface-visibility:hidden]">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-dark"><Icon name={index % 2 ? "calendar" : "car"} className="h-5 w-5" /></div><span className="inline-flex max-w-[70%] items-center gap-1 rounded-full border border-primary-50 bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary-dark"><Icon name="calendar" className="h-3 w-3 shrink-0 text-primary" /><span className="truncate">{t.packages.durations[index] || lessons}</span></span></div>
            <button type="button" onClick={() => setFlipped(true)} className="group/title text-left"><h3 className="inline-flex items-start gap-1 text-lg font-extrabold leading-snug text-primary-dark transition group-hover/title:text-primary">{name}<span className="mt-1 text-primary opacity-0 transition group-hover/title:opacity-100">↗</span></h3></button>
            <p className="mt-3 line-clamp-3 text-xs font-medium leading-relaxed text-slate-500">{description}</p>
            <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">{visibleIncludes.map((item) => <li key={item} className="flex items-start gap-2 text-xs font-medium leading-5 text-slate-600"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul>
          </div>
          <div className="border-t border-slate-100 pt-4"><div className="mb-4 flex items-baseline justify-between gap-4"><span className="text-[10px] font-bold uppercase text-slate-400">{t.packages.price}</span><span className="text-xl font-black text-primary-dark">{pkg.price.toLocaleString("sv-SE")} SEK</span></div><div className="flex gap-2"><button type="button" onClick={() => setFlipped(true)} className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">{t.packages.readMore}</button><button type="button" disabled={loading} onClick={() => onSelect(pkg)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-dark px-3 py-2.5 text-xs font-bold text-white shadow transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60">{loading ? "..." : t.packages.buy}<Icon name="arrow" className="h-3.5 w-3.5 text-primary-300" /></button></div></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-primary-100 bg-white p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"><div><div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-wider text-primary">{t.packages.readMore}</p><h3 className="mt-1 text-lg font-extrabold leading-snug text-primary-dark">{name}</h3></div><button type="button" onClick={() => setFlipped(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-dark" aria-label={t.pay.close}>×</button></div><p className="text-xs font-medium leading-relaxed text-slate-500">{description}</p><div className="mt-4 rounded-2xl bg-primary-50 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-primary-dark">{lessons}</p></div><ul className="mt-4 max-h-36 space-y-2 overflow-y-auto pr-1">{includes.map((item) => <li key={item} className="flex items-start gap-2 text-xs font-medium leading-5 text-slate-600"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul></div><div className="border-t border-slate-100 pt-4"><div className="mb-4 flex items-baseline justify-between gap-4"><span className="text-[10px] font-bold uppercase text-slate-400">{t.packages.price}</span><span className="text-xl font-black text-primary-dark">{pkg.price.toLocaleString("sv-SE")} SEK</span></div><button type="button" disabled={loading} onClick={() => onSelect(pkg)} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-dark px-3 py-2.5 text-xs font-bold text-white shadow transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60">{loading ? "..." : t.packages.buy}<Icon name="arrow" className="h-3.5 w-3.5 text-primary-300" /></button></div></div>
      </div>
    </motion.article>
  );
}

export function Packages({ onSelect, loading = false }: { onSelect: (pkg: Package) => void; loading?: boolean }) {
  const { t } = useLanguage();
  return <section id="paket" className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-black uppercase tracking-[.22em] text-primary">{t.packages.tag}</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">{t.packages.title}</h2><p className="mt-4 text-sm leading-7 text-slate-600">{t.packages.text}</p></div><div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{PACKAGES.map((pkg, index) => <PackageCard key={pkg.id} pkg={pkg} index={index} onSelect={onSelect} loading={loading} />)}</div><div className="mt-10 rounded-2xl border border-primary-200/40 bg-primary-50/60 p-6 text-center"><p className="text-sm font-semibold text-slate-700"><Icon name="phone" className="mr-2 inline-block h-4 w-4 text-primary" />{t.packages.help} {t.packages.call} <a href="tel:031-3860086" className="font-bold text-primary underline">031‑386 00 86</a> / <a href="mailto:info@kornu.se" className="font-bold text-primary underline">info@kornu.se</a></p></div></div></section>;
}