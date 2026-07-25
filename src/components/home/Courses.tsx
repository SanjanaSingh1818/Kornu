import { motion } from "framer-motion";
import { COURSES } from "../../data";
import { Icon } from "../Icon";

export function Courses() {
  return (
    <section className="bg-primary-50 px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[.26em] text-primary">Våra kurser</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-dark sm:text-6xl">Välj den körväg som passar din vecka.</h2>
          </div>
          <a href="#paket" className="inline-flex items-center gap-3 text-sm font-bold text-dark">Se alla paket <Icon name="arrow" className="h-4 w-4" /></a>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {COURSES.map((c, i) => (
            <motion.a href="#paket" key={c.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * .04, duration: .55 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-[0_14px_48px_rgba(6,78,59,0.08)] ring-1 ring-primary-200/50">
              <div className="h-44 overflow-hidden">
                <img src={c.image} alt={c.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold tracking-tight text-dark">{c.title}</h3>
                <p className="mt-3 min-h-14 text-sm leading-6 text-slate-600">{c.text}</p>
                <div className="mt-5 flex items-center justify-between gap-3 text-sm font-bold text-dark">
                  <span>{c.price}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-dark text-white transition group-hover:bg-primary group-hover:text-white">
                    <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
