import { domain, subDomain } from "./router";

const SCHEDULER = "*/60 0-10 * * 1-5";

// QStash Scheduler for updater workflows
new upstash.QStashScheduleV2("Scheduler", {
  destination: `https://${subDomain("api")}.${domain}/workflows/trigger`,
  forwardHeaders: {
    Authorization: `Bearer ${process.env.SG_CARS_TRENDS_API_TOKEN}`,
  },
  cron: SCHEDULER,
});
