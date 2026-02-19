import { redis } from "@sgcarstrends/utils";
import type { UpdaterResult } from "@web/lib/updater";
import { getVehiclePopulationYears } from "@web/queries/vehicle-population";
import { updateVehiclePopulation } from "@web/workflows/vehicle-population/steps/process-data";
import { revalidateTag } from "next/cache";

export async function vehiclePopulationWorkflow(): Promise<{
  message: string;
}> {
  "use workflow";

  const result = await processVehiclePopulationData();

  if (result.recordsProcessed === 0) {
    return { message: "No vehicle population records processed." };
  }

  const latestYear = await getLatestYear();
  if (!latestYear) {
    return { message: "No vehicle population data found." };
  }

  await revalidateVehiclePopulationCache(latestYear);

  return {
    message:
      "[VEHICLE POPULATION] Data processed and cache revalidated successfully",
  };
}

async function processVehiclePopulationData(): Promise<UpdaterResult> {
  "use step";
  const result = await updateVehiclePopulation();
  if (result.recordsProcessed > 0) {
    await redis.set("last_updated:vehicle-population", Date.now());
  }
  return result;
}
processVehiclePopulationData.maxRetries = 3;

async function getLatestYear(): Promise<string | null> {
  "use step";
  const years = await getVehiclePopulationYears();
  return years[0]?.year ?? null;
}

async function revalidateVehiclePopulationCache(year: string): Promise<void> {
  "use step";
  const tags = [
    `vehicle-population:year:${year}`,
    "vehicle-population:years",
    "vehicle-population:totals",
  ];
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}
