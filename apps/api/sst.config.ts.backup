/// <reference path="./.sst/platform/config.d.ts" />

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
    const { API_DOMAINS, DOMAIN_NAME } = await import("@api/config/domains");
    const { SECRET_KEYS } = await import("./env");

    const CORS = {
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

    // Create all secrets from env.ts
    const secrets = Object.fromEntries(
      SECRET_KEYS.map((key) => [key, new sst.Secret(key, process.env[key])]),
    );

    const { url } = new sst.aws.Function("Hono", {
      link: Object.values(secrets),
      architecture: "arm64",
      runtime: "nodejs22.x",
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
        name: API_DOMAINS[$app.stage],
        dns: sst.cloudflare.dns(),
      },
      // TODO: Will enable later
      // invalidation: INVALIDATION[$app.stage],
      routes: {
        "/*": url,
      },
    });

    // QStash Scheduler for updater workflows
    new upstash.QStashScheduleV2("Scheduler", {
      destination: `https://${API_DOMAINS[$app.stage]}/workflows/trigger`,
      forwardHeaders: {
        Authorization: `Bearer ${process.env.SG_CARS_TRENDS_API_TOKEN}`,
      },
      cron: SCHEDULER,
    });
  },
});
