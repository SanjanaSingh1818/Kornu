import { useEffect, type FormEvent } from "react";
import { useLanguage } from "../i18n";
import type { Package } from "../types";

export type CheckoutCustomerDetails = {
  name: string;
  email: string;
  phone: string;
};

type CheckoutDetailsModalProps = {
  product: Package;
  loading: boolean;
  onClose: () => void;
  onSubmit: (details: CheckoutCustomerDetails) => void;
};

const checkoutCopy = {
  sv: { title: "Dina uppgifter", text: "Fyll i dina kontaktuppgifter innan du fortsätter till säker betalning.", continue: "Fortsätt till betalning", submitting: "Öppnar betalning...", required: "Obligatoriskt", privacy: "Vi använder uppgifterna för att hantera ditt köp och kontakta dig om din beställning." },
  en: { title: "Your details", text: "Enter your contact details before continuing to secure payment.", continue: "Continue to payment", submitting: "Opening payment...", required: "Required", privacy: "We use these details to process your purchase and contact you about your order." },
  ar: { title: "بياناتك", text: "أدخل بيانات الاتصال قبل الانتقال إلى الدفع الآمن.", continue: "متابعة إلى الدفع", submitting: "جارٍ فتح الدفع...", required: "مطلوب", privacy: "نستخدم هذه البيانات لمعالجة طلبك والتواصل معك بشأنه." },
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
    onSubmit({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
    });
  };

  const currency = product.currency?.toUpperCase() || "SEK";

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-details-title"
        className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="checkout-details-title" className="text-2xl font-extrabold text-primary-dark">{copy.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{copy.text}</p>
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 disabled:opacity-50" aria-label={t.pay.close}>×</button>
        </div>

        <div className="mt-5 rounded-2xl bg-primary-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{t.packages.price}</p>
          <p className="mt-1 font-extrabold text-primary-dark">{product.name} · {product.price.toLocaleString("sv-SE")} {currency}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">{t.contactForm.fullName} *</span>
            <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={120} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">{t.contactForm.email} *</span>
            <input name="email" type="email" autoComplete="email" required maxLength={254} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">{t.contactForm.phone} *</span>
            <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={25} pattern="[+0-9() .-]{7,25}" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary-dark px-5 py-3 font-bold text-white transition hover:bg-primary disabled:cursor-wait disabled:opacity-60">
            {loading ? copy.submitting : copy.continue}
          </button>
          <p className="text-center text-xs text-slate-500">{copy.required} · {t.pay.secure}</p>
          <p className="text-center text-xs leading-5 text-slate-500">
            {copy.privacy}{" "}
            <a href="/integritetspolicy" className="font-semibold text-primary-dark underline">{lang === "sv" ? "Läs integritetspolicyn." : lang === "en" ? "Read the privacy policy." : "اقرأ سياسة الخصوصية."}</a>
          </p>
        </form>
      </section>
    </div>
  );
}
