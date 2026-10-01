import { Fragment, type ReactNode } from "react";
import type { HomeSectionKey } from "../content/defaults";
import { useLanguage } from "../i18n";
import type { Package } from "../types";
import { BenefitBar, BrakingDistanceVisualizer, Courses, FinalCta, Gallery, Hero, Journey, Packages, ReviewsCarousel, SimulatorSection, TheoryQuiz, Trainers, VisitUs } from "../components/home";

export function HomePage({ onSelect, onLaunch, loading }: { onSelect: (p: Package) => void; onLaunch: () => void; loading?: boolean }) {
  const { site } = useLanguage();
  // Section order and visibility come from the "Home page" document in Sanity.
  const sections: Record<HomeSectionKey, ReactNode> = {
    hero: <Hero />,
    benefits: <BenefitBar />,
    journey: <Journey />,
    courses: <Courses />,
    packages: <Packages onSelect={onSelect} loading={loading} />,
    quiz: <TheoryQuiz />,
    simulator: <SimulatorSection onLaunch={onLaunch} />,
    braking: <BrakingDistanceVisualizer />,
    reviews: <ReviewsCarousel />,
    trainers: <Trainers />,
    gallery: <Gallery preview />,
    finalCta: <FinalCta />,
    visit: <VisitUs />,
  };

  return (
    <>
      {site.homeSections.map((key) => <Fragment key={key}>{sections[key]}</Fragment>)}
    </>
  );
}
