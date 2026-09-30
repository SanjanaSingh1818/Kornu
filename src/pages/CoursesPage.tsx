import { PageShell } from "../components/PageShell";
import { Courses, Journey } from "../components/home";
import { useLanguage } from "../i18n";
import type { Package } from "../types";

export function CoursesPage({ onSelect, loading }: { onSelect: (course: Package) => void; loading?: boolean }) {
  const { t } = useLanguage();
  return (
    <PageShell eyebrow={t.pages.courses[0]} title={t.pages.courses[1]} text={t.pages.courses[2]}>
      <Courses onSelect={onSelect} loading={loading} />
      <Journey />
    </PageShell>
  );
}
