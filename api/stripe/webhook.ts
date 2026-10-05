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
const orderNotificationTo = "info@kornu.se";
const defaultOrderNotificationFrom = "Kör Nu webbshop <order@kornu.se>";
const runtimeProcessedEventIds = new Set<string>();
export const config = { api: { bodyParser: false } };

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || typeof signature !== "string") return res.status(400).json({ error: "Webhook verification is not configured." });
  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : "Invalid webhook." });
  }

  try {
    // Runtime-only retry guard. This is not durable idempotency across deployments or serverless instances.
    if (runtimeProcessedEventIds.has(event.id)) return res.status(200).json({ received: true, duplicate: true });
    rememberRuntimeEvent(event.id);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutSessionAsyncPaymentSucceeded(event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.async_payment_failed":
        handleCheckoutSessionAsyncPaymentFailed(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    // Let Stripe retry the event; the Resend idempotency key prevents a duplicate email.
    runtimeProcessedEventIds.delete(event.id);
    console.error("Stripe webhook handling failed", { eventId: event.id, type: event.type, error: error instanceof Error ? error.message : error });
    return res.status(500).json({ error: "Webhook handling failed." });
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

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const logPayload = getCheckoutSessionLogPayload(session);
  if (session.payment_status === "paid") {
    console.info("Stripe checkout completed with paid payment", logPayload);
    await sendOrderNotification(session);
    return;
  }

  console.info("Stripe checkout completed with pending payment", logPayload);
}

async function handleCheckoutSessionAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
  console.info("Stripe checkout async payment succeeded", getCheckoutSessionLogPayload(session));
  await sendOrderNotification(session);
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

async function sendOrderNotification(session: Stripe.Checkout.Session) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Order notification skipped: RESEND_API_KEY is missing.", { id: session.id });
    return;
  }

  // Line items are not included in the webhook payload, so read them from Stripe.
  const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, { limit: 100 });
  const customerName = session.customer_details?.name || "Okänt namn";
  const customerEmail = session.customer_details?.email || session.customer_email || "";
  const currency = (session.currency || "sek").toUpperCase();
  const formatAmount = (amount: number | null) => formatMoney(amount ?? 0, currency);

  const rows = lineItems.data
    .map(
      (item) => `<tr>
        <td style="padding:6px 12px 6px 0">${escapeHtml(item.description || "Produkt")}</td>
        <td style="padding:6px 12px;text-align:center">${item.quantity ?? 1}</td>
        <td style="padding:6px 0 6px 12px;text-align:right">${formatAmount(item.amount_total)}</td>
      </tr>`,
    )
    .join("");

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
    <h2 style="margin:0 0 16px">Ny beställning på kornu.se</h2>
    <p style="margin:0 0 4px"><strong>Kund:</strong> ${escapeHtml(customerName)}</p>
    <p style="margin:0 0 16px"><strong>E-post:</strong> ${escapeHtml(customerEmail || "Saknas")}</p>
    <table style="border-collapse:collapse;margin:0 0 16px">
      <thead><tr>
        <th style="padding:6px 12px 6px 0;text-align:left">Produkt</th>
        <th style="padding:6px 12px">Antal</th>
        <th style="padding:6px 0 6px 12px;text-align:right">Belopp</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin:0 0 4px"><strong>Totalt:</strong> ${formatAmount(session.amount_total)} (${escapeHtml(currency)})</p>
    <p style="margin:0 0 4px"><strong>Betalningsstatus:</strong> ${escapeHtml(session.payment_status)}</p>
    <p style="margin:16px 0 0;color:#666;font-size:13px">Stripe Checkout Session: ${escapeHtml(session.id)}</p>
  </div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // One email per Checkout Session, even if Stripe retries the event.
      "Idempotency-Key": `order-notification/${session.id}`,
    },
    body: JSON.stringify({
      from: process.env.ORDER_NOTIFICATION_FROM || defaultOrderNotificationFrom,
      to: [orderNotificationTo],
      subject: `Ny beställning: ${formatAmount(session.amount_total)} från ${customerName}`,
      html,
      ...(customerEmail ? { reply_to: customerEmail } : {}),
    }),
  });

  if (!response.ok) throw new Error(`Resend responded with ${response.status}: ${await response.text()}`);
  console.info("Order notification sent", { id: session.id });
}

function formatMoney(amountInMinorUnits: number, currency: string) {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency }).format(amountInMinorUnits / 100);
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
