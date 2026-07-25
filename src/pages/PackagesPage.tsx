import { PageShell } from "../components/PageShell";
import { Packages } from "../components/home";
import type { Package } from "../types";

export function PackagesPage({ onSelect }: { onSelect: (p: Package) => void }) {
  return (
    <PageShell eyebrow="Paket & priser" title="Tydliga paket utan krångel." text="Välj ett startpaket, totalpaket eller intensiv upplägg. Vi hjälper dig hitta rätt nivå innan du bokar.">
      <Packages onSelect={onSelect} />
    </PageShell>
  );
}
