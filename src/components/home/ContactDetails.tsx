import { useLanguage } from "../../i18n";
import { Icon } from "../Icon";

export function ContactDetails() {
  const { t } = useLanguage();
  return (
    <section className="bg-primary-50 px-6 pb-24 pt-4">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-200/50">
          <h2 className="text-xl font-extrabold text-dark">{t.visit.contact}</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <p><strong className="text-dark">{t.visit.address}:</strong> Sveavägen 122, 113 50 Stockholm</p>
            <p><strong className="text-dark">{t.pay.phone}:</strong> <a href="tel:031-3860086" className="text-primary underline">031 386 00 86</a></p>
            <p><strong className="text-dark">{t.pay.email}:</strong> <a href="mailto:info@kornu.se" className="text-primary underline">info@kornu.se</a></p>
            <p><strong className="text-dark">Org.nr:</strong> 559288-1386</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-200/50">
          <h2 className="text-xl font-extrabold text-dark">{t.visit.hours}</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <p><strong className="text-dark">Mån-Tors:</strong> 11:00-15:00</p>
            <p><strong className="text-dark">Fre:</strong> 11:00-13:00</p>
            <p><strong className="text-dark">Lör-Sön:</strong> Stängt</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-200/50">
          <h2 className="text-xl font-extrabold text-dark">{t.visit.tag}</h2>
          <p className="mt-5 text-sm leading-6 text-slate-600">{t.visit.text}</p>
          <a href="https://maps.app.goo.gl/WvBrSCZimUimjE9x7" target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-3 rounded-xl bg-dark px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-900">
            {t.visit.open} <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
