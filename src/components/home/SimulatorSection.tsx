import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../../i18n";
import { Icon } from "../Icon";

export function SimulatorSection({ onLaunch }: { onLaunch: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement | null>(null);
  const rm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const carX = useTransform(scrollYProgress, [0,1], rm ? ["0%","0%"] : ["-10%","18%"]);
  const carR = useTransform(scrollYProgress, [0,1], rm ? [-6,-6] : [-10,6]);

  return (
    <section id="simulator" ref={ref} className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-3xl bg-dark p-6 text-white shadow-[0_40px_100px_rgba(2,44,34,0.22)] lg:grid-cols-[1.12fr_0.88fr] lg:p-10">
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-primary-900 group cursor-pointer" onClick={onLaunch}>
          <img src="/images/simulator.jpg" alt="Kör Nu körsimulatorn" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,44,34,0),rgba(2,44,34,0.4))]" />
          <motion.div className="absolute bottom-4 left-6 w-[130px]" style={{ x: carX, rotate: carR }} aria-hidden>
            <img src="/images/car.png" alt="" className="w-full drop-shadow-2xl" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 shadow-[0_0_40px_rgba(16,185,129,0.5)] backdrop-blur-sm">
              <svg className="ml-1 h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        </div>
        <div className="px-2 py-4 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[.26em] text-primary-400">{t.simulator.tag}</p>
          <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">{t.simulator.title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">{t.simulator.text}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-lg bg-primary-900/50 px-3 py-1.5 text-xs font-bold text-primary-300">🏙️ {t.simulator.city}</span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-primary-900/50 px-3 py-1.5 text-xs font-bold text-primary-300">🛣️ {t.simulator.motorway}</span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-primary-900/50 px-3 py-1.5 text-xs font-bold text-primary-300">🌙 {t.simulator.night}</span>
          </div>

          <button onClick={onLaunch} className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-7 py-4 font-bold text-white shadow-[0_16px_48px_rgba(11,132,87,0.35)] transition hover:-translate-y-1 hover:bg-primary-600">
            🎮 {t.simulator.start} <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
