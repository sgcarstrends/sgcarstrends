import { domain, router, subDomain } from "./router";
import { secrets } from "./secrets";

const SCHEDULER = "*/60 0-10 * * 1-5";

// CORS configuration based on stage
const getCorsConfig = () => {
  const corsConfig = {
    dev: {
      allowOrigins: ["*"],
    },
    staging: {
      allowOrigins: ["*"],
    },
    prod: {
      allowOrigins: ["https://sgcarstrends.com"],
      maxAge: "1 day",
    },
  };

  return corsConfig[$app.stage as keyof typeof corsConfig] || corsConfig.dev;
};

// Create the Hono API function
export const api = new sst.aws.Function("Hono", {
  link: Object.values(secrets),
  architecture: "arm64",
  runtime: "nodejs22.x",
  description: "API for SG Cars Trends with integrated data updater",
  environment: {
    FEATURE_FLAG_RATE_LIMIT: process.env.FEATURE_FLAG_RATE_LIMIT ?? "",
    QSTASH_TOKEN: process.env.QSTASH_TOKEN as string,
  },
  handler: "apps/api/src/index.handler",
  url: {
    cors: getCorsConfig(),
    router: {
      instance: router,
      domain: subDomain("api"),
    },
  },
});

// QStash Scheduler for updater workflows
// new upstash.QStashScheduleV2("Scheduler", {
//   destination: `https://${subDomain("api")}.${domain}/workflows/trigger`,
//   forwardHeaders: {
//     Authorization: `Bearer ${process.env.SG_CARS_TRENDS_API_TOKEN}`,
//   },
//   cron: SCHEDULER,
// });

export const url = api.url;
