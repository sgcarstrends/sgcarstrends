import { router, subDomain } from "./router";
import { secrets } from "./secrets";

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
export const api = new sst.aws.Function("Api", {
  link: Object.values(secrets),
  architecture: "arm64",
  timeout: "120 seconds",
  runtime: "nodejs22.x",
  description: "API for SG Cars Trends",
  environment: {
    FEATURE_FLAG_RATE_LIMIT: process.env.FEATURE_FLAG_RATE_LIMIT ?? "",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
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

export const url = api.url;
