/// <reference path="./.sst/platform/config.d.ts" />

const DOMAIN_NAME = "sgcarstrends.com";
const DOMAINS = {
  dev: `dev.updater.${DOMAIN_NAME}`,
  staging: `staging.updater.${DOMAIN_NAME}`,
  prod: `updater.${DOMAIN_NAME}`,
};

const UPDATER_CRON = "*/60 0-10 * * 1-5";

export default $config({
  app(input) {
    return {
      name: "sgcarstrends-updater",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "ap-southeast-1",
          version: "6.66.2",
        },
        cloudflare: { version: "5.37.1" },
        "@upstash/pulumi": {
          email: process.env.UPSTASH_EMAIL,
          apiKey: process.env.UPSTASH_API_KEY,
          version: "0.3.14",
        },
      },
    };
  },
  async run() {
    const SECRET_KEYS = [
      "UPDATER_API_TOKEN",
      "DATABASE_URL",
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "QSTASH_CURRENT_SIGNING_KEY",
      "QSTASH_NEXT_SIGNING_KEY",
      // Add social media API tokens/secrets
      "TWITTER_API_KEY",
      "TWITTER_API_SECRET",
      "TWITTER_ACCESS_TOKEN",
      "TWITTER_ACCESS_SECRET",
      "LINKEDIN_CLIENT_ID",
      "LINKEDIN_CLIENT_SECRET",
      "LINKEDIN_ACCESS_TOKEN",
      "LINKEDIN_ORGANISATION_ID",
      "LINKEDIN_USER_ID",
      // "FACEBOOK_ACCESS_TOKEN",
    ] as const;
    const secrets = Object.fromEntries(
      SECRET_KEYS.map((key) => [key, new sst.Secret(key, process.env[key])]),
    );
    const allSecrets = Object.values(secrets);

    const { url } = new sst.aws.Function("Updater", {
      link: [...allSecrets],
      handler: "src/index.handler",
      environment: {
        QSTASH_TOKEN: process.env.QSTASH_TOKEN as string,
      },
      url: true,
    });

    new sst.aws.Router("SGCarsTrendsUpdater", {
      domain: {
        name: DOMAINS[$app.stage],
        dns: sst.cloudflare.dns(),
      },
      routes: {
        "/*": url,
      },
    });

    new upstash.QStashScheduleV2("Updater", {
      destination: `https://${DOMAINS[$app.stage]}/qstash`,
      cron: UPDATER_CRON,
    });
  },
});
