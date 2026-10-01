import { useLanguage } from "../../i18n";
import { Icon } from "../Icon";

export function ContactDetails() {
  const { t, site } = useLanguage();
  return (
    <section className="bg-primary-50 px-6 pb-24 pt-4">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-200/50">
          <h2 className="text-xl font-extrabold text-dark">{t.visit.contact}</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <p><strong className="text-dark">{t.visit.address}:</strong> <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{site.address}</a></p>
            <p><strong className="text-dark">{site.contactLabels.phone}:</strong> <a href={site.phone.href} className="text-primary underline">{site.phone.display}</a></p>
            <p><strong className="text-dark">{site.contactLabels.email}:</strong> <a href={`mailto:${site.email}`} className="text-primary underline">{site.email}</a></p>
            {site.orgNumber && <p><strong className="text-dark">{site.contactLabels.org}:</strong> {site.orgNumber}</p>}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-200/50">
          <h2 className="text-xl font-extrabold text-dark">{t.visit.hours}</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            {site.openingHours.map((row, i) => (
              <p key={`${row.days}-${i}`}><strong className="text-dark">{row.days}:</strong> {row.hours}</p>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-200/50">
          <h2 className="text-xl font-extrabold text-dark">{t.visit.tag}</h2>
          <p className="mt-5 text-sm leading-6 text-slate-600">{t.visit.text}</p>
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-3 rounded-xl bg-dark px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-900">
            {t.visit.open} <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
