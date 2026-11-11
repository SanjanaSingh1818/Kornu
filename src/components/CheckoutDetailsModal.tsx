import { useEffect, type FormEvent } from "react";
import { useLanguage } from "../i18n";
import type { Package } from "../types";
import { normalizeSwedishPersonalNumber } from "../utils/swedish-personal-number";

export type CheckoutCustomerDetails = {
  name: string;
  email: string;
  phone: string;
  personalNumber: string;
};

type CheckoutDetailsModalProps = {
  product: Package;
  loading: boolean;
  onClose: () => void;
  onSubmit: (details: CheckoutCustomerDetails) => void;
};

const checkoutCopy = {
  sv: { title: "Dina uppgifter", text: "Fyll i uppgifterna för din beställning.", continue: "Fortsätt till betalning", submitting: "Öppnar betalning...", privacy: "Uppgifterna används för att hantera köpet.", personalNumberPrivacy: "Personnumret sparas i Stripe och inkluderas i ordermejlet. E-post är inte krypterad.", invalidPersonalNumber: "Ange ett giltigt svenskt personnummer, till exempel ÅÅÅÅMMDD-XXXX." },
  en: { title: "Your details", text: "Add your details for this order.", continue: "Continue to payment", submitting: "Opening payment...", privacy: "Your details are used to process your order.", personalNumberPrivacy: "Your personal number is stored in Stripe and included in the order email. Email is not encrypted.", invalidPersonalNumber: "Enter a valid Swedish personal identity number, for example YYYYMMDD-XXXX." },
  ar: { title: "بياناتك", text: "أدخل بياناتك لإتمام الطلب.", continue: "متابعة إلى الدفع", submitting: "جارٍ فتح الدفع...", privacy: "تُستخدم بياناتك لمعالجة طلبك.", personalNumberPrivacy: "يُحفظ رقم الهوية في Stripe ويُدرج في رسالة الطلب. البريد الإلكتروني غير مشفر.", invalidPersonalNumber: "أدخل رقم هوية سويديًا صالحًا، مثل YYYYMMDD-XXXX." },
} as const;

export function CheckoutDetailsModal({ product, loading, onClose, onSubmit }: CheckoutDetailsModalProps) {
  const { lang, t } = useLanguage();
  const copy = checkoutCopy[lang];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    const formData = new FormData(event.currentTarget);
    const personalNumber = normalizeSwedishPersonalNumber(String(formData.get("personalNumber") ?? ""));
    const personalNumberInput = event.currentTarget.elements.namedItem("personalNumber");
    if (!(personalNumberInput instanceof HTMLInputElement)) return;
    personalNumberInput.setCustomValidity(personalNumber ? "" : copy.invalidPersonalNumber);
    if (!personalNumber) {
      personalNumberInput.reportValidity();
      return;
    }
    onSubmit({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      personalNumber,
    });
  };

  const currency = product.currency?.toUpperCase() || "SEK";

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/60 p-3 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-details-title"
        className="my-auto w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="checkout-details-title" className="text-xl font-extrabold text-primary-dark">{copy.title}</h2>
            <p className="mt-1 text-sm leading-5 text-slate-600">{copy.text}</p>
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-100 text-lg text-slate-600 disabled:opacity-50" aria-label={t.pay.close}>×</button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-primary-50 px-3 py-2.5">
          <p className="min-w-0 truncate text-sm font-bold text-primary-dark">{product.name}</p>
          <p className="shrink-0 text-sm font-extrabold text-primary-dark">{product.price.toLocaleString("sv-SE")} {currency}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-700">{t.contactForm.fullName} *</span>
            <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={120} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-700">{t.contactForm.email} *</span>
            <input name="email" type="email" autoComplete="email" required maxLength={254} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-700">{t.contactForm.phone} *</span>
            <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={25} pattern="[+0-9() .-]{7,25}" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-700">{t.contactForm.personalNumber} *</span>
            <input
              name="personalNumber"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              required
              maxLength={15}
              placeholder={t.contactForm.personalNumberPlaceholder}
              onInput={(event) => event.currentTarget.setCustomValidity("")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <button type="submit" disabled={loading} className="sm:col-span-2 w-full rounded-xl bg-primary-dark px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary disabled:cursor-wait disabled:opacity-60">
            {loading ? copy.submitting : copy.continue}
          </button>
          <p className="sm:col-span-2 text-center text-[11px] leading-4 text-slate-500">
            {copy.privacy} <a href="/integritetspolicy" className="font-semibold text-primary-dark underline">{lang === "sv" ? "Integritetspolicy" : lang === "en" ? "Privacy policy" : "سياسة الخصوصية"}</a>. {t.pay.secure}
          </p>
          <p className="sm:col-span-2 -mt-2 text-center text-[10px] leading-4 text-slate-500">{copy.personalNumberPrivacy}</p>
        </form>
      </section>
    </div>
  );
}
