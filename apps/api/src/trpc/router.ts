import { router } from "@api/trpc";
import { healthRouter } from "./routers/health";

export const appRouter = router({
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
