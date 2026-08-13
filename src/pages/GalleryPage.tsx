import { PageShell } from "../components/PageShell";
import { Gallery } from "../components/home";
import { useLanguage } from "../i18n";

export function GalleryPage() {
  const { t } = useLanguage();
  return (
    <PageShell eyebrow={t.pages.gallery[0]} title={t.pages.gallery[1]} text={t.pages.gallery[2]}>
      <Gallery />
    </PageShell>
  );
}
