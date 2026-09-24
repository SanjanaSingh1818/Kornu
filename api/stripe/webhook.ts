import Stripe from "stripe";
import { getStripe } from "./server";

type Request = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  [Symbol.asyncIterator]?: () => AsyncIterator<Buffer | string>;
};
type Response = { status: (code: number) => Response; json: (body: unknown) => void };

const maxRuntimeProcessedEvents = 500;
const runtimeProcessedEventIds = new Set<string>();
export const config = { api: { bodyParser: false } };

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || typeof signature !== "string") return res.status(400).json({ error: "Webhook verification is not configured." });
  try {
    const stripe = getStripe();
    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    // Runtime-only retry guard. This is not durable idempotency across deployments or serverless instances.
    if (runtimeProcessedEventIds.has(event.id)) return res.status(200).json({ received: true, duplicate: true });
    rememberRuntimeEvent(event.id);

    switch (event.type) {
      case "checkout.session.completed":
        handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.async_payment_succeeded":
        handleCheckoutSessionAsyncPaymentSucceeded(event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.async_payment_failed":
        handleCheckoutSessionAsyncPaymentFailed(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : "Invalid webhook." });
  }
}

async function readRawBody(req: Request): Promise<string | Buffer> {
  if (typeof req.body === "string" || Buffer.isBuffer(req.body)) return req.body;
  if (req.body !== undefined) return JSON.stringify(req.body);
  if (typeof req[Symbol.asyncIterator] !== "function") return "";

  const chunks: Buffer[] = [];
  for await (const chunk of req as AsyncIterable<Buffer | string>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function rememberRuntimeEvent(eventId: string) {
  runtimeProcessedEventIds.add(eventId);
  if (runtimeProcessedEventIds.size <= maxRuntimeProcessedEvents) return;

  const oldestEventId = runtimeProcessedEventIds.values().next().value;
  if (oldestEventId) runtimeProcessedEventIds.delete(oldestEventId);
}

function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const logPayload = getCheckoutSessionLogPayload(session);
  if (session.payment_status === "paid") {
    console.info("Stripe checkout completed with paid payment", logPayload);
    return;
  }

  console.info("Stripe checkout completed with pending payment", logPayload);
}

function handleCheckoutSessionAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
  console.info("Stripe checkout async payment succeeded", getCheckoutSessionLogPayload(session));
}

function handleCheckoutSessionAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  console.warn("Stripe checkout async payment failed", getCheckoutSessionLogPayload(session));
}

function getCheckoutSessionLogPayload(session: Stripe.Checkout.Session) {
  return {
    id: session.id,
    payment_status: session.payment_status,
    amount_total: session.amount_total,
    currency: session.currency,
    packageId: session.metadata?.packageId,
  };
}
