import { router } from "@api/trpc";
import { newsletterRouter } from "./newsletter/router";
import { healthRouter } from "./routers/health";

export const appRouter = router({
  health: healthRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
