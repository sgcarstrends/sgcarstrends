import { getCarsLatestMonth, getCOELatestMonth } from "@web/lib/data/months";
import { getCarsMonths } from "@web/queries/cars";
import { getCoeMonths } from "@web/queries/coe";
import type { Month } from "@web/types";

export const fetchMonthsForCars = async (): Promise<Month[]> => {
  const results = await getCarsMonths();
  return results.map((r) => r.month);
};

export const fetchMonthsForCOE = async (): Promise<Month[]> => {
  const results = await getCoeMonths();
  return results.map((r) => r.month);
};

export const getLatestMonth = async (
  type: "cars" | "coe" = "cars",
): Promise<string> => {
  const latestMonth =
    type === "cars" ? await getCarsLatestMonth() : await getCOELatestMonth();

  if (!latestMonth) {
    throw new Error(`No ${type} data available`);
  }

  return latestMonth;
};

export const getMonthOrLatest = async (
  month: string | null,
  type: "cars" | "coe" = "cars",
): Promise<string> => {
  if (month) {
    return month;
  }
  return getLatestMonth(type);
};
