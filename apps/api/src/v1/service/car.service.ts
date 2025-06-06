import { HYBRID_REGEX, MPV_REGEX } from "@api/config";
import db from "@api/config/db";
import { getLatestMonth } from "@api/lib/getLatestMonth";
import { getCarMetricsData } from "@api/queries";
import { cars } from "@sgcarstrends/schema";
import { getTrailingSixMonths } from "@sgcarstrends/utils";
import { type SQL, and, between, desc, eq, ilike, sql } from "drizzle-orm";

namespace Metric {
  export interface CategoryCount {
    label: string;
    count: number;
  }

  export interface PeriodData {
    total: number;
    fuelType: CategoryCount[];
    vehicleType: CategoryCount[];
  }

  export interface PeriodInfo {
    period: string;
    total: number;
    fuelType: CategoryCount[];
    vehicleType: CategoryCount[];
  }

  export interface Response {
    data: {
      currentMonth: PeriodInfo;
      previousMonth: PeriodInfo;
      previousYear: PeriodInfo;
    };
  }
}

export const buildFilters = async (query: Record<string, string>) => {
  const { month, ...queries } = query;
  const latestMonth = !month && (await getLatestMonth(cars));

  const filters = [
    month
      ? eq(cars.month, month)
      : between(cars.month, getTrailingSixMonths(latestMonth), latestMonth),
  ];

  for (const [key, value] of Object.entries(queries)) {
    if (key === "fuel_type" && value.toLowerCase() === "hybrid") {
      filters.push(sql`${cars.fuel_type}~${HYBRID_REGEX.source}::text`);
      continue;
    }

    if (
      key === "vehicle_type" &&
      value.toLowerCase() === "multi-purpose-vehicle"
    ) {
      filters.push(sql`${cars.vehicle_type}~${MPV_REGEX.source}::text`);
    }

    filters.push(ilike(cars[key], `${value.split("-").join("%")}%`));
  }

  return filters;
};

export const fetchCars = (filters: SQL<unknown>[]) =>
  db
    .select()
    .from(cars)
    .where(and(...filters))
    .orderBy(desc(cars.month));

export const getCarMetricsForPeriod = async (
  currentPeriod: string,
): Promise<Metric.Response> => {
  const [yearStr, monthStr] = currentPeriod.split("-");
  const year = Number.parseInt(yearStr, 10);
  const month = Number.parseInt(monthStr, 10);

  let prevMonthYear = year;
  let prevMonth = month - 1;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevMonthYear = year - 1;
  }
  const previousMonthPeriod = `${prevMonthYear}-${prevMonth.toString().padStart(2, "0")}`;
  const previousYearPeriod = `${year - 1}-${monthStr}`;

  const { currentData, previousMonthData, previousYearData } =
    await getCarMetricsData(
      currentPeriod,
      previousMonthPeriod,
      previousYearPeriod,
    );

  const processData = (
    data: Array<{ number: number; fuel_type: string; vehicle_type: string }>,
  ) => {
    let total = 0;
    const fuelGroups: Record<string, number> = {};
    const vehicleGroups: Record<string, number> = {};

    for (const record of data) {
      total += record.number;
      fuelGroups[record.fuel_type] =
        (fuelGroups[record.fuel_type] || 0) + record.number;
      vehicleGroups[record.vehicle_type] =
        (vehicleGroups[record.vehicle_type] || 0) + record.number;
    }

    return { total, fuelGroups, vehicleGroups };
  };

  const current = processData(currentData);
  const previousMonth = processData(previousMonthData);
  const previousYear = processData(previousYearData);

  interface ProcessedMetrics {
    total: number;
    fuelGroups: Record<string, number>;
    vehicleGroups: Record<string, number>;
  }

  const createCategoryData = (
    groups: Record<string, number>,
  ): Metric.CategoryCount[] =>
    Object.entries(groups)
      .filter(([, count]) => count > 0)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

  const createPeriodData = (metrics: ProcessedMetrics): Metric.PeriodData => ({
    total: metrics.total,
    fuelType: createCategoryData(metrics.fuelGroups),
    vehicleType: createCategoryData(metrics.vehicleGroups),
  });

  return {
    data: {
      currentMonth: {
        period: currentPeriod,
        ...createPeriodData(current),
      },
      previousMonth: {
        period: previousMonthPeriod,
        ...createPeriodData(previousMonth),
      },
      previousYear: {
        period: previousYearPeriod,
        ...createPeriodData(previousYear),
      },
    },
  };
};
