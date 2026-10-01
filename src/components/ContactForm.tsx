import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { useLanguage } from "../i18n";
import { Icon } from "./Icon";

type ContactFormProps = {
  presentation?: "section" | "modal";
  onClose?: () => void;
};

export function ContactForm({ presentation = "section", onClose }: ContactFormProps) {
  const { t } = useLanguage();
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<"idle" | "success" | "error">("idle");
  const isModal = presentation === "modal";

  useEffect(() => {
    if (!isModal || !onClose) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModal, onClose]);

  useEffect(() => {
    if (!isModal || submissionState !== "success" || !onClose) return;

    const timeout = window.setTimeout(onClose, 1800);
    return () => window.clearTimeout(timeout);
  }, [isModal, onClose, submissionState]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !formRef.current) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const contactTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const autoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !contactTemplateId || !autoReplyTemplateId || !publicKey) {
      console.error("EmailJS configuration is incomplete.");
      setSubmissionState("error");
      return;
    }

    setIsSubmitting(true);
    setSubmissionState("idle");

    try {
      // Send the enquiry to the business.
      await emailjs.sendForm(
        serviceId,
        contactTemplateId,
        formRef.current,
        { publicKey }
      );

      // Send the confirmation to the customer.
      await emailjs.sendForm(
        serviceId,
        autoReplyTemplateId,
        formRef.current,
        { publicKey }
      );

      formRef.current.reset();
      setSubmissionState("success");
    } catch (error) {
      console.error("EmailJS submission failed:", error);
      setSubmissionState("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-x-5 gap-y-5 sm:grid-cols-2"
    >
      <label className="sm:col-span-2">
        <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
          {t.contactForm.fullName} *
        </span>
        <input
          id={`${formId}-name`}
          name="full_name"
          type="text"
          autoComplete="name"
          required
          placeholder={t.contactForm.namePlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <label>
        <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
          {t.contactForm.email} *
        </span>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t.contactForm.emailPlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <label>
        <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
          {t.contactForm.phone} *
        </span>
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder={t.contactForm.phonePlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <label>
        <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
          {t.contactForm.personalNumber} *
        </span>
        <input
          id={`${formId}-personal-number`}
          name="personal_number"
          type="text"
          autoComplete="off"
          required
          placeholder={t.contactForm.personalNumberPlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <label>
        <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
          {t.contactForm.startDate} *
        </span>
        <input
          id={`${formId}-start-date`}
          name="start_date"
          type="date"
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <label className="sm:col-span-2">
        <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
          {t.pay.transmission} *
        </span>
        <select
          id={`${formId}-transmission`}
          name="transmission"
          required
          defaultValue=""
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        >
          <option value="" disabled>{t.pay.transmission}</option>
          <option value="manual">{t.pay.manual}</option>
          <option value="automatic">{t.pay.automatic}</option>
        </select>
      </label>

      <label className="sm:col-span-2">
        <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
          {t.contactForm.message} *
        </span>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={3}
          placeholder={t.contactForm.messagePlaceholder}
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <div className="sm:col-span-2">
        {submissionState === "success" && (
          <p
            role="status"
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
          >
            {t.contactForm.success}
          </p>
        )}

        {submissionState === "error" && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {t.contactForm.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? t.contactForm.sending : t.contactForm.submit}
          {!isSubmitting && <Icon name="arrow" className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-70 grid place-items-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose?.();
        }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${formId}-title`}
          className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t.contactForm.close}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            ×
          </button>

          <div className="border-b border-slate-100 bg-slate-50 px-6 py-6 pr-16 sm:px-8">
            <p className="text-xs font-black uppercase tracking-[.18em] text-primary">
              {t.contactForm.eyebrow}
            </p>
            <h2
              id={`${formId}-title`}
              className="mt-2 text-2xl font-extrabold text-primary-dark"
            >
              {t.contactForm.title}
            </h2>
          </div>

          <div className="p-6 sm:p-8">{fields}</div>
        </section>
      </div>
    );
  }

  return (
    <section id="contact-form" className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative min-h-72 overflow-hidden bg-slate-200 lg:min-h-full">
          <img
            src="/images/kornu-about.webp"
            alt={t.contactForm.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 text-2xl font-extrabold text-white">
            {t.contactForm.imageCaption}
          </p>
        </div>

        <div className="p-6 sm:p-9 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[.18em] text-primary">
            {t.contactForm.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-primary-dark sm:text-3xl">
            {t.contactForm.title}
          </h2>
          <p className="mb-7 mt-2 text-sm leading-6 text-slate-600">
            {t.contactForm.text}
          </p>
          {fields}
        </div>
      </div>
    </section>
  );
}