import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../i18n";

type GoogleReview = {
  id: string;
  author: string;
  photo: string | null;
  rating: number;
  text: string;
  createTime: string;
};

type GoogleReviewsResponse = {
  averageRating: number | null;
  totalReviewCount: number | null;
  reviews: GoogleReview[];
};

type GoogleReviewsSummary = Pick<GoogleReviewsResponse, "averageRating" | "totalReviewCount">;

function isGoogleReviewsResponse(value: unknown): value is GoogleReviewsResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GoogleReviewsResponse>;
  return Array.isArray(candidate.reviews);
}

function Arrow({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg className={`h-5 w-5 ${direction === "previous" ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function ReviewsCarousel() {
  const { t, site } = useLanguage();
  const [googleSummary, setGoogleSummary] = useState<GoogleReviewsSummary | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/google-reviews")
      .then(async (response) => {
        const payload: unknown = await response.json();
        if (!response.ok || !isGoogleReviewsResponse(payload)) {
          throw new Error("Google reviews are unavailable.");
        }
        if (!cancelled) {
          setGoogleSummary({
            averageRating: payload.averageRating,
            totalReviewCount: payload.totalReviewCount,
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) console.warn("[reviews] Using local review content because Google reviews could not be loaded.", error);
      });
    return () => { cancelled = true; };
  }, []);

  const reviews: GoogleReview[] = site.reviews.map((review, index) => ({
    id: `${review.author}-${index}`,
    author: review.author,
    photo: null,
    rating: review.rating,
    text: review.text,
    createTime: review.time,
  }));
  useEffect(() => {
    if (paused || reviews.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % reviews.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, reviews.length]);

  const averageRating = googleSummary?.averageRating ?? Number(site.reviewRating);
  const visibleReviews = [0, 1, 2].map((offset) => reviews[(activeIndex + offset) % reviews.length]).filter((review): review is GoogleReview => Boolean(review));

  const move = (offset: number) => {
    setActiveIndex((index) => (index + offset + reviews.length) % reviews.length);
  };

  return (
    <section className="relative z-10 overflow-hidden border-y border-slate-100 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">{t.reviews.tag}</span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-primary-dark">{t.reviews.title}</h2>
        </div>

        <div
          className="grid items-center gap-5 lg:grid-cols-[190px_40px_minmax(0,1fr)_40px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className="text-center transition hover:opacity-80 lg:text-left">
            <p className="font-extrabold text-slate-900">{site.siteName}</p>
            <p className="mt-1 text-2xl leading-none tracking-tight text-amber-400" aria-label={`${averageRating} out of 5 stars`}>★★★★★</p>
            <p className="mt-1 text-sm font-bold text-slate-700">{averageRating.toFixed(1)} / 5</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{t.reviews.based}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-dark">
              {t.reviews.verified}
              <span className="font-black text-[#4285F4]" aria-hidden="true">G</span>
            </span>
          </a>

          <button type="button" onClick={() => move(-1)} aria-label="Previous reviews" className="hidden h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary-dark lg:grid">
            <Arrow direction="previous" />
          </button>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {visibleReviews.map((review, index) => (
              <article key={review.id} className={`min-w-0 rounded-2xl bg-slate-50 p-5 ${index > 0 ? "hidden sm:block" : ""}`}>
                <div className="flex items-center gap-3">
                  {review.photo ? (
                    <img src={review.photo} alt="" className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-900 text-sm font-bold text-white">
                      {review.author.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-extrabold text-slate-800">{review.author}</h3>
                    <p className="truncate text-xs text-slate-500">
                      {review.createTime}
                    </p>
                  </div>
                  <span className="font-black text-[#4285F4]" aria-label="Google review">G</span>
                </div>
                <p className="mt-3 text-lg leading-none tracking-tight text-amber-400" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(Math.max(0, Math.min(5, review.rating)))}</p>
                {review.text && <p className="mt-3 line-clamp-4 min-h-20 whitespace-pre-line text-sm leading-6 text-slate-700">{review.text}</p>}
              </article>
            ))}
          </motion.div>

          <button type="button" onClick={() => move(1)} aria-label="Next reviews" className="hidden h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary-dark lg:grid">
            <Arrow direction="next" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <button type="button" onClick={() => move(-1)} aria-label="Previous reviews" className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary-dark lg:hidden">
            <Arrow direction="previous" />
          </button>
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show review ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-6 bg-primary" : "w-2 bg-slate-300"}`}
            />
          ))}
          <button type="button" onClick={() => move(1)} aria-label="Next reviews" className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary-dark lg:hidden">
            <Arrow direction="next" />
          </button>
        </div>
      </div>
    </section>
  );
}
