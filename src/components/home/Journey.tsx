import { useRef } from "react";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { JOURNEY } from "../../data";

const ROAD_PATH =
  "M58 308 C156 374 230 268 304 202 C404 112 480 302 584 264 C676 230 672 76 788 108 C884 134 842 316 954 306 C1058 296 1054 178 1178 198";

const desktopSteps = [
  { left: "7%", top: "63%", align: "bottom", threshold: 0 },
  { left: "24%", top: "43%", align: "top", threshold: 0.16 },
  { left: "37%", top: "57%", align: "bottom", threshold: 0.32 },
  { left: "57%", top: "31%", align: "top", threshold: 0.5 },
  { left: "71%", top: "61%", align: "bottom", threshold: 0.66 },
  { left: "83%", top: "47%", align: "top", threshold: 0.83 },
  { left: "94%", top: "43%", align: "bottom", threshold: 1 },
] as const;

function DesktopMilestone({
  index,
  progress,
  step,
}: {
  index: number;
  progress: MotionValue<number>;
  step: typeof JOURNEY[number];
}) {
  const position = desktopSteps[index];
  const isTop = position.align === "top";
  const start = Math.max(0, position.threshold - 0.08);
  const active = Math.min(1, position.threshold + 0.035);
  const opacity = useTransform(progress, [start, active], [0.38, 1]);
  const scale = useTransform(progress, [start, active], [0.94, 1]);
  const y = useTransform(progress, [start, active], [isTop ? -10 : 10, 0]);
  const glow = useTransform(progress, [start, active], ["0 12px 28px rgba(6,78,59,0.08)", "0 22px 54px rgba(6,78,59,0.18)"]);

  return (
    <motion.div
      className="absolute z-30 w-[190px] -translate-x-1/2 -translate-y-1/2"
      style={{ left: position.left, top: position.top, opacity, scale, y }}
    >
      <motion.span
        className="relative z-10 mx-auto grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/92 text-sm font-black text-dark shadow-[0_12px_30px_rgba(6,78,59,0.16)] ring-[6px] ring-primary-100/80 backdrop-blur-xl"
        style={{ boxShadow: glow }}
      >
        {index + 1}
      </motion.span>
      <motion.div
        className={`absolute left-1/2 w-full -translate-x-1/2 rounded-2xl border border-white/70 bg-white/86 p-3 text-center shadow-[0_18px_48px_rgba(6,78,59,0.13)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-1 hover:bg-white/95 ${isTop ? "bottom-[3.65rem]" : "top-[3.65rem]"}`}
        style={{ boxShadow: glow }}
      >
          <h3 className="text-sm font-black leading-5 tracking-tight text-dark">{step.label}</h3>
          <p className="mt-1.5 text-xs leading-5 text-slate-600">{step.detail}</p>
      </motion.div>
    </motion.div>
  );
}

function MobileMilestone({
  index,
  step,
}: {
  index: number;
  step: typeof JOURNEY[number];
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ delay: index * 0.045, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-16"
    >
      <span className="absolute left-[1.05rem] top-1 grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-dark text-sm font-black text-white shadow-[0_14px_34px_rgba(6,78,59,0.18)] ring-8 ring-primary-50">
        {index + 1}
      </span>
      <div className="rounded-2xl border border-white/70 bg-white/82 p-4 shadow-[0_18px_48px_rgba(6,78,59,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white">
        <h3 className="text-base font-black tracking-tight text-dark">{step.label}</h3>
        <p className="mt-1.5 text-sm leading-6 text-slate-600">{step.detail}</p>
      </div>
    </motion.li>
  );
}

export function Journey() {
  const ref = useRef<HTMLElement | null>(null);
  const rm = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 84%", "end 30%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
    mass: 0.42,
  });

  const progress = rm ? scrollYProgress : smoothProgress;
  const carKeyframes = [0,.08,.16,.24,.32,.41,.5,.58,.66,.75,.83,.91,1];
  const carSvgX = useTransform(progress, carKeyframes, [72, 185, 304, 390, 470, 610, 704, 800, 884, 940, 1030, 1100, 1170]);
  const carSvgY = useTransform(progress, carKeyframes, [308, 345, 204, 155, 260, 260, 110, 132, 304, 310, 222, 180, 198]);
  const carRot = useTransform(progress, carKeyframes, [24, 8, -42, -18, 22, -10, -31, 18, 20, -4, -18, 3, 8]);
  const roadDash = useTransform(progress, [0,1], [1320,0]);
  const mobileLineScale = useTransform(progress, [0, 1], [0.02, 1]);

  return (
    <section id="kurser" ref={ref} className="relative overflow-hidden bg-primary-50 px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_86%_32%,rgba(2,44,34,0.10),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,78,59,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(6,78,59,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[.24em] text-primary sm:text-sm">Din väg till körkortet</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.025em] text-dark sm:text-4xl lg:text-5xl">
            Från första testet till <span className="text-primary">trygg förare.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            En tydlig premiumplan där varje steg låses upp i takt med din körning, från syntest till uppkörning.
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-white/75 bg-white/62 shadow-[0_40px_120px_rgba(6,78,59,0.13)] backdrop-blur-xl sm:mt-12">
          <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.92),rgba(236,253,245,0.66)_46%,rgba(255,255,255,0.82))]" />
          <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
          <div className="absolute bottom-0 left-1/2 h-44 w-[80%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(6,78,59,0.12),transparent_68%)]" />

          <div className="relative hidden min-h-[640px] lg:block">
            <svg className="absolute left-1/2 top-1/2 h-[460px] w-[1230px] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 1240 460" fill="none" aria-hidden>
              <path d={ROAD_PATH} stroke="rgba(2,44,34,0.18)" strokeWidth="68" strokeLinecap="round" transform="translate(0 14)" />
              <path d={ROAD_PATH} stroke="rgba(255,255,255,0.92)" strokeWidth="62" strokeLinecap="round" />
              <path d={ROAD_PATH} stroke="#043D31" strokeWidth="50" strokeLinecap="round" />
              <path d={ROAD_PATH} stroke="rgba(255,255,255,0.72)" strokeWidth="4" strokeLinecap="round" strokeDasharray="18 28" />
              <motion.path
                d={ROAD_PATH}
                stroke="rgba(16,185,129,0.30)"
                strokeWidth="22"
                strokeLinecap="round"
                strokeDasharray="1320"
                style={{ strokeDashoffset: roadDash, filter: "blur(10px)" }}
              />
              <motion.path
                d={ROAD_PATH}
                stroke="#18D894"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="1320"
                style={{ strokeDashoffset: roadDash }}
              />

              <motion.g
                aria-hidden
                style={{
                  x: carSvgX,
                  y: carSvgY,
                  rotate: carRot,
                  transformOrigin: "center center",
                }}
              >
                <image
                  href="/images/car.png"
                  x="-92"
                  y="-50"
                  width="184"
                  height="100"
                  preserveAspectRatio="xMidYMid meet"
                  className="drop-shadow-[0_32px_40px_rgba(2,44,34,0.42)]"
                />
              </motion.g>
            </svg>

            <div className="absolute inset-0">
              {JOURNEY.map((step, i) => (
                <DesktopMilestone key={step.label} index={i} progress={progress} step={step} />
              ))}
            </div>
          </div>

          <div className="relative p-5 lg:hidden">
            <div className="absolute bottom-8 left-[2.35rem] top-8 w-px bg-primary-100" />
            <motion.div
              className="absolute left-[2.35rem] top-8 w-px origin-top bg-gradient-to-b from-primary-400 via-primary to-dark"
              style={{ bottom: "2rem", scaleY: mobileLineScale }}
              aria-hidden
            />
            <ol className="relative space-y-4">
              {JOURNEY.map((step, i) => (
                <MobileMilestone key={step.label} index={i} step={step} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
