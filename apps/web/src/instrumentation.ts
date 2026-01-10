import { Client } from "@upstash/qstash";

export async function register() {
  const isProduction = process.env.VERCEL_ENV === "production";
  const isStaging =
    process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF === "staging";

  // Only setup for production and staging branch (skip PR previews)
  if (!isProduction && !isStaging) return;

  const scheduleId = isProduction ? "production-trigger" : "staging-trigger";
  const DOMAIN = isProduction ? "sgcarstrends.com" : "staging.sgcarstrends.com";
  const destination = `https://${DOMAIN}/api/workflows/trigger`;

  // Build headers (Vercel protection bypass for staging)
  const headers: Record<string, string> = {};
  if (isStaging && process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers["x-vercel-protection-bypass"] =
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  }

  try {
    const client = new Client({ token: process.env.QSTASH_TOKEN as string });

    await client.schedules.create({
      scheduleId,
      destination,
      cron: "*/60 0-10 * * 1-5", // Hourly during business hours, weekdays
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    console.log(`[instrumentation] QStash schedule "${scheduleId}" configured`);
  } catch (error) {
    console.error("[instrumentation] Failed to setup QStash schedule:", error);
  }
}
