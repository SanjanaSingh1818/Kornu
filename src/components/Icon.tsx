export function Icon({ name, className = "" }: { name: string; className?: string }) {
  const p = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

  switch (name) {
    case "arrow": return <svg {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
    case "phone": return <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.7 19.7 0 0 1-8.59-3.07 19.36 19.36 0 0 1-6-6A19.7 19.7 0 0 1 2.18 4.18 2 2 0 0 1 4.16 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.8.62 2.65a2 2 0 0 1-.45 2.11L8.09 9.72a16 16 0 0 0 6.19 6.19l1.24-1.24a2 2 0 0 1 2.11-.45c.85.29 1.74.5 2.65.62A2 2 0 0 1 22 16.92Z" /></svg>;
    case "mail": return <svg {...p}><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="m22 6-10 7L2 6" /></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>;
    case "car": return <svg {...p}><path d="M5 17h14" /><path d="M5 17a2 2 0 1 0 4 0" /><path d="M15 17a2 2 0 1 0 4 0" /><path d="M4 17v-5l3-6h10l3 6v5" /><path d="M6 12h12" /></svg>;
    case "person": return <svg {...p}><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>;
    case "pin": return <svg {...p}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "check": return <svg {...p}><path d="M20 6 9 17l-5-5" /></svg>;
    case "lock": return <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    case "star": return <svg className={className} viewBox="0 0 24 24" aria-hidden><path d="m12 2.8 2.84 5.75 6.34.92-4.59 4.47 1.08 6.31L12 17.27l-5.67 2.98 1.08-6.31-4.59-4.47 6.34-.92L12 2.8Z" /></svg>;
    case "facebook": return <svg {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" /></svg>;
    case "instagram": return <svg {...p}><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" /><path d="M17.5 6.5h.01" /></svg>;
    default: return null;
  }
}
