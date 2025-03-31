import { HYBRID_REGEX, MPV_REGEX } from "@api/config";
import db from "@api/config/db";
import { getLatestMonth } from "@api/lib/getLatestMonth";
import type { Car } from "@api/schemas";
import { cars } from "@sgcarstrends/schema";
import { getTrailingSixMonths } from "@sgcarstrends/utils";
import { type SQL, and, between, desc, eq, ilike, sql } from "drizzle-orm";

namespace Metric {
  export interface Breakdown {
    period: string;
    value: number;
    abs_change: number;
    pct_change: number;
  }

  export interface Group {
    label: string;
    current: number;
    monthly: Breakdown;
    yearly: Breakdown;
  }

  export interface Response {
    period: string;
    metrics: {
      total_registrations: {
        label: string;
        current: number;
        monthly: Breakdown;
        yearly: Breakdown;
      };
      fuel_types: Group[];
      vehicle_types: Group[];
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

  const currentDataQ = db
    .select()
    .from(cars)
    .where(eq(cars.month, currentPeriod));
  const previousMonthDataQ = db
    .select()
    .from(cars)
    .where(eq(cars.month, previousMonthPeriod));
  const previousYearDataQ = db
    .select()
    .from(cars)
    .where(eq(cars.month, previousYearPeriod));

  const [currentData, previousMonthData, previousYearData] = await Promise.all([
    currentDataQ,
    previousMonthDataQ,
    previousYearDataQ,
  ]);

  const sumNumbers = (data: Car[]) =>
    data.reduce((sum, { number }) => sum + number, 0);

  const totalRegistrations = {
    current: sumNumbers(currentData),
    previousMonth: sumNumbers(previousMonthData),
    previousYear: sumNumbers(previousYearData),
  };

  const calculatePctChange = (current: number, previous: number) => {
    if (previous === 0) {
      return 0;
    }
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const groupByProperty = (data: Car[], prop: keyof Car) =>
    data.reduce(
      (acc, record) => {
        const key = record[prop];
        acc[key] = (acc[key] || 0) + record.number;
        return acc;
      },
      {} as Record<string, number>,
    );

  const currentFuelData = groupByProperty(currentData, "fuel_type");
  const previousMonthFuelData = groupByProperty(previousMonthData, "fuel_type");
  const previousYearFuelData = groupByProperty(previousYearData, "fuel_type");

  const currentVehicleData = groupByProperty(currentData, "vehicle_type");
  const previousMonthVehicleData = groupByProperty(
    previousMonthData,
    "vehicle_type",
  );
  const previousYearVehicleData = groupByProperty(
    previousYearData,
    "vehicle_type",
  );

  const fuelTypes = Array.from(
    new Set([
      ...Object.keys(currentFuelData),
      ...Object.keys(previousMonthFuelData),
      ...Object.keys(previousYearFuelData),
    ]),
  );

  const fuelTypesData: Metric.Group[] = fuelTypes.map((fuel) => {
    const currentCount = currentFuelData[fuel] || 0;
    const prevMonthCount = previousMonthFuelData[fuel] || 0;
    const prevYearCount = previousYearFuelData[fuel] || 0;
    return {
      label: fuel,
      current: currentCount,
      monthly: {
        period: previousMonthPeriod,
        value: prevMonthCount,
        abs_change: currentCount - prevMonthCount,
        pct_change: calculatePctChange(currentCount, prevMonthCount),
      },
      yearly: {
        period: previousYearPeriod,
        value: prevYearCount,
        abs_change: currentCount - prevYearCount,
        pct_change: calculatePctChange(currentCount, prevYearCount),
      },
    };
  });

  const vehicleTypes = Array.from(
    new Set([
      ...Object.keys(currentVehicleData),
      ...Object.keys(previousMonthVehicleData),
      ...Object.keys(previousYearVehicleData),
    ]),
  );
  const vehicleTypesData: Metric.Group[] = vehicleTypes.map((type) => {
    const currentCount = currentVehicleData[type] || 0;
    const prevMonthCount = previousMonthVehicleData[type] || 0;
    const prevYearCount = previousYearVehicleData[type] || 0;
    return {
      label: type,
      current: currentCount,
      monthly: {
        period: previousMonthPeriod,
        value: prevMonthCount,
        abs_change: currentCount - prevMonthCount,
        pct_change: calculatePctChange(currentCount, prevMonthCount),
      },
      yearly: {
        period: previousYearPeriod,
        value: prevYearCount,
        abs_change: currentCount - prevYearCount,
        pct_change: calculatePctChange(currentCount, prevYearCount),
      },
    };
  });

  return {
    period: currentPeriod,
    metrics: {
      total_registrations: {
        label: "Total Registrations",
        current: totalRegistrations.current,
        monthly: {
          period: previousMonthPeriod,
          value: totalRegistrations.previousMonth,
          abs_change:
            totalRegistrations.current - totalRegistrations.previousMonth,
          pct_change: calculatePctChange(
            totalRegistrations.current,
            totalRegistrations.previousMonth,
          ),
        },
        yearly: {
          period: previousYearPeriod,
          value: totalRegistrations.previousYear,
          abs_change:
            totalRegistrations.current - totalRegistrations.previousYear,
          pct_change: calculatePctChange(
            totalRegistrations.current,
            totalRegistrations.previousYear,
          ),
        },
      },
      fuel_types: fuelTypesData,
      vehicle_types: vehicleTypesData,
    },
  };
};
