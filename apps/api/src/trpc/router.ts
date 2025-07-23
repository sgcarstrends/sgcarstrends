import { performHealthCheck } from "@api/utils/health";
import { carsRouter } from "./cars";
import { coeRouter } from "./coe";
import { publicProcedure, router } from "./index";
import { monthsRouter } from "./months";

export const appRouter = router({
  health: publicProcedure.query(async () => performHealthCheck()),
  cars: carsRouter,
  coe: coeRouter,
  months: monthsRouter,
});

export type AppRouter = typeof appRouter;
