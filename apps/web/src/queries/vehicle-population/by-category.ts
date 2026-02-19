import { db, desc, eq, sql, vehiclePopulation } from "@sgcarstrends/database";
import { cacheLife, cacheTag } from "next/cache";

interface CategoryTotal {
  category: string;
  total: number;
}

export async function getVehiclePopulationByCategory(
  year: string,
): Promise<CategoryTotal[]> {
  "use cache";
  cacheLife("max");
  cacheTag(`vehicle-population:year:${year}`);

  return db
    .select({
      category: vehiclePopulation.category,
      total:
        sql<number>`cast(sum(${vehiclePopulation.number}) as integer)`.mapWith(
          Number,
        ),
    })
    .from(vehiclePopulation)
    .where(eq(vehiclePopulation.year, year))
    .groupBy(vehiclePopulation.category)
    .orderBy(desc(sql`sum(${vehiclePopulation.number})`));
}
