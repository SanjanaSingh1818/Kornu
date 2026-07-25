import { PageShell } from "../components/PageShell";
import { ContactDetails, FinalCta } from "../components/home";

export function ContactPage({ onBook }: { onBook: () => void }) {
  return (
    <PageShell eyebrow="Kontakt" title="Prata med oss om ditt körkort." text="Du hittar oss på FO Petersons gata 6 i Västra Frölunda, precis bredvid Trafikverket i Högsbo.">
      <FinalCta onBook={onBook} />
      <ContactDetails />
    </PageShell>
  );
}
