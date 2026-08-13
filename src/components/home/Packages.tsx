import { motion } from "framer-motion";
import { PACKAGES } from "../../data";
import { useLanguage } from "../../i18n";
import type { Package } from "../../types";
import { Icon } from "../Icon";

export function Packages({ onSelect }: { onSelect: (p: Package) => void }) {
  const { t } = useLanguage();
  return (
    <section id="paket" className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[.22em] text-primary">{t.packages.tag}</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">{t.packages.title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{t.packages.text}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((p, i) => {
            const translated = t.packages.items[i];
            const name = translated?.[0] || p.name;
            const lessons = translated?.[1] || p.lessons;
            const includes = translated?.[2] || p.includes;
            return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * .04, duration: .55 }}
              className={`group relative flex min-h-[300px] cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-md transition hover:-translate-y-1.5 hover:shadow-xl ${p.popular ? "border-primary/40 ring-2 ring-primary/20" : "border-slate-200"}`}
              onClick={() => onSelect(p)}>
              <div className="absolute inset-0">
                <img src="/images/kornu.webp" alt={name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/58 to-transparent" />
              </div>
              {p.popular && (
                <span className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-primary-100 bg-white/95 px-3 py-1 text-[0.6rem] font-black uppercase tracking-wider text-primary-dark shadow">{t.packages.popular}</span>
              )}

              <div className="relative z-10 mt-auto flex flex-1 flex-col justify-end p-4">
                <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-white shadow-sm backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-wider text-primary-300">{name}</p>
                  <h3 className="mt-1 text-base font-black leading-tight text-white">{lessons}</h3>

                  <ul className="mt-3 space-y-1.5">
                    {includes.slice(0, 4).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[11px] font-medium leading-tight text-white/90">
                        <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-300" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/20 pt-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-white/60">{t.packages.price}</p>
                      <p className="text-lg font-black leading-none text-white">{p.price.toLocaleString("sv-SE")} kr</p>
                      {p.originalPrice && <p className="mt-1 text-xs font-semibold text-white/50 line-through">{p.originalPrice.toLocaleString("sv-SE")} kr</p>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onSelect(p); }} className="rounded-lg border border-white/30 bg-white/20 px-3 py-2 text-[10px] font-black text-white backdrop-blur-sm transition hover:bg-white/30">
                      {t.packages.buy}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );})}
        </div>

        <div className="mt-10 rounded-2xl border border-primary-200/40 bg-primary-50/60 p-6 text-center">
          <p className="text-sm font-semibold text-slate-700">
            <Icon name="phone" className="mr-2 inline-block h-4 w-4 text-primary" />
            {t.packages.help} {t.packages.call} <a href="tel:031-3860086" className="font-bold text-primary underline">031‑386 00 86</a> / <a href="mailto:info@kornu.se" className="font-bold text-primary underline">info@kornu.se</a>
          </p>
        </div>
      </div>
    </section>
  );
}
