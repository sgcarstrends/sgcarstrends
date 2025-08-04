import { performHealthCheck } from "@api/lib/health-check";
import { publicProcedure, router } from "@api/trpc";
import { TRPCError } from "@trpc/server";

export const healthRouter = router({
  check: publicProcedure.query(async () => {
    const { healthResponse, isHealthy } = await performHealthCheck();

    // If unhealthy, throw a tRPC error
    if (!isHealthy) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Service is unhealthy",
        cause: healthResponse,
      });
    }

    return healthResponse;
  }),
});
