import { PageShell } from "../components/PageShell";
import { Courses, Journey } from "../components/home";

export function CoursesPage() {
  return (
    <PageShell eyebrow="Kurser" title="Körkortsutbildning för din vardag." text="Manuell, automat, intensivkurs och kompletterande körmoment med erfarna lärare nära Trafikverket i Högsbo.">
      <Courses />
      <Journey />
    </PageShell>
  );
}
