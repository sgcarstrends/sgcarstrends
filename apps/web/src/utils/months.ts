import { getCarsMonths } from "@web/queries/cars";
import { getCarsLatestMonth } from "@web/queries/cars/latest-month";
import { getCoeMonths } from "@web/queries/coe";
import { getCOELatestMonth } from "@web/queries/coe/latest-month";
import {
  getDeregistrationsAvailableMonths,
  getDeregistrationsLatestMonth,
} from "@web/queries/deregistrations";
import type { Month } from "@web/types";

export const fetchMonthsForCars = async (): Promise<Month[]> => {
  const results = await getCarsMonths();
  return results.map((r) => r.month);
};

export const fetchMonthsForCOE = async (): Promise<Month[]> => {
  const results = await getCoeMonths();
  return results.map((r) => r.month);
};

export const fetchMonthsForDeregistrations = async (): Promise<Month[]> => {
  const results = await getDeregistrationsAvailableMonths();
  return results.map((r) => r.month);
};

export const getLatestMonth = async (
  type: "cars" | "coe" | "deregistrations" = "cars",
): Promise<string> => {
  let latestMonth: string | null = null;

  if (type === "cars") {
    latestMonth = await getCarsLatestMonth();
  } else if (type === "coe") {
    latestMonth = await getCOELatestMonth();
  } else if (type === "deregistrations") {
    const result = await getDeregistrationsLatestMonth();
    latestMonth = result?.month ?? null;
  }

  if (!latestMonth) {
    throw new Error(`No ${type} data available`);
  }

  return latestMonth;
};

export const getMonthOrLatest = async (
  month: string | null,
  type: "cars" | "coe" | "deregistrations" = "cars",
): Promise<string> => {
  if (month) {
    return month;
  }
  return getLatestMonth(type);
};
