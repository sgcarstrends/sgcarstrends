/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sgcarstrends",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
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
    const { router } = await import("./infra/router");
    const web = await import("./infra/web");

    return {
      web: web.url,
      router: router.distributionID,
    };
  },
});
