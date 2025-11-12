import { cars, db, type SelectCar } from "@sgcarstrends/database";
import { and, desc, eq, sql } from "drizzle-orm";

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
  const pattern = make.replaceAll("-", "%");
  const whereConditions = [sql`lower(${cars.make}) LIKE lower(${pattern})`];

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
  const pattern = fuelType.replaceAll("-", "%");
  const whereConditions = [sql`lower(${cars.fuelType}) LIKE lower(${pattern})`];

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
    data: data.map((d) => ({
      month: d.month ?? "",
      make: d.make ?? "Unknown",
      fuelType: d.fuelType ?? "Unknown",
      count: d.count,
    })),
  };
};

export const getVehicleTypeData = async (
  vehicleType: string,
  month?: string,
): Promise<VehicleTypeData> => {
  const pattern = vehicleType.replaceAll("-", "%");
  const whereConditions = [
    sql`lower(${cars.vehicleType}) LIKE lower(${pattern})`,
  ];

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
    data: data.map((d) => ({
      month: d.month ?? "",
      make: d.make ?? "Unknown",
      vehicleType: d.vehicleType ?? "Unknown",
      count: d.count,
    })),
  };
};
