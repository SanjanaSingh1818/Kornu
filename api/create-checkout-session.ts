import Stripe from "stripe";

type Request = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> };
type Response = { status: (code: number) => Response; json: (body: unknown) => void };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2026-08-26.dahlia" });
const priceEnvByPackage: Record<string, string> = {
  "pkt-5": "STRIPE_PRICE_ID_PKT_5",
  "pkt-total-5": "STRIPE_PRICE_ID_PKT_TOTAL_5",
  "pkt-10": "STRIPE_PRICE_ID_PKT_10",
  "pkt-mellan": "STRIPE_PRICE_ID_PKT_MELLAN",
  "pkt-stor": "STRIPE_PRICE_ID_PKT_STOR",
  "pkt-intensiv": "STRIPE_PRICE_ID_PKT_INTENSIV",
};

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: "Stripe is not configured." });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const packageId = body && typeof body === "object" && "packageId" in body && typeof body.packageId === "string" ? body.packageId : "";
    const envName = priceEnvByPackage[packageId];
    const priceId = envName ? process.env[envName] : undefined;
    if (!priceId || !/^price_[A-Za-z0-9]+$/.test(priceId)) return res.status(400).json({ error: "This package is not configured for Stripe Checkout yet." });
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.currency !== "sek") return res.status(400).json({ error: "The configured Stripe Price must be active and denominated in SEK." });
    const session = await stripe.checkout.sessions.create({ mode: "payment", line_items: [{ price: price.id, quantity: 1 }], success_url: `${getOrigin(req)}/payment-success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${getOrigin(req)}/payment-cancelled`, metadata: { packageId } });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Checkout Session." });
  }
}

function getOrigin(req: Request) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = typeof forwardedHost === "string" ? forwardedHost : Array.isArray(forwardedHost) ? forwardedHost[0] : typeof req.headers.host === "string" ? req.headers.host : "localhost:5173";
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string" ? forwardedProto : Array.isArray(forwardedProto) ? forwardedProto[0] : host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}