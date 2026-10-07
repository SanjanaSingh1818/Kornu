const resendApiUrl = "https://api.resend.com/emails";

export type ResendEmail = { from: string; to: string[]; subject: string; html: string; reply_to?: string };
type SendResult = { id?: string };

/** Sends through Resend and records only safe diagnostic metadata. */
export async function sendResendEmail(email: ResendEmail, idempotencyKey: string, context: Record<string, unknown>): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Resend email skipped: RESEND_API_KEY is missing.", context);
    throw new Error("RESEND_API_KEY is missing.");
  }
  console.info("Resend send starting", { ...context, from: email.from, to: email.to });
  const response = await fetch(resendApiUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(email),
  });
  const responseText = await response.text();
  let responseBody: unknown = responseText;
  try { responseBody = responseText ? JSON.parse(responseText) : null; } catch { /* non-JSON kept as text */ }
  const safeBody = typeof responseBody === "string" ? responseBody.slice(0, 1_000) : responseBody;
  if (!response.ok) {
    console.error("Resend send failed", { ...context, status: response.status, response: safeBody });
    throw new Error(`Resend responded with ${response.status}.`);
  }
  const result = (responseBody && typeof responseBody === "object" ? responseBody : {}) as SendResult;
  console.info("Resend send accepted", { ...context, status: response.status, emailId: result.id });
  return result;
}
