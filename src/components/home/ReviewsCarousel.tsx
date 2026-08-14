import { useEffect, useRef } from "react";
import { useLanguage } from "../../i18n";
import { Icon } from "../Icon";

export function ReviewsCarousel() {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    let raf = 0;
    let paused = false;
    const step = () => {
      if (!paused) {
        pos += 0.45;
        const half = track.scrollWidth / 2;
        if (pos >= half) pos = 0;
        track.style.transform = `translateX(-${pos}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    track.addEventListener("mouseenter", () => (paused = true));
    track.addEventListener("mouseleave", () => (paused = false));
    return () => cancelAnimationFrame(raf);
  }, []);

  const reviews = t.reviews.items.map(([author, time, text, avatar]) => ({ author, rating: 5, time, text, avatar }));
  const items = [...reviews, ...reviews];

  return (
    <section className="relative z-10 overflow-hidden border-y border-slate-100 bg-white py-14">
      <div className="mx-auto mb-8 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">{t.reviews.tag}</span>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-primary-dark">{t.reviews.title}</h2>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Icon key={i} name="star" className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}</div>
          <span className="text-xl font-black text-primary-dark">4.9</span>
          <span className="text-xs font-medium text-slate-400">{t.reviews.based}</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-24" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-24" />

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex w-max gap-4 px-4 py-2 will-change-transform">
          {items.map((review, i) => (
            <article key={`${review.author}-${i}`} className="flex w-72 shrink-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-sm font-extrabold text-primary-dark">{review.avatar}</div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">{review.author}</p>
                    <p className="text-[10px] text-slate-400">{review.time}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">{[...Array(review.rating)].map((_, j) => <Icon key={j} name="star" className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}</div>
              </div>
              <p className="flex-1 text-xs font-medium italic leading-relaxed text-slate-600">&ldquo;{review.text}&rdquo;</p>
              <div className="border-t border-slate-100 pt-2 text-[10px] font-black text-primary-dark">{t.reviews.verified}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
