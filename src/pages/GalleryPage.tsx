import { PageShell } from "../components/PageShell";
import { Gallery } from "../components/home";

export function GalleryPage() {
  return (
    <PageShell eyebrow="Gallery" title="Elever, bilar och ögonblick från Kör Nu." text="En samlad bildbank med Kör Nu Trafikskola och våra glada elever som klarat vägen till körkortet.">
      <Gallery />
    </PageShell>
  );
}
