import { db } from "@api/config/db";
import { cars } from "@sgcarstrends/database";
import { and, asc, desc, eq, gt, ilike, max, sql, sum } from "drizzle-orm";

export const getCarsByMonth = (month: string) =>
  db.query.cars.findMany({
    where: eq(cars.month, month),
    columns: {
      number: true,
      fuel_type: true,
      vehicle_type: true,
    },
  });

export const getCarRegistrationByMonth = (month: string) =>
  db
    .select({ total: sql<number>`cast(sum(${cars.number}) as integer)` })
    .from(cars)
    .where(eq(cars.month, month));

export const getCarsByFuelType = (month: string) =>
  db
    .select({
      name: cars.fuel_type,
      count: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuel_type)
    .orderBy(desc(sum(cars.number)))
    .having(gt(sum(cars.number), 0));

export const getCarsByVehicleType = (month: string) =>
  db
    .select({
      name: cars.vehicle_type,
      count: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.vehicle_type)
    .orderBy(desc(sum(cars.number)))
    .having(gt(sum(cars.number), 0));

export const getCarsTopMakesByFuelType = async (month: string) => {
  // First get all fuel types with their totals
  const fuelTypes = await db
    .select({
      fuelType: cars.fuel_type,
      total: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuel_type)
    .orderBy(asc(cars.fuel_type))
    .having(gt(sum(cars.number), 0));

  // Get top 3 makes for each fuel type
  return Promise.all(
    fuelTypes.map(async ({ fuelType, total }) => {
      const whereConditions = [
        eq(cars.month, month),
        eq(cars.fuel_type, fuelType),
      ];

      const topMakes = await db
        .select({
          make: cars.make,
          count: sql<number>`cast(sum(${cars.number}) as integer)`,
        })
        .from(cars)
        .where(and(...whereConditions))
        .groupBy(cars.make, cars.fuel_type)
        .having(gt(sum(cars.number), 0))
        .orderBy(desc(sum(cars.number)))
        .limit(3);

      return {
        fuelType,
        total,
        makes: topMakes,
      };
    }),
  );
};

export const getTopTypes = (month: string) =>
  db.batch([
    db
      .select({
        name: cars.fuel_type,
        total: sql<number>`cast(sum(${cars.number}) as integer)`,
      })
      .from(cars)
      .where(eq(cars.month, month))
      .groupBy(cars.fuel_type)
      .orderBy(desc(sum(cars.number)))
      .limit(1),
    db
      .select({
        name: cars.vehicle_type,
        total: sql<number>`cast(sum(${cars.number}) as integer)`,
      })
      .from(cars)
      .where(eq(cars.month, month))
      .groupBy(cars.vehicle_type)
      .orderBy(desc(sum(cars.number)))
      .limit(1),
  ]);

export const getDistinctFuelTypes = (month: string) => {
  const whereConditions = [];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  return db
    .selectDistinct({ fuelType: cars.fuel_type })
    .from(cars)
    .where(and(...whereConditions))
    .orderBy(asc(cars.fuel_type));
};

export const getFuelTypeByMonth = (fuelType: string, month: string) => {
  const whereConditions = [
    ilike(cars.fuel_type, fuelType.replaceAll("-", "%")),
  ];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  return db.batch([
    db
      .select({ total: sql<number>`cast(sum(${cars.number}) as integer)` })
      .from(cars)
      .where(and(...whereConditions)),
    db
      .select({
        month: cars.month,
        make: cars.make,
        fuel_type: cars.fuel_type,
        count: sql<number>`cast(sum(${cars.number}) as integer)`,
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.make, cars.fuel_type)
      .orderBy(desc(sum(cars.number)))
      .having(gt(sum(cars.number), 0)),
  ]);
};

export const getDistinctVehicleTypes = (month: string) => {
  const whereConditions = [];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  return db
    .selectDistinct({ vehicleType: cars.vehicle_type })
    .from(cars)
    .where(and(...whereConditions))
    .orderBy(asc(cars.vehicle_type));
};

export const getVehicleTypeByMonth = (vehicleType: string, month: string) => {
  const whereConditions = [
    ilike(cars.vehicle_type, vehicleType.replaceAll("-", "%")),
  ];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  return db.batch([
    db
      .select({ total: sql<number>`cast(sum(${cars.number}) as integer)` })
      .from(cars)
      .where(and(...whereConditions)),
    db
      .select({
        month: cars.month,
        make: cars.make,
        vehicle_type: cars.vehicle_type,
        count: sql<number>`cast(sum(${cars.number}) as integer)`,
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.make, cars.vehicle_type)
      .orderBy(desc(sum(cars.number)))
      .having(gt(sum(cars.number), 0)),
  ]);
};

export const getDistinctMakes = () =>
  db.selectDistinct({ make: cars.make }).from(cars).orderBy(asc(cars.make));

const createMakeSearchPattern = (make: string) => make.replaceAll("-", "%");

const createMakeWhereConditions = (make: string, month?: string) => {
  const whereConditions = [ilike(cars.make, createMakeSearchPattern(make))];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  return whereConditions;
};

export const checkMakeIfExist = (make: string) =>
  db.query.cars.findFirst({
    where: ilike(cars.make, createMakeSearchPattern(make)),
    columns: { make: true },
  });

export const getMake = async (make: string, month: string) => {
  const whereConditions = createMakeWhereConditions(make, month);

  const [totalResult, data] = await db.batch([
    db
      .select({
        total: sql<number>`cast(sum(${cars.number}) as integer)`,
      })
      .from(cars)
      .where(and(...whereConditions)),
    db
      .select({
        month: cars.month,
        fuelType: cars.fuel_type,
        vehicleType: cars.vehicle_type,
        count: sql<number>`cast(sum(${cars.number}) as integer)`,
      })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.month, cars.fuel_type, cars.vehicle_type)
      .orderBy(desc(cars.month)),
  ]);

  return {
    total: totalResult[0].total ?? 0,
    data,
  };
};

export const getLatestYear = async (): Promise<string> => {
  const [result] = await db
    .select({
      latestMonth: max(cars.month),
    })
    .from(cars);

  const latestMonth = result.latestMonth;
  if (!latestMonth) {
    // Fallback to current year if no data
    return new Date().getFullYear().toString();
  }

  return latestMonth.split("-")[0];
};

export const getPopularMakesByYear = async (
  year: string,
  limit: number = 8,
) => {
  const whereConditions = [ilike(cars.month, `${year}-%`), gt(cars.number, 0)];

  const results = await db
    .select({
      make: cars.make,
      totalRegistrations: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(and(...whereConditions))
    .groupBy(cars.make)
    .orderBy(desc(sum(cars.number)))
    .limit(limit);

  // Calculate total registrations for the year to compute market share
  const [yearTotal] = await db
    .select({
      total: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(and(...whereConditions));

  const totalRegistrations = yearTotal.total ?? 0;

  return {
    year,
    totalRegistrations,
    makes: results.map((result) => ({
      make: result.make,
      registrations: result.totalRegistrations,
      percentage:
        totalRegistrations > 0
          ? (result.totalRegistrations / totalRegistrations) * 100
          : 0,
    })),
  };
};
