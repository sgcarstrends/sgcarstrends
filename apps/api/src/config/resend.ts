import { Resend } from "resend";

/**
 * Shared Resend client used across features.
 * The SDK tolerates an undefined API key, but downstream calls
 * will fail clearly if the environment is not configured.
 */
export const resendClient = new Resend(process.env.RESEND_API_KEY);

/**
 * Returns the Resend audience identifier used for newsletter subscriptions.
 */
export const getResendAudienceId = () => process.env.RESEND_AUDIENCE_ID ?? null;

/**
 * Newsletter sender address. Centralised so the value stays consistent
 * across workflows, manual triggers, and future email features.
 */
export const NEWSLETTER_FROM_EMAIL =
  "Newsletter <newsletter@updates.sgcarstrends.com>";
