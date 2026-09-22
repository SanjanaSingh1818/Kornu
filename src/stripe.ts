import type { Package } from "./types";

export async function createCheckoutSession(packageId: Package["id"]): Promise<string> {
  const response = await fetch("/api/create-checkout-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packageId }) });
  const body = await response.text();
  let payload: { url?: string; error?: string } = {};
  try {
    payload = JSON.parse(body) as { url?: string; error?: string };
  } catch {
    payload.error = response.status === 404 ? "Checkout API is unavailable in this local Vite session. Use Vercel preview or vercel dev." : "Unable to start Stripe Checkout.";
  }
  if (!response.ok || !payload.url) throw new Error(payload.error || "Unable to start Stripe Checkout.");
  return payload.url;
}