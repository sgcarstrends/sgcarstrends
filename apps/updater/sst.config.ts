/// <reference path="./.sst/platform/config.d.ts" />

const DOMAIN_NAME = "sgcarstrends.com";
const DOMAINS = {
  dev: `dev.updater.${DOMAIN_NAME}`,
  staging: `staging.updater.${DOMAIN_NAME}`,
  prod: `updater.${DOMAIN_NAME}`,
};

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
  },
});
