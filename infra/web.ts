import { api } from "./api";
import { router } from "./router";
import { secrets } from "./secrets";

export const web = new sst.aws.Nextjs("Web", {
  path: "apps/web",
  link: [
    secrets.SG_CARS_TRENDS_API_TOKEN,
    secrets.DATABASE_URL,
    secrets.UPSTASH_REDIS_REST_URL,
    secrets.UPSTASH_REDIS_REST_TOKEN,
    secrets.NEXT_PUBLIC_REVALIDATE_TOKEN,
  ],
  router: {
    instance: router,
  },
  environment: {
    TZ: "Asia/Singapore",
    NEXT_PUBLIC_API_URL: api.url,
  },
  server: {
    architecture: "arm64",
    runtime: "nodejs22.x",
  },
  warm: 1,
});

export const url = web.url;
