const resendApiUrl = "https://api.resend.com/emails";

export type ResendEmail = { from: string; to: string[]; subject: string; html: string; reply_to?: string };
type SendResult = { id?: string };

/** Carries Resend's HTTP status and its own error message/name (already sanitized) for diagnostics. */
export class ResendError extends Error {
  resendStatus: number | null;
  resendMessage: string;
  resendName: string | null;

  constructor(message: string, resendStatus: number | null, resendMessage: string, resendName: string | null) {
    super(message);
    this.resendStatus = resendStatus;
    this.resendMessage = resendMessage;
    this.resendName = resendName;
  }
}

// Strips anything secret-looking before an error leaves the server: Resend keys, the configured secrets, control characters.
export function sanitizeResendText(value: unknown) {
  let text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  for (const secret of [process.env.RESEND_API_KEY, process.env.RESEND_TEST_SECRET]) {
    if (secret) text = text.split(secret).join("[redacted]");
  }
  return text.replace(/re_[A-Za-z0-9_-]{8,}/g, "[redacted]").replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, 500);
}

/** Sends through Resend and records only safe diagnostic metadata. */
export async function sendResendEmail(email: ResendEmail, idempotencyKey: string, context: Record<string, unknown>): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Resend email skipped: RESEND_API_KEY is missing.", context);
    throw new ResendError("RESEND_API_KEY is missing.", null, "RESEND_API_KEY is missing in this deployment's environment.", null);
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
    // Resend errors look like {"statusCode":403,"name":"validation_error","message":"..."}.
    const body = responseBody && typeof responseBody === "object" ? (responseBody as { message?: unknown; name?: unknown }) : {};
    const resendMessage = sanitizeResendText(body.message ?? responseText) || `HTTP ${response.status}`;
    const resendName = typeof body.name === "string" ? sanitizeResendText(body.name) : null;
    throw new ResendError(`Resend responded with ${response.status}.`, response.status, resendMessage, resendName);
  }
  const result = (responseBody && typeof responseBody === "object" ? responseBody : {}) as SendResult;
  console.info("Resend send accepted", { ...context, status: response.status, emailId: result.id });
  return result;
}
