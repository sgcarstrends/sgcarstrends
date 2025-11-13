import { coe, db, pqp } from "@sgcarstrends/database";
import type { Pqp } from "@web/types/coe";
import { and, desc, eq, inArray, isNotNull } from "drizzle-orm";

const PQP_CATEGORIES = [
  "Category A",
  "Category B",
  "Category C",
  "Category D",
] as const;

type PQPCategory = (typeof PQP_CATEGORIES)[number];

const createEmptyRates = (): Pqp.Rates => ({
  "Category A": 0,
  "Category B": 0,
  "Category C": 0,
  "Category D": 0,
});

const toNumber = (value: number | string | null | undefined): number => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * Server action to fetch aggregated PQP insights for the last 12 months
 */
export const getPQPOverview = async (): Promise<Pqp.Overview> => {
  const recentMonthsRows = await db
    .selectDistinct({ month: pqp.month })
    .from(pqp)
    .where(isNotNull(pqp.month))
    .orderBy(desc(pqp.month))
    .limit(12);

  const recentMonths = recentMonthsRows
    .map((row) => row.month)
    .filter((month): month is string => Boolean(month));

  const monthRateMap = new Map<string, Pqp.Rates>(
    recentMonths.map((month) => [month, createEmptyRates()]),
  );

  if (recentMonths.length > 0) {
    const pqpRates = await db
      .select({
        month: pqp.month,
        vehicleClass: pqp.vehicle_class,
        pqp: pqp.pqp,
      })
      .from(pqp)
      .where(
        and(
          inArray(pqp.month, recentMonths),
          inArray(pqp.vehicle_class, PQP_CATEGORIES),
        ),
      );

    for (const rate of pqpRates) {
      if (!rate.month || !rate.vehicleClass) {
        continue;
      }

      const monthRates = monthRateMap.get(rate.month) ?? createEmptyRates();
      monthRates[rate.vehicleClass as keyof Pqp.Rates] = toNumber(rate.pqp);
      monthRateMap.set(rate.month, monthRates);
    }
  }

  const tableRows: Pqp.TableRow[] = recentMonths.map((month) => {
    const rates = monthRateMap.get(month) ?? createEmptyRates();

    return {
      key: month,
      month,
      "Category A": rates["Category A"],
      "Category B": rates["Category B"],
      "Category C": rates["Category C"],
      "Category D": rates["Category D"],
    };
  });

  const trendData: Pqp.TrendPoint[] = [...tableRows]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(
      ({
        month,
        "Category A": categoryA,
        "Category B": categoryB,
        "Category C": categoryC,
        "Category D": categoryD,
      }) => ({
        month,
        "Category A": categoryA,
        "Category B": categoryB,
        "Category C": categoryC,
        "Category D": categoryD,
      }),
    );

  const latestCoeMonthRow = await db
    .select({ month: coe.month })
    .from(coe)
    .where(isNotNull(coe.month))
    .orderBy(desc(coe.month))
    .limit(1);

  const latestCoeMonth = latestCoeMonthRow[0]?.month ?? null;
  const coePremiumMap = new Map<PQPCategory, number>();

  if (latestCoeMonth) {
    const latestCoeBiddingRow = await db
      .select({ biddingNo: coe.bidding_no })
      .from(coe)
      .where(eq(coe.month, latestCoeMonth))
      .orderBy(desc(coe.bidding_no))
      .limit(1);

    const latestCoeBiddingNo = latestCoeBiddingRow[0]?.biddingNo ?? null;

    if (latestCoeBiddingNo !== null) {
      const latestCoeResults = await db
        .select({
          vehicleClass: coe.vehicle_class,
          premium: coe.premium,
        })
        .from(coe)
        .where(
          and(
            eq(coe.month, latestCoeMonth),
            eq(coe.bidding_no, latestCoeBiddingNo),
            inArray(coe.vehicle_class, PQP_CATEGORIES),
          ),
        );

      for (const result of latestCoeResults) {
        if (!result.vehicleClass) {
          continue;
        }

        coePremiumMap.set(
          result.vehicleClass as PQPCategory,
          toNumber(result.premium),
        );
      }
    }
  }

  const latestPqpMonthRow = await db
    .select({ month: pqp.month })
    .from(pqp)
    .where(isNotNull(pqp.month))
    .orderBy(desc(pqp.month))
    .limit(1);

  const latestPqpMonth = latestPqpMonthRow[0]?.month ?? null;
  const pqpRateMap = new Map<PQPCategory, number>();

  if (latestPqpMonth) {
    const latestPqpRates = await db
      .select({
        vehicleClass: pqp.vehicle_class,
        pqp: pqp.pqp,
      })
      .from(pqp)
      .where(
        and(
          eq(pqp.month, latestPqpMonth),
          inArray(pqp.vehicle_class, PQP_CATEGORIES),
        ),
      );

    for (const rate of latestPqpRates) {
      if (!rate.vehicleClass) {
        continue;
      }

      pqpRateMap.set(rate.vehicleClass as PQPCategory, toNumber(rate.pqp));
    }
  }

  const categorySummaries: Pqp.CategorySummary[] = PQP_CATEGORIES.map(
    (category) => {
      const coePremium = coePremiumMap.get(category) ?? 0;
      const pqpRate = pqpRateMap.get(category) ?? 0;
      const difference = coePremium - pqpRate;
      const differencePercent = pqpRate > 0 ? (difference * 100) / pqpRate : 0;
      const pqpCost5Year = pqpRate * 0.5;
      const pqpCost10Year = pqpRate;
      const savings5Year = coePremium * 0.5 - pqpCost5Year;
      const savings10Year = difference;

      return {
        category,
        coePremium,
        pqpRate,
        difference,
        differencePercent,
        pqpCost5Year,
        pqpCost10Year,
        savings5Year,
        savings10Year,
      };
    },
  );

  const comparison: Pqp.Comparison[] = categorySummaries
    .filter(
      (row) => row.category === "Category A" || row.category === "Category B",
    )
    .map((row) => ({
      category: row.category,
      latestPremium: row.coePremium,
      pqpRate: row.pqpRate,
      difference: row.difference,
      differencePercent: row.differencePercent,
    }));

  const latestMonth = tableRows[0]?.month ?? null;

  return {
    latestMonth,
    tableRows,
    trendData,
    comparison,
    categorySummaries,
  };
};
