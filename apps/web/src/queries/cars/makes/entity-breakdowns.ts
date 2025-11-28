import { cars, db, type SelectCar } from "@sgcarstrends/database";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface MakeDetails {
  total: number;
  data: Partial<SelectCar>[];
}

export interface FuelTypeData {
  total: number;
  data: Array<{
    month: string;
    make: string;
    fuelType: string;
    count: number;
  }>;
}

interface VehicleTypeData {
  total: number;
  data: Array<{
    month: string;
    make: string;
    vehicleType: string;
    count: number;
  }>;
}

export const getMakeDetails = async (
  make: string,
  month?: string,
): Promise<MakeDetails> => {
  "use cache";
  cacheLife("max");
  cacheTag(`cars:make:${make}`);
  if (month) {
    cacheTag(`cars:month:${month}`);
  }

  const pattern = make.replaceAll("-", "%");
  const whereConditions = [ilike(cars.make, pattern)];

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
        fuelType: cars.fuelType,
        vehicleType: cars.vehicleType,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.fuelType, cars.vehicleType)
      .orderBy(desc(cars.month)),
  ]);

  return {
    total: totalResult[0]?.total ?? 0,
    data,
  };
};

export const getFuelTypeData = async (
  fuelType: string,
  month?: string,
): Promise<FuelTypeData> => {
  "use cache";
  cacheLife("max");
  cacheTag(`cars:fuel:${fuelType}`);
  if (month) {
    cacheTag(`cars:month:${month}`);
  }

  const pattern = fuelType.replaceAll("-", "%");
  const whereConditions = [ilike(cars.fuelType, pattern)];

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
        fuelType: cars.fuelType,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.make, cars.fuelType)
      .orderBy(desc(sql<number>`sum(${cars.number})`)),
  ]);

  return {
    total: totalResult[0]?.total ?? 0,
    data: data.map(({ month, make, fuelType, count }) => ({
      month,
      make,
      fuelType,
      count,
    })),
  };
};

export const getVehicleTypeData = async (
  vehicleType: string,
  month?: string,
): Promise<VehicleTypeData> => {
  "use cache";
  cacheLife("max");
  cacheTag(`cars:vehicle:${vehicleType}`);
  if (month) {
    cacheTag(`cars:month:${month}`);
  }

  const pattern = vehicleType.replaceAll("-", "%");
  const whereConditions = [ilike(cars.vehicleType, pattern)];

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
        vehicleType: cars.vehicleType,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.make, cars.vehicleType)
      .orderBy(desc(sql<number>`sum(${cars.number})`)),
  ]);

  return {
    total: totalResult[0]?.total ?? 0,
    data: data.map(({ month, make, vehicleType, count }) => ({
      month,
      make,
      vehicleType,
      count,
    })),
  };
};
