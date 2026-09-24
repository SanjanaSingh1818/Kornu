import { PageShell } from "../components/PageShell";
import { Icon } from "../components/Icon";
import { useLanguage } from "../i18n";

export function PaymentSuccessPage() {
  const { t } = useLanguage();
  const sessionId = new URLSearchParams(window.location.search).get("session_id");
  const hasValidSessionId = /^cs_[A-Za-z0-9_]+$/.test(sessionId ?? "");

  return (
    <PageShell eyebrow={t.pay.checkout} title={t.pay.successTitle} text={t.pay.successPendingText}>
      <section className="bg-primary-50 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,.10)] sm:p-12">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-100 text-primary-700">
            <Icon name="check" className="h-8 w-8" />
          </div>
          <h2 className="mt-8 text-3xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-4xl">{t.pay.successTitle}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{t.pay.successPendingText}</p>
          {hasValidSessionId && <p className="mt-5 text-sm font-semibold text-primary-700">{t.pay.sessionReceived}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/packages" className="inline-flex min-h-12 items-center justify-center rounded-full bg-dark px-6 text-sm font-bold text-white transition hover:bg-slate-800">{t.nav.packages}</a>
            <a href="/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 px-6 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:text-slate-950">{t.nav.home}</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function PaymentCancelledPage() {
  const { t } = useLanguage();
  return <PageShell eyebrow={t.pay.checkout} title={t.pay.cancelled} text={t.pay.cancelledText}><div /></PageShell>;
}