import { cars, db } from "@sgcarstrends/database";
import type {
  Comparison,
  FuelType,
  Registration,
  TopType,
} from "@web/types/cars";
import { format, subMonths } from "date-fns";
import { and, desc, eq, sql } from "drizzle-orm";

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

export const getCarsData = async (month: string): Promise<Registration> => {
  const fuelTypeQuery = db
    .select({
      name: cars.fuel_type,
      count: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuel_type)
    .orderBy(desc(sql<number>`sum(${cars.number})`));

  const vehicleTypeQuery = db
    .select({
      name: cars.vehicle_type,
      count: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.vehicle_type)
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
    fuelType: fuelType.map((type) => ({
      ...type,
      name: type.name ?? "Unknown",
    })),
    vehicleType: vehicleType.map((type) => ({
      ...type,
      name: type.name ?? "Unknown",
    })),
  };
};

export const getCarsComparison = async (month: string): Promise<Comparison> => {
  const currentDate = new Date(`${month}-01`);
  const previousMonthDate = subMonths(currentDate, 1);
  const previousMonthStr = format(previousMonthDate, "yyyy-MM");
  const previousYearDate = subMonths(currentDate, 12);
  const previousYearStr = format(previousYearDate, "yyyy-MM");

  const getMonthData = async (m: string) => {
    const fuelTypeQuery = db
      .select({
        label: cars.fuel_type,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(eq(cars.month, m))
      .groupBy(cars.fuel_type)
      .orderBy(desc(sql<number>`sum(${cars.number})`));

    const vehicleTypeQuery = db
      .select({
        label: cars.vehicle_type,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(eq(cars.month, m))
      .groupBy(cars.vehicle_type)
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
      fuelType: fuelType.map((ft) => ({
        label: ft.label ?? "Unknown",
        count: ft.count,
      })),
      vehicleType: vehicleType.map((vt) => ({
        label: vt.label ?? "Unknown",
        count: vt.count,
      })),
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

export const getTopTypes = async (month: string): Promise<TopType> => {
  const topFuelTypeQuery = db
    .select({
      name: cars.fuel_type,
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuel_type)
    .orderBy(desc(sql<number>`sum(${cars.number})`))
    .limit(1);

  const topVehicleTypeQuery = db
    .select({
      name: cars.vehicle_type,
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.vehicle_type)
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
    topFuelType: { ...topFuelType, name: topFuelType.name ?? "Unknown" },
    topVehicleType: {
      ...topVehicleType,
      name: topVehicleType.name ?? "Unknown",
    },
  };
};

interface TopMake {
  make: string;
  total: number;
}

export const getTopMakes = async (month: string): Promise<TopMake[]> => {
  const results = await db
    .select({
      make: cars.make,
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.make)
    .orderBy(desc(sql<number>`sum(${cars.number})`))
    .limit(10);

  return results.map((r) => ({ ...r, make: r.make ?? "Unknown" }));
};

export const getTopMakesByFuelType = async (
  month: string,
): Promise<FuelType[]> => {
  const fuelTypeResults = await db
    .select({
      fuelType: cars.fuel_type,
      total: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuel_type)
    .orderBy(desc(sql<number>`sum(${cars.number})`));

  const topMakesByFuelType: FuelType[] = [];

  for (const fuelTypeRow of fuelTypeResults) {
    const topMakes = await db
      .select({
        make: cars.make,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(
        and(
          eq(cars.month, month),
          eq(cars.fuel_type, fuelTypeRow.fuelType ?? ""),
        ),
      )
      .groupBy(cars.make)
      .orderBy(desc(sql<number>`sum(${cars.number})`))
      .limit(5);

    topMakesByFuelType.push({
      fuelType: fuelTypeRow.fuelType ?? "Unknown",
      total: fuelTypeRow.total,
      makes: topMakes.map((m) => ({
        make: m.make ?? "Unknown",
        count: m.count,
      })),
    });
  }

  return topMakesByFuelType;
};

export const getCarMarketShareData = async (
  month: string,
  category: "fuelType" | "vehicleType",
): Promise<CarMarketShareResponse> => {
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

  const dominantType = marketShareData.reduce((max, current) =>
    current.percentage > max.percentage ? current : max,
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

/**
 * Get all distinct car makes ordered alphabetically
 */
export const getDistinctMakes = async (): Promise<{ make: string }[]> => {
  const results = await db
    .selectDistinct({ make: cars.make })
    .from(cars)
    .orderBy(cars.make);

  return results.map((r) => ({ make: r.make ?? "Unknown" }));
};

/**
 * Check if a car make exists in the database
 * Uses case-insensitive pattern matching with support for URL-encoded dashes
 */
export const checkMakeIfExist = async (
  make: string,
): Promise<{ make: string } | undefined> => {
  const pattern = make.replaceAll("-", "%");
  const result = await db.query.cars.findFirst({
    where: sql`lower(${cars.make}) LIKE lower(${pattern})`,
    columns: { make: true },
  });

  return result ? { make: result.make ?? "Unknown" } : undefined;
};

interface MakeDetails {
  total: number;
  data: Array<{
    month: string;
    fuelType: string;
    vehicleType: string;
    count: number;
  }>;
}

/**
 * Get detailed information about a specific car make
 * Optionally filter by month
 */
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
        fuelType: cars.fuel_type,
        vehicleType: cars.vehicle_type,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.fuel_type, cars.vehicle_type)
      .orderBy(desc(cars.month)),
  ]);

  return {
    total: totalResult[0]?.total ?? 0,
    data: data.map((d) => ({
      month: d.month ?? "",
      fuelType: d.fuelType ?? "Unknown",
      vehicleType: d.vehicleType ?? "Unknown",
      count: d.count,
    })),
  };
};

/**
 * Get all distinct fuel types, optionally filtered by month
 */
export const getDistinctFuelTypes = async (
  month?: string,
): Promise<{ fuelType: string }[]> => {
  const whereConditions = [];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  const results = await db
    .selectDistinct({ fuelType: cars.fuel_type })
    .from(cars)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(cars.fuel_type);

  return results.map((r) => ({ fuelType: r.fuelType ?? "Unknown" }));
};

/**
 * Get all distinct vehicle types, optionally filtered by month
 */
export const getDistinctVehicleTypes = async (
  month?: string,
): Promise<{ vehicleType: string }[]> => {
  const whereConditions = [];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  const results = await db
    .selectDistinct({ vehicleType: cars.vehicle_type })
    .from(cars)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(cars.vehicle_type);

  return results.map((r) => ({ vehicleType: r.vehicleType ?? "Unknown" }));
};

interface FuelTypeData {
  total: number;
  data: Array<{
    month: string;
    make: string;
    fuelType: string;
    count: number;
  }>;
}

/**
 * Get detailed data for a specific fuel type
 * Optionally filter by month
 */
export const getFuelTypeData = async (
  fuelType: string,
  month?: string,
): Promise<FuelTypeData> => {
  const pattern = fuelType.replaceAll("-", "%");
  const whereConditions = [
    sql`lower(${cars.fuel_type}) LIKE lower(${pattern})`,
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
        fuelType: cars.fuel_type,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.make, cars.fuel_type)
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

interface VehicleTypeData {
  total: number;
  data: Array<{
    month: string;
    make: string;
    vehicleType: string;
    count: number;
  }>;
}

/**
 * Get detailed data for a specific vehicle type
 * Optionally filter by month
 */
export const getVehicleTypeData = async (
  vehicleType: string,
  month?: string,
): Promise<VehicleTypeData> => {
  const pattern = vehicleType.replaceAll("-", "%");
  const whereConditions = [
    sql`lower(${cars.vehicle_type}) LIKE lower(${pattern})`,
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
        vehicleType: cars.vehicle_type,
        count: sql<number>`sum(${cars.number})`.mapWith(Number),
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.make, cars.vehicle_type)
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

/**
 * Get list of available months with car data
 */
export const getCarsMonths = async (): Promise<{ month: string }[]> => {
  const results = await db
    .selectDistinct({ month: cars.month })
    .from(cars)
    .orderBy(desc(cars.month));

  return results.map((r) => ({ month: r.month ?? "" }));
};
