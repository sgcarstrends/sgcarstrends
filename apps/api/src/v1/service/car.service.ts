import { HYBRID_REGEX, MPV_REGEX } from "@api/config";
import db from "@api/config/db";
import { getLatestMonth } from "@api/lib/getLatestMonth";
import { cars } from "@sgcarstrends/schema";
import { getTrailingSixMonths } from "@sgcarstrends/utils";
import { type SQL, and, between, desc, eq, ilike, sql } from "drizzle-orm";

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
