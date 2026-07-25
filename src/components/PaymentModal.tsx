import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import type { Package } from "../types";
import { Icon } from "./Icon";

type PayStep = "form" | "processing" | "success";

export function PaymentModal({ pkg, onClose }: { pkg: Package; onClose: () => void }) {
  const [step, setStep] = useState<PayStep>("form");
  const [method, setMethod] = useState<"card" | "swish">("card");
  const [form, setForm] = useState({ name: "", email: "", phone: "", cardNum: "", expiry: "", cvc: "" });

  const set = useCallback((k: string, v: string) => setForm((f) => ({ ...f, [k]: v })), []);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => setStep("success"), 2200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: .96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 24 }} transition={{ type: "spring", damping: 28, stiffness: 340 }} className="modal-content">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary-100 bg-white/95 px-6 py-4 backdrop-blur-xl rounded-t-3xl">
          <h2 className="text-lg font-extrabold text-dark">{step === "success" ? "Betalning genomförd" : "Slutför betalning"}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-slate-500 transition hover:bg-primary-100" aria-label="Stäng">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {step === "form" && (
          <form onSubmit={handlePay} className="space-y-5 p-6">
            <div className="rounded-xl bg-primary-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Valt paket</p>
              <p className="mt-1 text-lg font-extrabold text-dark">{pkg.name}</p>
              <p className="text-sm text-slate-600">{pkg.lessons}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-dark">{pkg.price.toLocaleString("sv-SE")} kr</span>
                {pkg.originalPrice && <span className="text-sm text-slate-400 line-through">{pkg.originalPrice.toLocaleString("sv-SE")} kr</span>}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-dark">Kontaktuppgifter</p>
              <input className="pay-input" placeholder="Namn" required value={form.name} onChange={(e) => set("name", e.target.value)} />
              <input className="pay-input" type="email" placeholder="E-post" required value={form.email} onChange={(e) => set("email", e.target.value)} />
              <input className="pay-input" type="tel" placeholder="Telefon" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-dark">Betalningsmetod</p>
              <div className="flex gap-2 rounded-xl bg-primary-50 p-1.5">
                <button type="button" onClick={() => setMethod("card")} className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${method === "card" ? "bg-white text-dark shadow-sm" : "text-slate-500"}`}>
                  💳 Kort
                </button>
                <button type="button" onClick={() => setMethod("swish")} className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${method === "swish" ? "bg-white text-dark shadow-sm" : "text-slate-500"}`}>
                  📱 Swish
                </button>
              </div>
            </div>

            {method === "card" ? (
              <div className="space-y-3">
                <input className="pay-input" placeholder="Kortnummer" required maxLength={19} value={form.cardNum} onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
                  set("cardNum", v);
                }} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="pay-input" placeholder="MM / ÅÅ" required maxLength={7} value={form.expiry} onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2);
                    set("expiry", v);
                  }} />
                  <input className="pay-input" placeholder="CVC" required maxLength={4} type="password" value={form.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Icon name="lock" className="h-3.5 w-3.5 text-primary" />
                  Säker betalning krypterad med SSL
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-primary-200/60 bg-primary-50/50 p-5 text-center">
                <p className="text-4xl">📱</p>
                <p className="mt-3 text-sm font-semibold text-dark">Betala med Swish</p>
                <p className="mt-2 text-sm text-slate-600">Du kommer att omdirigeras till Swish-appen för att slutföra betalningen på <strong>{pkg.price.toLocaleString("sv-SE")} kr</strong>.</p>
              </div>
            )}

            <button type="submit" className="w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-[0_12px_32px_rgba(11,132,87,0.3)] transition hover:-translate-y-0.5 hover:bg-primary-600">
              {method === "card" ? `Betala ${pkg.price.toLocaleString("sv-SE")} kr` : "Öppna Swish"}
            </button>
          </form>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-200 border-t-primary" />
            </div>
            <p className="mt-6 text-lg font-bold text-dark">Bearbetar betalning...</p>
            <p className="mt-2 text-sm text-slate-500">Vänligen vänta medan vi verifierar din betalning.</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} className="grid h-20 w-20 place-items-center rounded-full bg-primary-100">
              <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </motion.div>
            <h3 className="mt-6 text-2xl font-extrabold text-dark">Betalning genomförd!</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Tack för din bokning av <strong>{pkg.name}</strong>. Vi har skickat en bekräftelse till din e-post. Kör Nu Trafikskola kontaktar dig inom 24 timmar för att boka din första lektion.
            </p>
            <div className="mt-6 rounded-xl bg-primary-50 px-5 py-3 text-sm font-bold text-primary">
              Ordernummer: KN-{Date.now().toString(36).toUpperCase().slice(-6)}
            </div>
            <button onClick={onClose} className="mt-8 rounded-xl bg-dark px-8 py-3 text-sm font-bold text-white transition hover:bg-primary-900">
              Stäng
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
