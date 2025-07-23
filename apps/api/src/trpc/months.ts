import { getLatestMonth } from "@api/lib/getLatestMonth";
import { getUniqueMonths } from "@api/lib/getUniqueMonths";
import { groupMonthsByYear } from "@api/lib/groupMonthsByYear";
import {
  LatestMonthQuerySchema,
  LatestMonthResponseSchema,
  MonthsResponseSchema,
} from "@api/schemas";
import { cars, coe } from "@sgcarstrends/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "./index";

const TABLES_MAP = {
  cars,
  coe,
} as const;

const TABLES = Object.keys(TABLES_MAP);

export const monthsRouter = router({
  getLatest: publicProcedure
    .input(LatestMonthQuerySchema)
    .output(LatestMonthResponseSchema)
    .query(async ({ input }) => {
      try {
        const { type } = input;
        const tablesToCheck = type && TABLES.includes(type) ? [type] : TABLES;

        const latestMonthObj = await Promise.all(
          tablesToCheck.map(async (tableType) => ({
            [tableType]: await getLatestMonth(
              TABLES_MAP[tableType as keyof typeof TABLES_MAP],
            ),
          })),
        ).then((results) => Object.assign({}, ...results));

        return latestMonthObj;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get latest months",
          cause: error,
        });
      }
    }),

  getAll: publicProcedure
    .input(
      z.object({
        type: z.enum(["cars", "coe"]),
        grouped: z.string().optional(),
      }),
    )
    .output(MonthsResponseSchema)
    .query(async ({ input }) => {
      try {
        const { type, grouped } = input;
        const table = TABLES_MAP[type];
        const months = await getUniqueMonths(table);

        if (grouped) {
          return groupMonthsByYear(months);
        }

        return months;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get months",
          cause: error,
        });
      }
    }),
});
