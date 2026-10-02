import type { ReactNode } from "react";
import type { InfoPagePath } from "../types";
import { useLanguage } from "../i18n";

// Paragraphs starting with "## " render as headings and consecutive "- " paragraphs as one list.
function renderParagraphs(paragraphs: string[], keyPrefix: string) {
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];
  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={`${keyPrefix}-list-${nodes.length}`} className="list-disc space-y-2 pl-6">
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
      nodes.push(<h2 key={`${keyPrefix}-${index}`} className="pt-4 text-2xl font-extrabold leading-tight text-slate-950">{paragraph.slice(3)}</h2>);
    } else {
      nodes.push(<p key={`${keyPrefix}-${index}`} className="whitespace-pre-line">{paragraph}</p>);
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
    <section className="bg-white px-6 pb-20 pt-36 sm:pt-40">
      <article className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[.2em] text-primary-700">Kör Nu Trafikskola</p>
        <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">{page.title}</h1>
        <div className="mt-8 space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
          {renderParagraphs(page.paragraphs, page.path)}
        </div>
      </article>
    </section>
  );
}
