import { NAV } from "../data";
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
  return (
    <footer className="bg-dark px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/55">Kör Nu Trafikskola i Göteborg hjälper nya förare att bli trygga, säkra och självständiga. Utbildning på svenska, engelska, kurdiska och arabiska.</p>
          <div className="mt-5 flex gap-4">
            {["facebook", "instagram"].map((s) => (
              <a key={s} href="#" className="grid h-10 w-10 place-items-center rounded-xl bg-white/8 text-white/60 transition hover:bg-primary hover:text-white" aria-label={s}>
                <Icon name={s} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        <FLinks title="Snabblänkar" items={NAV} onNavigate={onNavigate} />
        <FLinks title="Kurser" items={[
          { label: "Manuell körning", path: "/courses" },
          { label: "Automat körning", path: "/courses" },
          { label: "Risk 1", path: "/courses" },
          { label: "Risk 2", path: "/courses" },
          { label: "Intensivkurs", path: "/courses" },
        ]} onNavigate={onNavigate} />
        <div>
          <h3 className="text-sm font-bold text-white">Kontakt</h3>
          <div className="mt-5 space-y-4 text-sm text-white/55">
            <a href="tel:031-3860086" className="flex items-center gap-3 hover:text-white"><Icon name="phone" className="h-4 w-4 text-primary-400" /> 031‑386 00 86</a>
            <a href="mailto:info@kornu.se" className="flex items-center gap-3 hover:text-white"><Icon name="mail" className="h-4 w-4 text-primary-400" /> info@kornu.se</a>
            <a href="https://maps.app.goo.gl/WvBrSCZimUimjE9x7" target="_blank" rel="noopener" className="flex items-start gap-3 hover:text-white"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" /> Västra Frölunda, nära Trafikverket, Högsbo, Göteborg</a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/35 sm:flex-row">
        <p>© 2026 Kör Nu Trafikskola AB. Alla rättigheter förbehållna.</p>
        <p>Körskola i Göteborg 🇸🇪</p>
      </div>
    </footer>
  );
}
