import { router } from "@api/trpc";
import { newsletterRouter } from "./newsletter/router";
import { blogRouter } from "./routers/blog";
import { healthRouter } from "./routers/health";

export const appRouter = router({
  health: healthRouter,
  newsletter: newsletterRouter,
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;
