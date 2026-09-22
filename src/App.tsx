import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { PACKAGES } from "./data";
import { getPagePath } from "./routing";
import { LanguageProvider } from "./i18n";
import type { Package, PagePath } from "./types";
import { createCheckoutSession } from "./stripe";
import { AboutPage, ContactPage, CoursesPage, GalleryPage, HomePage, PackagesPage, PaymentCancelledPage, PaymentSuccessPage, SimulatorPage } from "./pages";

const DrivingSimulator = lazy(() => import("./DrivingSimulator"));

export default function App() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showSim, setShowSim] = useState(false);
  const [path, setPath] = useState<PagePath>(() => getPagePath(window.location.pathname));

  const startCheckout = useCallback(async (pkg: Package) => {
    setCheckoutError(null);
    setCheckoutLoading(true);
    try { window.location.assign(await createCheckoutSession(pkg.id)); } catch (error) { setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout."); setCheckoutLoading(false); }
  }, []);
  const openDefaultPackage = () => void startCheckout(PACKAGES[2]);

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
    <LanguageProvider>
      <main className="min-h-screen overflow-hidden bg-primary-50 text-slate-950 antialiased">
        <Header path={path} onNavigate={navigate} onBook={openDefaultPackage} />
        {path === "/" && <HomePage onBook={openDefaultPackage} onSelect={startCheckout} loading={checkoutLoading} onLaunch={() => setShowSim(true)} />}
        {path === "/courses" && <CoursesPage />}
        {path === "/packages" && <PackagesPage onSelect={startCheckout} loading={checkoutLoading} />}
        {path === "/payment-success" && <PaymentSuccessPage />}
        {path === "/payment-cancelled" && <PaymentCancelledPage />}
        {path === "/simulator" && <SimulatorPage onLaunch={() => setShowSim(true)} />}
        {path === "/gallery" && <GalleryPage />}
        {path === "/about" && <AboutPage />}
        {path === "/contact" && <ContactPage onBook={openDefaultPackage} />}
        <Footer onNavigate={navigate} />
        {checkoutError && <div role="alert" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-700">{checkoutError}</div>}
        {showSim && (
          <Suspense fallback={<div className="fixed inset-0 z-[60] grid place-items-center bg-dark text-white text-lg font-bold">Loading simulator...</div>}>
            <DrivingSimulator onClose={() => setShowSim(false)} />
          </Suspense>
        )}
      </main>
    </LanguageProvider>
  );
}
