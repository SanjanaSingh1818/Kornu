import { useLanguage } from "../i18n";

export function Logo({ className = "h-12", light = false }: { className?: string; light?: boolean }) {
  const { site } = useLanguage();
  return (
    <img
      src={site.logo}
      alt={site.siteName}
      className={`${className} w-auto object-contain ${light ? "drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]" : ""}`}
    />
  );
}
