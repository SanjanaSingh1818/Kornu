import { Icon } from "../Icon";
import { useLanguage } from "../../i18n";

export function VisitUs() {
  const { t } = useLanguage();
  return (
    <section className="relative z-10 border-y border-slate-100 bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-primary-dark">{t.visit.tag}</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-primary-dark">{t.visit.title}</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">{t.visit.text}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            {[
              { icon: "pin", title: t.visit.address, text: "Sveavägen 122\n113 50 Stockholm", link: "https://maps.google.com/?q=Sveavägen+122,+Stockholm" },
              { icon: "phone", title: t.visit.contact, text: "031-386 00 86\ninfo@kornu.se", link: "mailto:info@kornu.se" },
              { icon: "calendar", title: t.visit.hours, text: t.visit.schedule, link: "" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-dark">
                  <Icon name={item.icon} className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-primary-dark">{item.title}</h3>
                <p className="mt-1 whitespace-pre-line text-xs font-medium leading-relaxed text-slate-600">{item.text}</p>
                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-bold text-primary underline underline-offset-2">{t.visit.open}</a>}
              </div>
            ))}
          </div>
          <div className="min-h-[400px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-md lg:col-span-2">
            <iframe
              title="Kornu Trafikskola - Sveavägen 122 Stockholm"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2034.066743296938!2d18.057986!3d59.340086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d60a0d8f7a7%3A0x0!2sSveavägen+122%2C+113+50+Stockholm!5e0!3m2!1ssv!2sse!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
