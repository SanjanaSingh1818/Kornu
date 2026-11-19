import type { ReactNode } from "react";
import type { InfoPagePath } from "../types";
import { useLanguage } from "../i18n";

// Paragraphs starting with heading markers render as headings; consecutive "- " paragraphs form one list.
function renderParagraphs(paragraphs: string[], keyPrefix: string) {
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];
  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={`${keyPrefix}-list-${nodes.length}`} className="list-disc space-y-2 rounded-2xl border border-primary-100 bg-primary-50/60 px-6 py-5 pl-10 text-slate-700">
        {listItems.map((item, index) => <li key={index} className="whitespace-pre-line">{item}</li>)}
      </ul>,
    );
    listItems = [];
  };

  paragraphs.forEach((paragraph, index) => {
    if (paragraph.startsWith("- ")) {
      listItems.push(paragraph.slice(2));
      return;
    }
    flushList();
    if (paragraph.startsWith("## ")) {
      nodes.push(<h2 key={`${keyPrefix}-${index}`} className="mt-8 border-l-4 border-primary bg-primary-50 px-5 py-3 text-xl font-extrabold leading-tight text-primary-dark sm:text-2xl">{paragraph.slice(3)}</h2>);
    } else if (paragraph.startsWith("### ")) {
      nodes.push(<h3 key={`${keyPrefix}-${index}`} className="pt-3 text-base font-extrabold text-slate-900 sm:text-lg">{paragraph.slice(4)}</h3>);
    } else {
      nodes.push(<p key={`${keyPrefix}-${index}`} className={`whitespace-pre-line ${index === 0 ? "rounded-2xl border-l-4 border-primary-300 bg-slate-50 p-5 italic text-slate-700" : ""}`}>{paragraph}</p>);
    }
  });
  flushList();
  return nodes;
}

export function InfoPage({ path }: { path: InfoPagePath }) {
  const { site } = useLanguage();
  const page = site.infoPages.find((item) => item.path === path);
  if (!page) return null;

  return (
    <section className="bg-slate-50 px-4 pb-20 pt-36 sm:px-6 sm:pt-40">
      <article className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-9">
          <p className="text-xs font-black uppercase tracking-[.2em] text-primary-700">Kör Nu Trafikskola</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">{page.title}</h1>
          <div className="mt-8 space-y-4 text-base leading-7 text-slate-600">
            {renderParagraphs(page.paragraphs, page.path)}
          </div>
        </div>
      </article>
    </section>
  );
}
