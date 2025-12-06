import { router, subDomain } from "./router";

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
  architecture: "arm64",
  timeout: "120 seconds",
  runtime: "nodejs22.x",
  description: "API for SG Cars Trends",
  environment: {
    FEATURE_FLAG_RATE_LIMIT: process.env.FEATURE_FLAG_RATE_LIMIT,

    // Core API
    STAGE: $app.stage,
    WORKFLOWS_BASE_URL: process.env.WORKFLOWS_BASE_URL as string,
    SITE_URL: process.env.SITE_URL as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    SG_CARS_TRENDS_API_TOKEN: process.env.SG_CARS_TRENDS_API_TOKEN as string,
    NEXT_PUBLIC_REVALIDATE_TOKEN: process.env
      .NEXT_PUBLIC_REVALIDATE_TOKEN as string,
    UPDATER_API_TOKEN: process.env.UPDATER_API_TOKEN as string,

    // AI/LLM
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,

    // Langfuse (LLM Observability)
    LANGFUSE_PUBLIC_KEY: process.env.LANGFUSE_PUBLIC_KEY,
    LANGFUSE_SECRET_KEY: process.env.LANGFUSE_SECRET_KEY,
    LANGFUSE_HOST: process.env.LANGFUSE_HOST,

    // QStash/Upstash
    QSTASH_TOKEN: process.env.QSTASH_TOKEN as string,
    QSTASH_CURRENT_SIGNING_KEY: process.env
      .QSTASH_CURRENT_SIGNING_KEY as string,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY as string,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL as string,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN as string,

    // Vercel Blob (for logos storage)
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN as string,

    // Discord
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL as string,
    DISCORD_WORKFLOW_WEBHOOK_URL: process.env
      .DISCORD_WORKFLOW_WEBHOOK_URL as string,

    // LinkedIn
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID as string,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET as string,
    LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN as string,
    LINKEDIN_REFRESH_TOKEN: process.env.LINKEDIN_REFRESH_TOKEN as string,
    LINKEDIN_ORGANISATION_ID: process.env.LINKEDIN_ORGANISATION_ID as string,
    LINKEDIN_USER_ID: process.env.LINKEDIN_USER_ID as string,

    // Resend
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    // Telegram
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN as string,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID as string,

    // Twitter
    TWITTER_APP_KEY: process.env.TWITTER_APP_KEY as string,
    TWITTER_APP_SECRET: process.env.TWITTER_APP_SECRET as string,
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN as string,
    TWITTER_ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET as string,
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
