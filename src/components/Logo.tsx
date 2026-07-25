export function Logo({ className = "h-12", light = false }: { className?: string; light?: boolean }) {
  return (
    <img
      src="/images/logo.avif"
      alt="Kör Nu Trafikskola"
      className={`${className} w-auto object-contain ${light ? "drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]" : ""}`}
    />
  );
}
