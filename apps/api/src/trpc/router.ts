import { performHealthCheck } from "@api/utils/health";
import { publicProcedure, router } from "./index";

export const appRouter = router({
  health: publicProcedure.query(async () => performHealthCheck()),
});

export type AppRouter = typeof appRouter;
