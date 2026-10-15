import { useLanguage } from "../../i18n";

export function ReviewsCarousel() {
  const { t } = useLanguage();

  return (
    <section className="relative z-10 overflow-hidden border-y border-slate-100 bg-white py-14">
      <div className="mx-auto mb-8 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">{t.reviews.tag}</span>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-primary-dark">{t.reviews.title}</h2>
      </div>

      <div className="home-reviews-widget mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="elfsight-app-849f26a2-cd15-4261-b8ae-fab7f23aa392" data-elfsight-app-lazy />
      </div>
    </section>
  );
}
