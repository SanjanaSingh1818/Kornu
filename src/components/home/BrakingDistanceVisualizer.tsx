import { useMemo, useState } from "react";
import { useLanguage } from "../../i18n";

const CONDITIONS = [
  { label: "Is / Snö", value: 0.15, icon: "❄️" },
  { label: "Våt", value: 0.4, icon: "🌧️" },
  { label: "Torr", value: 0.8, icon: "☀️" },
  { label: "Grus", value: 0.5, icon: "◼" },
];

export function BrakingDistanceVisualizer() {
  const { t } = useLanguage();
  const [speed, setSpeed] = useState(50);
  const [friction, setFriction] = useState(0.4);
  const stopping = useMemo(() => {
    const metersPerSecond = speed / 3.6;
    const reaction = metersPerSecond;
    const braking = (metersPerSecond * metersPerSecond) / (2 * friction * 9.82);
    return {
      reaction: Math.round(reaction),
      braking: Math.round(braking),
      total: Math.round(reaction + braking),
    };
  }, [friction, speed]);

  return (
    <section className="border-y border-slate-100 bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <span className="rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-dark">{t.braking.tag}</span>
        <h2 className="mt-3 text-3xl font-black text-primary-dark">{t.braking.title}</h2>
        <p className="mx-auto mt-2 max-w-lg text-xs font-medium leading-relaxed text-slate-500">{t.braking.text}</p>

        <div className="mt-8 rounded-3xl border border-primary-100/60 bg-slate-50 p-6 text-left shadow-md">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary-dark">{t.braking.variables}</h3>
              <div>
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>{t.braking.speed}</span>
                  <span className="font-black text-primary">{speed} km/h</span>
                </div>
                <input type="range" min={30} max={110} step={10} value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-primary" />
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-slate-700">{t.braking.choose}</p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {CONDITIONS.map((item, index) => (
                    <button key={item.label} onClick={() => setFriction(item.value)} className={`rounded-xl border px-1 py-2 text-center text-[10px] font-bold transition ${friction === item.value ? "border-primary bg-primary text-white shadow" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                      <div>{item.icon}</div>
                      <div className="mt-1">{t.braking.conditions[index]}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary-dark">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                {t.braking.stopping}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">{t.braking.reaction}</p>
                  <p className="text-sm font-black text-slate-800">{stopping.reaction} m</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">{t.braking.braking}</p>
                  <p className="text-sm font-black text-primary">{stopping.braking} m</p>
                </div>
                <div className="rounded-xl border border-primary-100 bg-primary-50 p-3">
                  <p className="text-[9px] font-bold uppercase text-primary-700">{t.braking.total}</p>
                  <p className="text-base font-black text-primary-dark">{stopping.total} m</p>
                </div>
              </div>
              <div className="mt-5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, stopping.total)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
