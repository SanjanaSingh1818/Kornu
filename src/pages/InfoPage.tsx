import type { InfoPagePath } from "../types";
import { useLanguage } from "../i18n";

export function InfoPage({ path }: { path: InfoPagePath }) {
  const { site } = useLanguage();
  const page = site.infoPages.find((item) => item.path === path);
  if (!page) return null;

  return (
    <section className="bg-white px-6 pb-20 pt-36 sm:pt-40">
      <article className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[.2em] text-primary-700">Kör Nu Trafikskola</p>
        <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">{page.title}</h1>
        <div className="mt-8 space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
          {page.paragraphs.map((paragraph, index) => <p key={`${page.path}-${index}`}>{paragraph}</p>)}
        </div>
      </article>
    </section>
  );
}