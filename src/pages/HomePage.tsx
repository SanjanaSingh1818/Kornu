import type { Package } from "../types";
import { BenefitBar, Courses, FinalCta, Gallery, Hero, Journey, Packages, SimulatorSection } from "../components/home";

export function HomePage({ onBook, onSelect, onLaunch }: { onBook: () => void; onSelect: (p: Package) => void; onLaunch: () => void }) {
  return (
    <>
      <Hero onBook={onBook} />
      <BenefitBar />
      <Journey />
      <Packages onSelect={onSelect} />
      <Courses />
      <SimulatorSection onLaunch={onLaunch} />
      <Gallery preview />
      <FinalCta onBook={onBook} />
    </>
  );
}
