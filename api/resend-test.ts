import { ResendError, sanitizeResendText, sendResendEmail } from "./resend.js";

type Request = { method?: string; headers: Record<string, string | string[] | undefined> };
type Response = { status: (code: number) => Response; json: (body: unknown) => void };

/** Temporary diagnostic endpoint. Set RESEND_TEST_SECRET in Production, then POST its value in x-resend-test-secret. */
export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const expectedSecret = process.env.RESEND_TEST_SECRET;
  const suppliedSecret = req.headers["x-resend-test-secret"];
  if (!expectedSecret || typeof suppliedSecret !== "string" || suppliedSecret !== expectedSecret) return res.status(404).json({ error: "Not found." });
  try {
    const result = await sendResendEmail(
      { from: process.env.ORDER_NOTIFICATION_FROM || "Kör Nu webbshop <order@kornu.se>", to: ["delivered@resend.dev"], subject: "Kornu Resend delivery test", html: "<p>This is a server-side Resend delivery test from Kornu.</p>" },
      `resend-delivery-test/${Date.now()}`,
      { kind: "resend_delivery_test" },
    );
    return res.status(200).json({ accepted: true, emailId: result.id });
  } catch (error) {
    console.error("Resend delivery test failed", { error: error instanceof Error ? error.message : "Unknown error" });
    // Temporary: surfaces Resend's sanitized status/message so the failure can be diagnosed from curl.
    if (error instanceof ResendError) {
      return res.status(502).json({ accepted: false, error: "Resend test send failed.", resendStatus: error.resendStatus, resendMessage: error.resendMessage, resendName: error.resendName });
    }
    // Network/runtime failure before Resend answered (e.g. DNS, timeout).
    return res.status(502).json({ accepted: false, error: "Resend test send failed.", resendStatus: null, resendMessage: sanitizeResendText(error instanceof Error ? error.message : "Unknown error") });
  }
}
