import type { Package } from "../types";
import { BenefitBar, BrakingDistanceVisualizer, FinalCta, Gallery, Hero, Journey, Packages, ReviewsCarousel, SimulatorSection, TheoryQuiz, VisitUs } from "../components/home";

export function HomePage({ onBook, onSelect, onLaunch }: { onBook: () => void; onSelect: (p: Package) => void; onLaunch: () => void }) {
  return (
    <>
      <Hero onBook={onBook} />
      <BenefitBar />
      <Journey />
      <Packages onSelect={onSelect} />
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
