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
    const api = await import("./infra/api");
    const web = await import("./infra/web");

    await import("./infra/qstash");

    return {
      api: api.url,
      web: web.url,
      router: {
        distributionID: router.distributionID,
        url: router.url,
      },
    };
  },
});
