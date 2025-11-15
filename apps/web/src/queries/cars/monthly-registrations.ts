import { cars, db } from "@sgcarstrends/database";
import { CACHE_LIFE, CACHE_TAG } from "@web/lib/cache";
import type { Comparison, Registration } from "@web/types/cars";
import { format, subMonths } from "date-fns";
import { desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export const getCarsData = async (month: string): Promise<Registration> => {
  "use cache";
  cacheLife(CACHE_LIFE.monthlyData);
  cacheTag(...CACHE_TAG.cars.dataset(month));

  const fuelTypeQuery = db
    .select({
      name: cars.fuelType,
      count: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuelType)
    .orderBy(desc(sql<number>`sum(${cars.number})`));

  const vehicleTypeQuery = db
    .select({
      name: cars.vehicleType,
      count: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.vehicleType)
    .orderBy(desc(sql<number>`sum(${cars.number})`));

  const totalQuery = db
    .select({
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month));

  const [fuelType, vehicleType, totalResult] = await Promise.all([
    fuelTypeQuery,
    vehicleTypeQuery,
    totalQuery,
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    month,
    total,
    fuelType,
    vehicleType,
  };
};

export const getCarsComparison = async (month: string): Promise<Comparison> => {
  "use cache";
  cacheLife(CACHE_LIFE.monthlyData);
  cacheTag(...CACHE_TAG.cars.comparison(month));

  const currentDate = new Date(`${month}-01`);
  const previousMonthDate = subMonths(currentDate, 1);
  const previousMonthStr = format(previousMonthDate, "yyyy-MM");
  const previousYearDate = subMonths(currentDate, 12);
  const previousYearStr = format(previousYearDate, "yyyy-MM");

  const getMonthData = async (m: string) => {
    const fuelTypeQuery = db
      .select({
        label: cars.fuelType,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(eq(cars.month, m))
      .groupBy(cars.fuelType)
      .orderBy(desc(sql<number>`sum(${cars.number})`));

    const vehicleTypeQuery = db
      .select({
        label: cars.vehicleType,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(eq(cars.month, m))
      .groupBy(cars.vehicleType)
      .orderBy(desc(sql<number>`sum(${cars.number})`));

    const totalResult = await db
      .select({
        total: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(eq(cars.month, m));

    const [fuelType, vehicleType] = await Promise.all([
      fuelTypeQuery,
      vehicleTypeQuery,
    ]);

    return {
      period: m,
      total: totalResult[0]?.total ?? 0,
      fuelType,
      vehicleType,
    };
  };

  const [currentMonthData, previousMonthData, previousYearData] =
    await Promise.all([
      getMonthData(month),
      getMonthData(previousMonthStr),
      getMonthData(previousYearStr),
    ]);

  return {
    currentMonth: currentMonthData,
    previousMonth: previousMonthData,
    previousYear: previousYearData,
  };
};
