import { cars, db } from "@sgcarstrends/database";
import { CACHE_LIFE, CACHE_TAG } from "@web/lib/cache";
import { getCarsData } from "@web/queries";
import type { FuelType, TopType } from "@web/types/cars";
import { and, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface CarMarketShareData {
  name: string;
  count: number;
  percentage: number;
  colour: string;
}

export interface CarMarketShareResponse {
  month: string;
  total: number;
  category: "fuelType" | "vehicleType";
  data: CarMarketShareData[];
  dominantType: {
    name: string;
    percentage: number;
  };
}

export interface CarTopTypeData {
  name: string;
  count: number;
  percentage: number;
  rank: number;
}

export interface CarTopMakeData {
  make: string;
  count: number;
  percentage: number;
  rank: number;
  fuelType?: string;
  vehicleType?: string;
}

export interface CarTopPerformersData {
  month: string;
  total: number;
  topFuelTypes: CarTopTypeData[];
  topVehicleTypes: CarTopTypeData[];
  topMakes: CarTopMakeData[];
}

interface TopMake {
  make: string;
  total: number;
}

export const getTopTypes = async (month: string): Promise<TopType> => {
  "use cache";
  cacheLife("max");
  cacheTag(...CACHE_TAG.cars.types(month));

  const topFuelTypeQuery = db
    .select({
      name: cars.fuelType,
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuelType)
    .orderBy(desc(sql<number>`sum(${cars.number})`))
    .limit(1);

  const topVehicleTypeQuery = db
    .select({
      name: cars.vehicleType,
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.vehicleType)
    .orderBy(desc(sql<number>`sum(${cars.number})`))
    .limit(1);

  const [topFuelTypeResult, topVehicleTypeResult] = await Promise.all([
    topFuelTypeQuery,
    topVehicleTypeQuery,
  ]);

  const topFuelType = topFuelTypeResult[0] ?? { name: "N/A", total: 0 };
  const topVehicleType = topVehicleTypeResult[0] ?? { name: "N/A", total: 0 };

  return {
    month,
    topFuelType,
    topVehicleType,
  };
};

export const getTopMakes = async (month: string): Promise<TopMake[]> => {
  return db
    .select({
      make: cars.make,
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.make)
    .orderBy(desc(sql<number>`sum(${cars.number})`))
    .limit(10);
};

export const getTopMakesByFuelType = async (
  month: string,
): Promise<FuelType[]> => {
  "use cache";
  cacheLife("max");
  cacheTag(...CACHE_TAG.cars.makes(month));

  const fuelTypeResults = await db
    .select({
      fuelType: cars.fuelType,
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuelType)
    .orderBy(desc(sql<number>`sum(${cars.number})`));

  const topMakesByFuelType: FuelType[] = [];

  for (const { fuelType, total } of fuelTypeResults) {
    const topMakes = await db
      .select({
        make: cars.make,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(and(eq(cars.month, month), eq(cars.fuelType, fuelType)))
      .groupBy(cars.make)
      .orderBy(desc(sql<number>`sum(${cars.number})`))
      .limit(5);

    topMakesByFuelType.push({
      fuelType,
      total,
      makes: topMakes.map(({ make, count }) => ({ make, count })),
    });
  }

  return topMakesByFuelType;
};

export const getCarMarketShareData = async (
  month: string,
  category: "fuelType" | "vehicleType",
): Promise<CarMarketShareResponse> => {
  "use cache";
  cacheLife("max");
  cacheTag(...CACHE_TAG.cars.marketShare(category, month));

  const response = await getCarsData(month);

  const categoryData = response[category];
  const total = response.total;

  const marketShareData = categoryData.map((item, index) => ({
    name: item.name,
    count: item.count,
    percentage: (item.count / total) * 100,
    colour: [
      "#3b82f6",
      "#10b981",
      "#8b5cf6",
      "#f59e0b",
      "#ef4444",
      "#06b6d4",
      "#6366f1",
      "#f97316",
      "#14b8a6",
      "#84cc16",
    ][index % 10],
  }));

  const dominantType = marketShareData.reduce(
    (max, current) => (current.percentage > max.percentage ? current : max),
    marketShareData[0] ?? {
      name: "Unknown",
      percentage: 0,
      count: 0,
      colour: "#000000",
    },
  );

  return {
    month: response.month,
    total,
    category,
    data: marketShareData,
    dominantType: {
      name: dominantType.name,
      percentage: dominantType.percentage,
    },
  };
};

export const getCarTopPerformersData = async (
  month: string,
): Promise<CarTopPerformersData> => {
  "use cache";
  cacheLife("max");
  cacheTag(...CACHE_TAG.cars.topPerformers(month));

  const [topTypes, topMakes] = await Promise.all([
    getTopTypes(month),
    getTopMakes(month),
  ]);

  const carsData = await getCarsData(month);
  const total = carsData.total;

  const topFuelTypes = [
    {
      name: topTypes.topFuelType.name,
      count: topTypes.topFuelType.total,
      percentage: (topTypes.topFuelType.total / total) * 100,
      rank: 1,
    },
  ];

  const topVehicleTypes = [
    {
      name: topTypes.topVehicleType.name,
      count: topTypes.topVehicleType.total,
      percentage: (topTypes.topVehicleType.total / total) * 100,
      rank: 1,
    },
  ];

  const topMakesData = topMakes.map((make, index) => ({
    make: make.make,
    count: make.total,
    percentage: (make.total / total) * 100,
    rank: index + 1,
  }));

  return {
    month: topTypes.month,
    total,
    topFuelTypes,
    topVehicleTypes,
    topMakes: topMakesData,
  };
};
