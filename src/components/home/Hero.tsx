import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Icon } from "../Icon";
import { useLanguage } from "../../i18n";

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight text-primary-400 sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/60 sm:text-[11px]">
        {label}
      </p>
    </div>
  );
}

export function Hero({ onBook }: { onBook: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement | null>(null);

  const rm = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgScale = useTransform(
    scrollYProgress,
    [0, 1],
    rm ? [1, 1] : [1.02, 1.1]
  );

  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    rm ? [0, 0] : [0, 70]
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    rm ? [0, 0] : [0, 40]
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    [1, 0.25]
  );

  return (
    <section
      id="hem"
      ref={ref}
      className="relative min-h-[760px] overflow-hidden bg-dark text-white sm:min-h-[780px] lg:min-h-[820px] xl:min-h-[860px]"
    >
      {/* Background Image */}
      <motion.img
        src="/images/hero-green.jpg"
        alt="Kör Nu Driving School"
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{
          scale: imgScale,
          y: imgY,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(3,31,25,.84)_0%,rgba(3,31,25,.62)_38%,rgba(3,31,25,.22)_72%,rgba(3,31,25,.18)_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(52,211,153,0.15),transparent_32%)]" />

      <motion.div
        className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center px-5 pb-20 pt-36 sm:min-h-[780px] sm:px-8 sm:pb-24 sm:pt-40 lg:min-h-[820px] lg:px-12 lg:pb-28 lg:pt-44 xl:min-h-[860px]"
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <div className="max-w-2xl lg:max-w-[720px]">
          {/* Badge */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
            }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-900/40 px-3 py-1.5 text-xs font-medium text-primary-300 backdrop-blur-md sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
            {t.hero.badge}
          </motion.div>

          {/* Heading */}

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1,
              duration: 0.8,
            }}
            className="mt-5 max-w-[680px] text-[2.55rem] font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-5xl md:text-[3.35rem] lg:text-[3.85rem] xl:text-[4.15rem]"
          >
            {t.hero.titleA}{" "}
            <span className="text-primary-400">
              {t.hero.titleB}
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.7,
            }}
            className="mt-5 max-w-xl text-[15px] leading-7 text-white/78 sm:mt-6 sm:text-base sm:leading-8 lg:max-w-2xl"
          >
            {t.hero.text}
          </motion.p>

          {/* Buttons */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.7,
            }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <button
              onClick={onBook}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-primary-600 sm:px-8 sm:py-4 sm:text-base"
            >
              {t.hero.book}
              <Icon
                name="arrow"
                className="h-4 w-4"
              />
            </button>

            <a
              href="#paket"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 sm:px-8 sm:py-4 sm:text-base"
            >
              {t.hero.packages}
            </a>
          </motion.div>

          {/* Stats */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
            }}
            className="mt-9 max-w-md border-t border-white/15 pt-6 sm:mt-10 sm:pt-7"
          >
            <div className="grid grid-cols-3 gap-5 sm:gap-8">
              {t.hero.stats.map(([value, label]) => <Stat key={label} value={value} label={label} />)}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
