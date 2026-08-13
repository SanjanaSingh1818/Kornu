import { PageShell } from "../components/PageShell";
import { SimulatorSection } from "../components/home";
import { useLanguage } from "../i18n";

export function SimulatorPage({ onLaunch }: { onLaunch: () => void }) {
  const { t } = useLanguage();
  return (
    <PageShell eyebrow={t.pages.simulator[0]} title={t.pages.simulator[1]} text={t.pages.simulator[2]}>
      <SimulatorSection onLaunch={onLaunch} />
    </PageShell>
  );
}
