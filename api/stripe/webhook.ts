import Stripe from "stripe";

type Request = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> };
type Response = { status: (code: number) => Response; json: (body: unknown) => void };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2026-08-26.dahlia" });
const processedEvents = new Set<string>();
export const config = { api: { bodyParser: false } };

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || typeof signature !== "string") return res.status(400).json({ error: "Webhook verification is not configured." });
  try {
    const rawBody = typeof req.body === "string" || Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body);
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    if (processedEvents.has(event.id)) return res.status(200).json({ received: true, duplicate: true });
    processedEvents.add(event.id);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info("Stripe checkout completed", session.id);
    } else if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.warn("Stripe checkout payment failed", session.id);
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : "Invalid webhook." });
  }
}