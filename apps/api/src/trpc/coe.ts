import db from "@api/config/db";
import { COELatestResponseSchema, COEQuerySchema } from "@api/schemas";
import { coe, coePQP } from "@sgcarstrends/database";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, gte, inArray, lte, max } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "./index";

export const coeRouter = router({
  getAll: publicProcedure
    .input(COEQuerySchema)
    .output(COELatestResponseSchema)
    .query(async ({ input }) => {
      try {
        const { month, start, end } = input;

        const filters = [
          month && eq(coe.month, month),
          start && gte(coe.month, start),
          end && lte(coe.month, end),
        ];

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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get COE data",
          cause: error,
        });
      }
    }),

  getLatest: publicProcedure
    .input(z.object({}))
    .output(COELatestResponseSchema)
    .query(async () => {
      try {
        const [{ latestMonth }] = await db
          .select({ latestMonth: max(coe.month) })
          .from(coe);

        const results = await db
          .select()
          .from(coe)
          .where(
            and(
              eq(coe.month, latestMonth),
              inArray(
                coe.bidding_no,
                db
                  .select({ bidding_no: max(coe.bidding_no) })
                  .from(coe)
                  .where(eq(coe.month, latestMonth)),
              ),
            ),
          )
          .orderBy(desc(coe.bidding_no), asc(coe.vehicle_class));

        return results;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get latest COE data",
          cause: error,
        });
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get COE PQP data",
          cause: error,
        });
      }
    }),
});
