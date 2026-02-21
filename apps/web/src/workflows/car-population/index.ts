import { redis } from "@sgcarstrends/utils";
import type { UpdaterResult } from "@web/lib/updater";
import { getCarPopulationYears } from "@web/queries/car-population";
import { updateCarPopulation } from "@web/workflows/car-population/steps/process-data";
import { revalidateTag } from "next/cache";

export async function carPopulationWorkflow(): Promise<{
  message: string;
}> {
  "use workflow";

  const result = await processCarPopulationData();

  if (result.recordsProcessed === 0) {
    return { message: "No car population records processed." };
  }

  const latestYear = await getLatestYear();
  if (!latestYear) {
    return { message: "No car population data found." };
  }

  await revalidateCarPopulationCache(latestYear);

  return {
    message:
      "[CAR POPULATION] Data processed and cache revalidated successfully",
  };
}

async function processCarPopulationData(): Promise<UpdaterResult> {
  "use step";
  const result = await updateCarPopulation();
  if (result.recordsProcessed > 0) {
    await redis.set("last_updated:car-population", Date.now());
  }
  return result;
}
processCarPopulationData.maxRetries = 3;

async function getLatestYear(): Promise<string | null> {
  "use step";
  const years = await getCarPopulationYears();
  return years[0]?.year ?? null;
}

async function revalidateCarPopulationCache(year: string): Promise<void> {
  "use step";
  const tags = [
    `cars:population:year:${year}`,
    "cars:population:years",
    "cars:population:totals",
  ];
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}
