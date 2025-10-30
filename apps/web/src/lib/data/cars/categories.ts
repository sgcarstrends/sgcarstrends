/**
 * Generic type queries for fuel types and vehicle types
 * This module provides reusable query functions that work with both fuel_type and vehicle_type columns
 */

import { cars, db } from "@sgcarstrends/database";
import { and, desc, eq, sql } from "drizzle-orm";

/**
 * Configuration for type-based queries
 * Allows parameterization of queries across different type columns
 */
export interface TypeConfig {
  column: typeof cars.fuel_type | typeof cars.vehicle_type;
  fieldName: "fuelType" | "vehicleType";
}

/**
 * Predefined configuration for fuel type queries
 */
export const FUEL_TYPE: TypeConfig = {
  column: cars.fuel_type,
  fieldName: "fuelType",
};

/**
 * Predefined configuration for vehicle type queries
 */
export const VEHICLE_TYPE: TypeConfig = {
  column: cars.vehicle_type,
  fieldName: "vehicleType",
};

/**
 * Result type for type distribution queries
 */
export interface TypeDistribution {
  name: string | null;
  count: number;
}

/**
 * Get distribution of registrations by type for a specific month
 * @param config - Type configuration (FUEL_TYPE or VEHICLE_TYPE)
 * @param month - Month in format "YYYY-MM"
 * @returns Array of type distributions ordered by count descending
 * @example
 * const fuelTypes = await getTypeDistribution(FUEL_TYPE, "2024-01");
 * const vehicleTypes = await getTypeDistribution(VEHICLE_TYPE, "2024-01");
 */
export const getTypeDistribution = async (
  config: TypeConfig,
  month: string,
): Promise<TypeDistribution[]> => {
  return db
    .select({
      name: config.column,
      count: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(config.column)
    .orderBy(desc(sql<number>`sum(${cars.number})`));
};

/**
 * Result type for top type queries
 */
export interface TopTypeResult {
  name: string | null;
  total: number;
}

/**
 * Get top N types by registration count for a specific month
 * @param config - Type configuration (FUEL_TYPE or VEHICLE_TYPE)
 * @param month - Month in format "YYYY-MM"
 * @param limit - Number of top types to return (default: 1)
 * @returns Array of top types ordered by total descending
 * @example
 * const topFuelType = await getTopType(FUEL_TYPE, "2024-01", 1);
 * const top3VehicleTypes = await getTopType(VEHICLE_TYPE, "2024-01", 3);
 */
export const getTopType = async (
  config: TypeConfig,
  month: string,
  limit: number = 1,
): Promise<TopTypeResult[]> => {
  return db
    .select({
      name: config.column,
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(config.column)
    .orderBy(desc(sql<number>`sum(${cars.number})`))
    .limit(limit);
};

/**
 * Get all distinct values for a type, optionally filtered by month
 * @param config - Type configuration (FUEL_TYPE or VEHICLE_TYPE)
 * @param month - Optional month filter in format "YYYY-MM"
 * @returns Array of distinct type values
 * @example
 * const allFuelTypes = await getDistinctTypes(FUEL_TYPE);
 * const januaryVehicleTypes = await getDistinctTypes(VEHICLE_TYPE, "2024-01");
 */
export const getDistinctTypes = async (
  config: TypeConfig,
  month?: string,
): Promise<string[]> => {
  const whereConditions = [];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  const results = await db
    .selectDistinct({ value: config.column })
    .from(cars)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(config.column);

  return results
    .map((r) => r.value ?? "Unknown")
    .filter((v): v is string => v !== null);
};

/**
 * Detailed data for a specific type value
 */
export interface TypeDetailData {
  total: number;
  data: Array<{
    month: string;
    make: string;
    type: string;
    count: number;
  }>;
}

/**
 * Get detailed registration data for a specific type value
 * @param config - Type configuration (FUEL_TYPE or VEHICLE_TYPE)
 * @param typeValue - The type value to filter by (e.g., "Petrol", "Passenger Car")
 * @param month - Optional month filter in format "YYYY-MM"
 * @returns Detailed data including total and breakdown by make
 * @example
 * const petrolData = await getTypeDetails(FUEL_TYPE, "petrol", "2024-01");
 * const passengerCarData = await getTypeDetails(VEHICLE_TYPE, "passenger-car");
 */
export const getTypeDetails = async (
  config: TypeConfig,
  typeValue: string,
  month?: string,
): Promise<TypeDetailData> => {
  const pattern = typeValue.replaceAll("-", "%");
  const whereConditions = [sql`lower(${config.column}) LIKE lower(${pattern})`];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  const [totalResult, data] = await Promise.all([
    db
      .select({
        total: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(and(...whereConditions)),
    db
      .select({
        month: cars.month,
        make: cars.make,
        type: config.column,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.make, config.column)
      .orderBy(desc(sql<number>`sum(${cars.number})`)),
  ]);

  return {
    total: totalResult[0]?.total ?? 0,
    data: data.map((d) => ({
      month: d.month ?? "",
      make: d.make ?? "Unknown",
      type: d.type ?? "Unknown",
      count: d.count,
    })),
  };
};
