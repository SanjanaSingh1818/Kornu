import { PageShell } from "../components/PageShell";
import { Icon } from "../components/Icon";
import { useLanguage } from "../i18n";

export function AboutPage() {
  const { t } = useLanguage();
  return (
    <PageShell eyebrow={t.about.eyebrow} title={t.about.title} text={t.about.text}>
      <section className="grid gap-5 md:grid-cols-3">
        {[
          { title: "Multilingual teaching", text: "Lessons and support are available in Swedish, English and Arabic.", icon: "person" },
          { title: "Focused preparation", text: "From körkortstillstånd and teoriprov to risk training and the driving test.", icon: "check" },
          { title: "Student-first booking", text: "Choose a package, transmission type and share notes before we plan your route.", icon: "calendar" },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
              <Icon name={item.icon} className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-black text-dark">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
