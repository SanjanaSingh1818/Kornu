import { motion } from "framer-motion";
import { PACKAGES } from "../../data";
import type { Package } from "../../types";
import { Icon } from "../Icon";

export function Packages({ onSelect }: { onSelect: (p: Package) => void }) {
  return (
    <section id="paket" className="bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[.26em] text-primary">Paket & priser</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-dark sm:text-6xl">Välj det paket som passar dig.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Alla paket inkluderar professionell handledning, moderna bilar och digitala teorimaterial.</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * .04, duration: .55 }}
              className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition hover:shadow-xl ${p.popular ? "border-primary bg-primary-50 shadow-[0_20px_60px_rgba(11,132,87,0.12)]" : "border-primary-200/60 bg-white shadow-sm"}`}>
              {p.popular && (
                <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-white">Populärt</span>
              )}
              <h3 className="text-xl font-extrabold tracking-tight text-dark">{p.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{p.lessons}</p>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl font-black tracking-tight text-dark">{p.price.toLocaleString("sv-SE")} <span className="text-lg font-bold text-slate-500">kr</span></span>
                {p.originalPrice && <span className="text-base font-semibold text-slate-400 line-through">{p.originalPrice.toLocaleString("sv-SE")} kr</span>}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {p.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <button onClick={() => onSelect(p)} className={`mt-7 w-full rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 ${p.popular ? "bg-primary text-white shadow-[0_12px_32px_rgba(11,132,87,0.3)] hover:bg-primary-600" : "bg-dark text-white hover:bg-primary-900"}`}>
                Köp paket
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-primary-200/40 bg-primary-50/60 p-6 text-center">
          <p className="text-sm font-semibold text-slate-700">
            <Icon name="phone" className="mr-2 inline-block h-4 w-4 text-primary" />
            Behöver du rådgivning? Ring oss på <a href="tel:031-3860086" className="font-bold text-primary underline">031‑386 00 86</a> eller mejla <a href="mailto:info@kornu.se" className="font-bold text-primary underline">info@kornu.se</a>
          </p>
        </div>
      </div>
    </section>
  );
}
