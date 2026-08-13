import { Icon } from "../Icon";
import { useLanguage } from "../../i18n";

export function FinalCta({ onBook }: { onBook: () => void }) {
  const { t } = useLanguage();
  return (
    <section id="kontakt" className="bg-white px-6 pb-24 pt-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary p-8 text-white shadow-[0_28px_80px_rgba(11,132,87,0.28)] sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-black uppercase tracking-[.24em] text-primary-200">{t.final.tag}</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">{t.final.title}</h2>
            <div className="mt-7 grid gap-3 text-base font-semibold sm:grid-cols-3">
              <a href="tel:031-3860086" className="inline-flex items-center gap-3 text-white/90 hover:text-white">
                <Icon name="phone" className="h-5 w-5" /> 031‑386 00 86
              </a>
              <a href="mailto:info@kornu.se" className="inline-flex items-center gap-3 text-white/90 hover:text-white">
                <Icon name="mail" className="h-5 w-5" /> info@kornu.se
              </a>
              <span className="inline-flex items-center gap-3 text-white/90">
                <Icon name="pin" className="h-5 w-5" /> {t.final.location}
              </span>
            </div>
          </div>
          <button onClick={onBook} className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-5 font-bold text-primary shadow-[0_16px_44px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:bg-primary-50">
            {t.final.button} <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
