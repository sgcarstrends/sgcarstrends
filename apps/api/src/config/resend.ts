import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Newsletter sender address. Centralised so the value stays consistent
 * across workflows, manual triggers, and future email features.
 */
export const NEWSLETTER_FROM_EMAIL =
  "Newsletter <newsletter@updates.sgcarstrends.com>";
