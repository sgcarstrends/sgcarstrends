/// <reference path="./.sst/platform/config.d.ts" />

const DOMAIN_NAME = "sgcarstrends.com";

const DOMAIN: Record<string, any> = {
  dev: { name: `dev.${DOMAIN_NAME}` },
  staging: { name: `staging.${DOMAIN_NAME}` },
  prod: { name: DOMAIN_NAME, redirects: [`www.${DOMAIN_NAME}`] },
};

export default $config({
  async app(input) {
    const { AppEnv } = await import("@web/types");

    return {
      name: "sgcarstrends",
      removal: input?.stage === AppEnv.PROD ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: "ap-southeast-1" },
        cloudflare: true,
      },
    };
  },
  async run() {
    new sst.aws.Nextjs("Site", {
      domain: {
        ...DOMAIN[$app.stage],
        dns: sst.cloudflare.dns(),
      },
      environment: {
        TZ: "Asia/Singapore",
        SG_CARS_TRENDS_API_TOKEN: process.env.SG_CARS_TRENDS_API_TOKEN!,
        DATABASE_URL: process.env.DATABASE_URL!,
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL!,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN!,
        APP_ENV: $app.stage,
      },
      server: {
        architecture: "arm64",
        runtime: "nodejs22.x",
      },
      warm: 1,
    });
  },
});
