import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { PaymentModal } from "./components/PaymentModal";
import { PACKAGES } from "./data";
import { getPagePath } from "./routing";
import type { Package, PagePath } from "./types";
import { ContactPage, CoursesPage, GalleryPage, HomePage, PackagesPage, SimulatorPage } from "./pages";

const DrivingSimulator = lazy(() => import("./DrivingSimulator"));

export default function App() {
  const [payModal, setPayModal] = useState<Package | null>(null);
  const [showSim, setShowSim] = useState(false);
  const [path, setPath] = useState<PagePath>(() => getPagePath(window.location.pathname));

  const openDefaultPackage = () => setPayModal(PACKAGES[2]);

  const navigate = useCallback((nextPath: PagePath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onPop = () => setPath(getPagePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-primary-50 text-slate-950 antialiased">
      <Header path={path} onNavigate={navigate} onBook={openDefaultPackage} />
      {path === "/" && <HomePage onBook={openDefaultPackage} onSelect={setPayModal} onLaunch={() => setShowSim(true)} />}
      {path === "/courses" && <CoursesPage />}
      {path === "/packages" && <PackagesPage onSelect={setPayModal} />}
      {path === "/simulator" && <SimulatorPage onLaunch={() => setShowSim(true)} />}
      {path === "/gallery" && <GalleryPage />}
      {path === "/contact" && <ContactPage onBook={openDefaultPackage} />}
      <Footer onNavigate={navigate} />
      <AnimatePresence>
        {payModal && <PaymentModal pkg={payModal} onClose={() => setPayModal(null)} />}
      </AnimatePresence>
      {showSim && (
        <Suspense fallback={<div className="fixed inset-0 z-[60] grid place-items-center bg-dark text-white text-lg font-bold">Laddar simulator...</div>}>
          <DrivingSimulator onClose={() => setShowSim(false)} />
        </Suspense>
      )}
    </main>
  );
}
