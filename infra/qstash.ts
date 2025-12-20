import { cron, isPermanentStage } from "./config";
import { subDomain } from "./router";

// QStash Scheduler for updater workflows
// Authentication is handled via QStash signing keys (receiver.verify)
if (isPermanentStage) {
  new upstash.QStashScheduleV2("Scheduler", {
    destination: `https://${subDomain("api")}/workflows/trigger`,
    cron,
  });

  // QStash Scheduler for monthly newsletter
  // Runs on days 28-31 at 9am SGT to catch end of month
  new upstash.QStashScheduleV2("NewsletterScheduler", {
    destination: `https://${subDomain("api")}/workflows/newsletter/trigger`,
    cron: "0 9 28-31 * *",
  });
}
