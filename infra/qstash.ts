import { cron, isPermanentStage } from "./config";
import { domain } from "./router";

// QStash Scheduler for updater workflows
// Workflows are now served from the Next.js web app
// Authentication is handled via QStash signing keys (receiver.verify)
if (isPermanentStage) {
  new upstash.QStashScheduleV2("Scheduler", {
    destination: `https://${domain}/api/workflows/trigger`,
    cron,
  });

  // QStash Scheduler for monthly newsletter
  // Runs on days 28-31 at 9am SGT to catch end of month
  new upstash.QStashScheduleV2("NewsletterScheduler", {
    destination: `https://${domain}/api/workflows/newsletter/trigger`,
    cron: "0 9 28-31 * *",
  });
}
