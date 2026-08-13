import { PageShell } from "../components/PageShell";
import { ContactDetails, FinalCta } from "../components/home";
import { useLanguage } from "../i18n";

export function ContactPage({ onBook }: { onBook: () => void }) {
  const { t } = useLanguage();
  return (
    <PageShell eyebrow={t.pages.contact[0]} title={t.pages.contact[1]} text={t.pages.contact[2]}>
      <FinalCta onBook={onBook} />
      <ContactDetails />
    </PageShell>
  );
}
