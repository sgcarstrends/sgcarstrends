import { cron, isPermanentStage } from "./config";
import { subDomain } from "./router";

// QStash Scheduler for updater workflows
if (isPermanentStage) {
  new upstash.QStashScheduleV2("Scheduler", {
    destination: `https://${subDomain("api")}/workflows/trigger`,
    forwardHeaders: {
      Authorization: `Bearer ${process.env.SG_CARS_TRENDS_API_TOKEN}`,
    },
    cron,
  });
}
