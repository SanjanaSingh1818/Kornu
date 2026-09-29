import { Icon } from "../components/Icon";
import { useLanguage } from "../i18n";

export function AboutPage() {
  const { t } = useLanguage();
  return (
    <section className="bg-white px-6 pb-20 pt-36 sm:pt-40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[.2em] text-slate-950">
            <span className="h-0.5 w-12 bg-primary-300" />
            {t.about.eyebrow}
          </p>
          <h1 className="mt-16 max-w-xl text-4xl font-extrabold leading-[1.08] text-slate-950 sm:text-5xl">
            {t.about.title}
          </h1>
          <div className="mt-6 max-w-2xl space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
            {t.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=K%C3%B6r+Nu+Trafikskola+V%C3%A4stra+Fr%C3%B6lunda+G%C3%B6teborg"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-md bg-black px-7 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Icon name="pin" className="h-4 w-4" />
            {t.about.findUs}
          </a>
        </div>
        <div className="relative lg:mr-6">
          <div className="absolute -bottom-5 -right-5 h-full w-full rounded-[2rem] bg-primary-300" />
          <img
            src="/images/kornu-about.webp"
            alt={t.about.imageAlt}
            className="relative aspect-[1/1] w-full rounded-[2rem] object-cover shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
          />
        </div>
      </div>
    </section>
  );
}
