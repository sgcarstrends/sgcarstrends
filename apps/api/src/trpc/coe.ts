import db from "@api/config/db";
import { getLatestCOEData } from "@api/lib/getLatestCOEData";
import { COELatestResponseSchema, COEQuerySchema } from "@api/schemas";
import { coe, coePQP } from "@sgcarstrends/database";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, gte, lte, type SQL } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "./index";

const handleTRPCError = (error: unknown, message: string) => {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message,
    cause: error,
  });
};

const buildDateFilters = (
  month?: string,
  start?: string,
  end?: string,
): (SQL | undefined)[] => {
  return [
    month && eq(coe.month, month),
    start && gte(coe.month, start),
    end && lte(coe.month, end),
  ];
};

export const coeRouter = router({
  getAll: publicProcedure
    .input(COEQuerySchema)
    .output(COELatestResponseSchema)
    .query(async ({ input }) => {
      try {
        const { month, start, end } = input;
        const filters = buildDateFilters(month, start, end);

        const results = await db
          .select()
          .from(coe)
          .where(and(...filters))
          .orderBy(
            desc(coe.month),
            asc(coe.bidding_no),
            asc(coe.vehicle_class),
          );

        return results;
      } catch (error) {
        handleTRPCError(error, "Failed to get COE data");
      }
    }),

  getLatest: publicProcedure
    .input(z.object({}))
    .output(COELatestResponseSchema)
    .query(async () => {
      try {
        return getLatestCOEData();
      } catch (error) {
        handleTRPCError(error, "Failed to get latest COE data");
      }
    }),

  getPQP: publicProcedure
    .input(z.object({}))
    .output(
      z.object({
        data: z.record(z.string(), z.record(z.string(), z.number())),
      }),
    )
    .query(async () => {
      try {
        const results = await db
          .select()
          .from(coePQP)
          .orderBy(desc(coePQP.month), asc(coePQP.vehicle_class));

        const pqpRates = results.reduce(
          (grouped, { month, vehicle_class, pqp }) => {
            if (!grouped[month]) {
              grouped[month] = {};
            }
            grouped[month][vehicle_class] = pqp;
            return grouped;
          },
          {} as Record<string, Record<string, number>>,
        );

        return { data: pqpRates };
      } catch (error) {
        handleTRPCError(error, "Failed to get COE PQP data");
      }
    }),
});
