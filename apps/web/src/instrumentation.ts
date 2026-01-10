import { Client } from "@upstash/qstash";

export async function register() {
  // Only setup for permanent Vercel environments
  if (!["production", "preview"].includes(process.env.VERCEL_ENV ?? "")) return;

  const scheduleId = `${process.env.VERCEL_ENV}-trigger`;

  // Use Vercel system env for destination URL
  const DOMAIN =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  const destination = `https://${DOMAIN}/api/workflows/trigger`;

  // Build headers (Vercel protection bypass for staging)
  const headers: Record<string, string> = {};
  if (
    process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ) {
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
