import { router } from "@api/trpc";
import { healthRouter } from "./routers/health";
import { newsletterRouter } from "./routers/newsletter";

export const appRouter = router({
  health: healthRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
