import { cron, isPermanentStage } from "./config";
import { domain } from "./router";

// Schedule IDs from QStash Console - used to import existing schedules
// This prevents SST from creating duplicates by tracking existing resources
const scheduleIds: Record<string, string> = {
  prod: "", // TODO: Add schedule ID from QStash Console
  staging: "scd_6qYqsc4skiDzQwb4T5VkBh1o6Nue",
};

const stageScheduleId = scheduleIds[$app.stage as keyof typeof scheduleIds];

// Vercel deployment protection bypass header for staging
const forwardHeaders =
  $app.stage === "staging" && process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? {
        "X-Vercel-Protection-Bypass":
          process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
      }
    : undefined;

// QStash Scheduler for updater workflows
// Workflows are now served from the Next.js web app
// Authentication is handled via QStash signing keys (receiver.verify)
if (isPermanentStage) {
  new upstash.QStashScheduleV2(
    "Scheduler",
    {
      destination: `https://${domain}/api/workflows/trigger`,
      cron,
      forwardHeaders,
    },
    stageScheduleId ? { import: stageScheduleId } : {},
  );
}
