import { PageShell } from "../components/PageShell";
import { SimulatorSection } from "../components/home";

export function SimulatorPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <PageShell eyebrow="Simulator" title="Öva innan trafiken känns skarp." text="Träna reaktion, observation, stadskörning, motorväg och mörkerkörning i Kör Nu-simulatorn.">
      <SimulatorSection onLaunch={onLaunch} />
    </PageShell>
  );
}
