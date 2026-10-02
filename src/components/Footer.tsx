import { useLanguage } from "../i18n";
import type { NavItem } from "../content/defaults";
import { CmsLink } from "./CmsLink";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

function FLinks({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-white/55">
        {items.map((it) => (
          <li key={`${title}-${it.label}`}><CmsLink href={it.href} className="transition hover:text-white">{it.label}</CmsLink></li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { t, site } = useLanguage();
  return (
    <footer className="bg-dark px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.9fr_0.8fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/55">{t.footer.text}</p>
          <div className="mt-5 flex gap-4">
            {site.social.map((s) => {
              const icon = <Icon name={s.platform} className="h-5 w-5" />;
              const className = "grid h-10 w-10 place-items-center rounded-xl bg-white/8 text-white/60 transition hover:bg-primary hover:text-white";
              return s.url
                ? <a key={s.platform} href={s.url} target={s.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={className} aria-label={s.platform}>{icon}</a>
                : <span key={s.platform} role="img" aria-label={s.platform} className={className}>{icon}</span>;
            })}
          </div>
        </div>
        <FLinks title={t.footer.quick} items={site.nav} />
        <FLinks title={t.footer.courses} items={site.footerCourseLinks} />
        <FLinks title="Hjälp & support" items={site.footerHelpLinks} />
        <div>
          <h3 className="text-sm font-bold text-white">{t.footer.contact}</h3>
          <div className="mt-5 space-y-4 text-sm text-white/55">
            <a href={site.phone.href} className="flex items-center gap-3 hover:text-white"><Icon name="phone" className="h-4 w-4 text-primary-400" /> {site.phone.display}</a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-white"><Icon name="mail" className="h-4 w-4 text-primary-400" /> {site.email}</a>
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="flex items-start gap-3 hover:text-white"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" /> {site.address}</a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-xs text-white/40">
        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <p>{site.copyright} {t.footer.rights}</p>
          <p>{t.footer.city} 🇸🇪</p>
        </div>
        <nav aria-label="Juridisk information" className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {site.footerLegalLinks.map((item) => <CmsLink key={item.href} href={item.href} className="transition hover:text-white">{item.label}</CmsLink>)}
          <a href={site.drivingLicenceUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Körkortstillstånd</a>
        </nav>
      </div>
    </footer>
  );
}
