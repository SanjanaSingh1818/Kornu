import type { Package } from "../types";
import { BenefitBar, BrakingDistanceVisualizer, FinalCta, Gallery, Hero, Journey, Packages, ReviewsCarousel, SimulatorSection, TheoryQuiz, Trainers, VisitUs } from "../components/home";

export function HomePage({ onBook, onSelect, onLaunch, loading }: { onBook: () => void; onSelect: (p: Package) => void; onLaunch: () => void; loading?: boolean }) {
  return (
    <>
      <Hero onBook={onBook} />
      <BenefitBar />
      <Journey />
      <Trainers />
      <Packages onSelect={onSelect} loading={loading} />
      <TheoryQuiz />
      <SimulatorSection onLaunch={onLaunch} />
      <BrakingDistanceVisualizer />
      <ReviewsCarousel />
      <Gallery preview />
      <FinalCta onBook={onBook} />
      <VisitUs />
    </>
  );
}
