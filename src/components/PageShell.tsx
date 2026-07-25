import type { ReactNode } from "react";

export function PageShell({ children, eyebrow, title, text }: { children: ReactNode; eyebrow: string; title: string; text: string }) {
  return (
    <>
      <section className="bg-dark px-6 pb-16 pt-36 text-white sm:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[.26em] text-primary-300">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-extrabold tracking-[-0.04em] text-white sm:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{text}</p>
        </div>
      </section>
      {children}
    </>
  );
}
