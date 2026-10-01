import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { ContactForm } from "./components/ContactForm";
import { VisitUs } from "./components/home";
import { Header } from "./components/Header";
import { getPagePath, NavigateContext } from "./routing";
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
    try {
      if (!pkg.priceId) {
        throw new Error("This product is not configured for Stripe Checkout yet.");
      }
      window.location.assign(await createCheckoutSession(pkg.priceId, "priceId"));
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout.");
      setCheckoutLoading(false);
    }
  }, []);

  const navigate = useCallback((nextPath: PagePath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onPop = () => {
      setPath(getPagePath(window.location.pathname));
      setCheckoutLoading(false);
    };
    const onPageShow = () => setCheckoutLoading(false);

    window.addEventListener("popstate", onPop);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return (
    <LanguageProvider>
      <NavigateContext.Provider value={navigate}>
      <main className="min-h-screen overflow-hidden bg-primary-50 text-slate-950 antialiased">
        <Header path={path} onNavigate={navigate} />
        {path === "/" && <HomePage onSelect={startCheckout} loading={checkoutLoading} onLaunch={() => setShowSim(true)} />}
        {path === "/courses" && <CoursesPage />}
        {path === "/packages" && <PackagesPage onSelect={startCheckout} loading={checkoutLoading} />}
        {path === "/payment-success" && <PaymentSuccessPage />}
        {path === "/payment-cancelled" && <PaymentCancelledPage />}
        {path === "/simulator" && <SimulatorPage onLaunch={() => setShowSim(true)} />}
        {path === "/gallery" && <GalleryPage />}
        {path === "/about" && <AboutPage />}
        {path === "/contact" && <ContactPage />}
        <ContactForm />
        {/* Contact ("Skriv in dig") page: address, hours and map below the form */}
        {path === "/contact" && <VisitUs />}
        <Footer />
        {checkoutError && <div role="alert" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-700">{checkoutError}</div>}
        {showSim && (
          <Suspense fallback={<div className="fixed inset-0 z-[60] grid place-items-center bg-dark text-white text-lg font-bold">Loading simulator...</div>}>
            <DrivingSimulator onClose={() => setShowSim(false)} />
          </Suspense>
        )}
      </main>
      </NavigateContext.Provider>
    </LanguageProvider>
  );
}
