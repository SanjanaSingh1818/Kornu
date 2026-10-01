import { useLanguage } from "../i18n";
import { handleRouteClick } from "../routing";
import type { PagePath } from "../types";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

function FLinks({ title, items, onNavigate }: { title: string; items: { label: string; path: PagePath }[]; onNavigate: (path: PagePath) => void }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-white/55">
        {items.map((it) => (
          <li key={`${title}-${it.label}`}><a href={it.path} onClick={(e) => handleRouteClick(e, it.path, onNavigate)} className="transition hover:text-white">{it.label}</a></li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ onNavigate }: { onNavigate: (path: PagePath) => void }) {
  const { t, site } = useLanguage();
  return (
    <footer className="bg-dark px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/55">{t.footer.text}</p>
          <div className="mt-5 flex gap-4">
            {site.social.map((s) => (
              <a key={`${s.platform}-${s.url}`} href={s.url} target={s.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-xl bg-white/8 text-white/60 transition hover:bg-primary hover:text-white" aria-label={s.platform}>
                <Icon name={s.platform} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        <FLinks title={t.footer.quick} items={site.nav} onNavigate={onNavigate} />
        <FLinks title={t.footer.courses} items={site.footerCourseLinks} onNavigate={onNavigate} />
        <div>
          <h3 className="text-sm font-bold text-white">{t.footer.contact}</h3>
          <div className="mt-5 space-y-4 text-sm text-white/55">
            <a href={site.phone.href} className="flex items-center gap-3 hover:text-white"><Icon name="phone" className="h-4 w-4 text-primary-400" /> {site.phone.display}</a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-white"><Icon name="mail" className="h-4 w-4 text-primary-400" /> {site.email}</a>
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="flex items-start gap-3 hover:text-white"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" /> {site.address}</a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/35 sm:flex-row">
        <p>{site.copyright} {t.footer.rights}</p>
        <p>{t.footer.city} 🇸🇪</p>
      </div>
    </footer>
  );
}
