import { PageShell } from "../components/PageShell";
import { useLanguage } from "../i18n";

export function PaymentSuccessPage() {
  const { t } = useLanguage();
  return <PageShell eyebrow={t.pay.checkout} title={t.pay.successPending} text={t.pay.successPendingText}><div /></PageShell>;
}

export function PaymentCancelledPage() {
  const { t } = useLanguage();
  return <PageShell eyebrow={t.pay.checkout} title={t.pay.cancelled} text={t.pay.cancelledText}><div /></PageShell>;
}