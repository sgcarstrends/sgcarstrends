// Server-only Stripe utilities
import "server-only";

import Stripe from "stripe";
import { type PlanKey } from "./plans";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PAYMENT_LINKS: Record<PlanKey, string | undefined> = {
  starter: process.env.STRIPE_PAYMENT_LINK_STARTER,
  growth: process.env.STRIPE_PAYMENT_LINK_GROWTH,
  premium: process.env.STRIPE_PAYMENT_LINK_PREMIUM,
};

export function getPaymentUrl(plan: PlanKey, campaignId: string): string {
  const paymentLink = PAYMENT_LINKS[plan];
  if (!paymentLink) {
    throw new Error(`Payment link not configured for plan: ${plan}`);
  }
  return `${paymentLink}?client_reference_id=${campaignId}`;
}
