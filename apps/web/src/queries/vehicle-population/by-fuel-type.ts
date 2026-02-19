import { db, desc, eq, sql, vehiclePopulation } from "@sgcarstrends/database";
import { cacheLife, cacheTag } from "next/cache";

interface FuelTypeTotal {
  fuelType: string;
  total: number;
}

export async function getVehiclePopulationByFuelType(
  year: string,
): Promise<FuelTypeTotal[]> {
  "use cache";
  cacheLife("max");
  cacheTag(`vehicle-population:year:${year}`);

  return db
    .select({
      fuelType: vehiclePopulation.fuelType,
      total:
        sql<number>`cast(sum(${vehiclePopulation.number}) as integer)`.mapWith(
          Number,
        ),
    })
    .from(vehiclePopulation)
    .where(eq(vehiclePopulation.year, year))
    .groupBy(vehiclePopulation.fuelType)
    .orderBy(desc(sql`sum(${vehiclePopulation.number})`));
}
