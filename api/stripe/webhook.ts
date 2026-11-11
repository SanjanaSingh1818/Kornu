import Stripe from "stripe";
import { sendResendEmail } from "../resend.js";
import { getStripe } from "./server.js";

type Request = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  [Symbol.asyncIterator]?: () => AsyncIterator<Buffer | string>;
};
type Response = { status: (code: number) => Response; json: (body: unknown) => void };

const maxRuntimeProcessedEvents = 500;
const orderNotificationTo = process.env.CLIENT_EMAIL || "info@kornu.se";
const defaultOrderNotificationFrom = "Kör Nu Trafikskola <info@kornu.se>";
const runtimeProcessedEventIds = new Set<string>();
export const config = { api: { bodyParser: false } };

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  console.info("Stripe webhook request received", { hasWebhookSecret: Boolean(webhookSecret), hasSignature: typeof signature === "string" });
  if (!webhookSecret || typeof signature !== "string") return res.status(400).json({ error: "Webhook verification is not configured." });
  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.warn("Stripe webhook signature verification failed", { error: error instanceof Error ? error.message : "Invalid webhook" });
    return res.status(400).json({ error: error instanceof Error ? error.message : "Invalid webhook." });
  }

  console.info("Stripe webhook verified", { eventId: event.id, type: event.type });

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
  const stripe = getStripe();
  // Line items and the saved customer are not included in the webhook payload.
  const [lineItems, savedCustomer] = await Promise.all([
    stripe.checkout.sessions.listLineItems(session.id, { limit: 100 }),
    getSavedCustomer(stripe, session.customer),
  ]);
  const customerName = session.customer_details?.name || savedCustomer?.name || "Okänt namn";
  const customerEmail = session.customer_details?.email || session.customer_email || savedCustomer?.email || "";
  const currency = (session.currency || "sek").toUpperCase();
  const formatAmount = (amount: number | null) => formatMoney(amount ?? 0, currency);
  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id;
  const customerAddress = formatAddress(session.customer_details?.address);
  const customerPhone = session.customer_details?.phone || savedCustomer?.phone;
  const personalNumber = savedCustomer?.metadata?.personal_number;
  const orderDate = new Date(session.created * 1_000).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });

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
    ${customerPhone ? `<p style="margin:0 0 4px"><strong>Telefon:</strong> ${escapeHtml(customerPhone)}</p>` : ""}
    ${personalNumber ? `<p style="margin:0 0 4px"><strong>Personnummer:</strong> ${escapeHtml(personalNumber)}</p>` : ""}
    ${customerAddress ? `<p style="margin:0 0 16px"><strong>Faktureringsadress:</strong> ${escapeHtml(customerAddress)}</p>` : ""}
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
    ${session.total_details?.amount_tax ? `<p style="margin:0 0 4px"><strong>Moms:</strong> ${formatAmount(session.total_details.amount_tax)}</p>` : ""}
    ${session.total_details?.amount_shipping ? `<p style="margin:0 0 4px"><strong>Frakt:</strong> ${formatAmount(session.total_details.amount_shipping)}</p>` : ""}
    ${session.total_details?.amount_discount ? `<p style="margin:0 0 4px"><strong>Rabatt:</strong> −${formatAmount(session.total_details.amount_discount)}</p>` : ""}
    <p style="margin:16px 0 0;color:#666;font-size:13px">Orderdatum: ${escapeHtml(orderDate)}<br>
      Stripe Checkout Session: ${escapeHtml(session.id)}<br>
      Stripe PaymentIntent: ${escapeHtml(paymentIntentId || "Saknas")}
    </p>
  </div>`;

  const emails = [
    sendResendEmail(
      {
        from: process.env.RESEND_FROM_EMAIL || process.env.ORDER_NOTIFICATION_FROM || defaultOrderNotificationFrom,
        to: [orderNotificationTo],
        subject: `Ny beställning: ${formatAmount(session.amount_total)} (${session.id})`,
        html,
        ...(customerEmail ? { reply_to: customerEmail } : {}),
      },
      `order-notification/${session.id}`,
      { kind: "order_notification", checkoutSessionId: session.id },
    ),
  ];

  if (customerEmail) {
    const receiptHtml = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
      <h2 style="margin:0 0 16px">Tack för ditt köp!</h2>
      <p style="margin:0 0 16px">Hej ${escapeHtml(customerName)}, vi har tagit emot din betalning.</p>
      <table style="border-collapse:collapse;margin:0 0 16px">
        <thead><tr>
          <th style="padding:6px 12px 6px 0;text-align:left">Produkt</th>
          <th style="padding:6px 12px">Antal</th>
          <th style="padding:6px 0 6px 12px;text-align:right">Belopp</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:0 0 4px"><strong>Totalt betalat:</strong> ${formatAmount(session.amount_total)} (${escapeHtml(currency)})</p>
      <p style="margin:0 0 4px"><strong>Betalningsstatus:</strong> Betald</p>
      <p style="margin:0 0 4px"><strong>Datum:</strong> ${escapeHtml(orderDate)}</p>
      <p style="margin:16px 0 0;color:#666;font-size:13px">Spara detta mejl som bekräftelse på ditt köp.</p>
    </div>`;
    emails.push(sendResendEmail(
      {
        from: process.env.RESEND_FROM_EMAIL || process.env.ORDER_NOTIFICATION_FROM || defaultOrderNotificationFrom,
        to: [customerEmail],
        subject: `Kvitto för ditt köp hos Kör Nu – ${formatAmount(session.amount_total)}`,
        html: receiptHtml,
      },
      `customer-receipt/${session.id}`,
      { kind: "customer_payment_receipt", checkoutSessionId: session.id },
    ));
  } else {
    console.warn("Customer payment receipt skipped: Stripe did not provide a customer email.", { checkoutSessionId: session.id });
  }

  await Promise.all(emails);
}

async function getSavedCustomer(stripe: Stripe, customer: Stripe.Checkout.Session["customer"]): Promise<Stripe.Customer | null> {
  const customerId = typeof customer === "string" ? customer : customer?.id;
  if (!customerId) return null;
  const result = await stripe.customers.retrieve(customerId);
  return "deleted" in result && result.deleted ? null : result;
}

function formatMoney(amountInMinorUnits: number, currency: string) {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency }).format(amountInMinorUnits / 100);
}

function formatAddress(address: Stripe.Address | null | undefined) {
  if (!address) return "";
  return [
    address.line1,
    address.line2,
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.state,
    address.country,
  ].filter(Boolean).join(", ");
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
