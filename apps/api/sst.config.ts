/// <reference path="./.sst/platform/config.d.ts" />

import type { Stage } from "@api/types";

const DOMAIN_NAME = "sgcarstrends.com";

const CORS: Record<Stage, unknown> = {
  dev: {
    allowOrigins: ["*"],
  },
  staging: {
    allowOrigins: ["*"],
  },
  prod: {
    allowOrigins: [`https://${DOMAIN_NAME}`],
    maxAge: "1 day",
  },
};

const DOMAIN: Record<Stage, unknown> = {
  dev: { name: `api.dev.${DOMAIN_NAME}` },
  staging: { name: `api.staging.${DOMAIN_NAME}` },
  prod: { name: `api.${DOMAIN_NAME}` },
};

const SCHEDULER = "*/60 0-10 * * 1-5";

// const INVALIDATION = {
//   dev: false,
//   staging: true,
//   prod: true,
// };

export default $config({
  app(input) {
    return {
      name: "sgcarstrends-api",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "ap-southeast-1",
        },
        cloudflare: true,
        "@upstash/pulumi": {
          email: process.env.UPSTASH_EMAIL,
          apiKey: process.env.UPSTASH_API_KEY,
        },
      },
    };
  },
  async run() {
    const { SECRET_KEYS } = await import("./env");

    // Create all secrets from env.ts
    const secrets = Object.fromEntries(
      SECRET_KEYS.map((key) => [key, new sst.Secret(key, process.env[key])]),
    );

    const { url } = new sst.aws.Function("Hono", {
      link: Object.values(secrets),
      architecture: "arm64",
      description: "API for SG Cars Trends with integrated data updater",
      environment: {
        FEATURE_FLAG_RATE_LIMIT: process.env.FEATURE_FLAG_RATE_LIMIT ?? "",
        QSTASH_TOKEN: process.env.QSTASH_TOKEN as string,
      },
      handler: "src/index.handler",
      url: {
        cors: CORS[$app.stage],
      },
    });

    new sst.aws.Router("SGCarsTrends", {
      domain: {
        ...DOMAIN[$app.stage],
        dns: sst.cloudflare.dns(),
      },
      // TODO: Will enable later
      // invalidation: INVALIDATION[$app.stage],
      routes: {
        "/*": url,
      },
    });

    // // QStash Scheduler for updater workflows
    // new upstash.QStashScheduleV2("Scheduler", {
    //   destination: `https://${DOMAIN[$app.stage].name}/workflows/trigger`,
    //   forwardHeaders: {
    //     Authorization: `Bearer ${process.env.SG_CARS_TRENDS_API_TOKEN}`,
    //   },
    //   cron: SCHEDULER,
    // });
  },
});
