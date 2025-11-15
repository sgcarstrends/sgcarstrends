import { router } from "@api/trpc";
import { newsletterRouter } from "@api/trpc/newsletter/router";
import { blogRouter } from "@api/trpc/routers/blog";
import { healthRouter } from "@api/trpc/routers/health";

export const appRouter = router({
  health: healthRouter,
  newsletter: newsletterRouter,
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;
