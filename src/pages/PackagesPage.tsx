import { PageShell } from "../components/PageShell";
import { Packages } from "../components/home";
import { useLanguage } from "../i18n";
import type { Package } from "../types";

export function PackagesPage({ onSelect }: { onSelect: (p: Package) => void }) {
  const { t } = useLanguage();
  return (
    <PageShell eyebrow={t.pages.packages[0]} title={t.pages.packages[1]} text={t.pages.packages[2]}>
      <Packages onSelect={onSelect} />
    </PageShell>
  );
}
