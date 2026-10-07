import { useEffect, useRef, useState } from "react";
import { useLanguage, type Lang } from "../../i18n";
import { Icon } from "../Icon";

type LiveReview = { id: string; author: string; photo: string | null; rating: number; text: string; createTime: string };
type LiveReviews = { averageRating: number | null; totalReviewCount: number | null; reviews: LiveReview[] };

function initialsOf(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]!.toUpperCase()).join("");
}

function relativeTime(iso: string, lang: Lang) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400]];
  const format = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  for (const [unit, size] of units) if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  return format.format(0, "day");
}

export function ReviewsCarousel() {
  const { t, site, lang } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<LiveReviews | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/google-reviews")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((data: LiveReviews) => { if (!cancelled && data.reviews?.length) setLive(data); })
      .catch((error) => console.info("[reviews] Live Google reviews unavailable; showing saved reviews.", error));
    return () => { cancelled = true; };
  }, []);

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

  const reviews = live
    ? live.reviews.map((review) => ({ author: review.author, time: relativeTime(review.createTime, lang), text: review.text, rating: review.rating, avatar: initialsOf(review.author), photo: review.photo }))
    : site.reviews.map((review) => ({ ...review, avatar: review.initials, photo: null as string | null }));
  const items = [...reviews, ...reviews];
  const rating = live?.averageRating ? live.averageRating.toFixed(1) : site.reviewRating;
  const based = live?.totalReviewCount ? t.reviews.based.replace(/\d+/, String(live.totalReviewCount)) : t.reviews.based;

  return (
    <section className="relative z-10 overflow-hidden border-y border-slate-100 bg-white py-14">
      <div className="mx-auto mb-8 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">{t.reviews.tag}</span>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-primary-dark">{t.reviews.title}</h2>
        <a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 hover:underline">
          <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Icon key={i} name="star" className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}</div>
          <span className="text-xl font-black text-primary-dark">{rating}</span>
          <span className="text-xs font-medium text-slate-400">{based}</span>
        </a>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-24" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-24" />

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex w-max gap-4 px-4 py-2 will-change-transform">
          {items.map((review, i) => (
            <article key={`${review.author}-${i}`} className="flex w-72 shrink-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {review.photo
                    ? <img src={review.photo} alt="" referrerPolicy="no-referrer" loading="lazy" className="h-9 w-9 rounded-full border border-primary-100 object-cover" />
                    : <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-sm font-extrabold text-primary-dark">{review.avatar}</div>}
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">{review.author}</p>
                    <p className="text-[10px] text-slate-400">{review.time}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">{[...Array(review.rating)].map((_, j) => <Icon key={j} name="star" className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}</div>
              </div>
              <p className="flex-1 text-xs font-medium italic leading-relaxed text-slate-600">&ldquo;{review.text}&rdquo;</p>
              <a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className="border-t border-slate-100 pt-2 text-[10px] font-black text-primary-dark hover:underline">{t.reviews.verified}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
