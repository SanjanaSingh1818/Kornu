import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({ path: ".env.local" });
dotenv.config();

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Stripe is not configured: STRIPE_SECRET_KEY is missing.");
  return new Stripe(secretKey, { apiVersion: "2026-08-26.dahlia" });
}