import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../i18n";
import type { Package } from "../../types";
import { Icon } from "../Icon";

type StripeCourse = Omit<Package, "includes">;

export function Courses({ onSelect, loading = false }: { onSelect: (course: Package) => void; loading?: boolean }) {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Package[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let current = true;

    const loadCourses = async () => {
      try {
        const response = await fetch("/api/products");
        const payload = await response.json() as { products?: StripeCourse[]; error?: string };
        if (!response.ok || !Array.isArray(payload.products)) {
          throw new Error(payload.error || "Unable to load courses.");
        }

        const nextCourses = payload.products
          .filter((product) => product.collections.includes("courses"))
          .map((product) => ({ ...product, includes: product.features }));
        if (current) {
          setCourses(nextCourses);
          setCatalogStatus("ready");
        }
      } catch {
        if (current) setCatalogStatus("error");
      }
    };

    void loadCourses();
    return () => { current = false; };
  }, []);

  return (
    <section className="bg-primary-50 px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[.26em] text-primary">{t.pages.courses[0]}</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-dark sm:text-6xl">{t.pages.courses[1]}</h2>
          </div>
          <a href="#paket" className="inline-flex items-center gap-3 text-sm font-bold text-dark">{t.packages.tag} <Icon name="arrow" className="h-4 w-4" /></a>
        </div>

        {catalogStatus === "loading" && <p role="status" className="mt-12 text-sm font-semibold text-slate-500">{t.courses.loading}</p>}
        {catalogStatus === "error" && <p role="alert" className="mt-12 text-sm font-semibold text-red-700">{t.courses.error}</p>}
        {catalogStatus === "ready" && courses.length === 0 && <p className="mt-12 text-sm font-semibold text-slate-500">{t.courses.empty}</p>}
        {catalogStatus === "ready" && courses.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {courses.map((course, index) => {
              const details = [course.lessons, course.duration, course.features.join(" · ")].filter(Boolean).join(" · ") || course.description;
              const currency = course.currency?.toUpperCase() || "SEK";
              return (
                <motion.article key={course.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * .04, duration: .55 }} className="group overflow-hidden rounded-2xl bg-white shadow-[0_14px_48px_rgba(6,78,59,0.08)] ring-1 ring-primary-200/50">
                  <div className="relative h-44 overflow-hidden">
                    <img src={course.image || "/images/course-city.jpg"} alt={course.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    {(course.badge || course.popular) && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase text-primary-dark">{course.badge || t.packages.popular}</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold tracking-tight text-dark">{course.name}</h3>
                    <p className="mt-3 min-h-14 line-clamp-3 text-sm leading-6 text-slate-600">{details}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 text-sm font-bold text-dark">
                      <span>{course.price.toLocaleString("sv-SE")} {currency}</span>
                      <button type="button" onClick={() => onSelect(course)} disabled={loading} aria-label={`${t.courses.book}: ${course.name}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-dark text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60">
                        <Icon name="arrow" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
