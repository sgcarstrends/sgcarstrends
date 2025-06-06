import db from "@api/config/db";
import { cars } from "@sgcarstrends/schema";
import { eq } from "drizzle-orm";

export const getCarsByMonth = (month: string) =>
  db.query.cars.findMany({
    where: eq(cars.month, month),
    columns: {
      number: true,
      fuel_type: true,
      vehicle_type: true,
    },
  });

export const getCarMetricsData = async (
  currentPeriod: string,
  previousMonthPeriod: string,
  previousYearPeriod: string,
) => {
  const [currentData, previousMonthData, previousYearData] = await Promise.all([
    getCarsByMonth(currentPeriod),
    getCarsByMonth(previousMonthPeriod),
    getCarsByMonth(previousYearPeriod),
  ]);

  return {
    currentData,
    previousMonthData,
    previousYearData,
  };
};
