import { redis } from "@sgcarstrends/utils";
import type { UpdaterResult } from "@web/lib/updater";
import { updateCarCosts } from "@web/workflows/car-costs/steps/process-data";

interface CarCostsWorkflowResult {
  message: string;
}

/**
 * Car costs data workflow using Vercel WDK.
 * Fetches and processes the LTA Car Cost Update XLSX.
 */
export async function carCostsWorkflow(): Promise<CarCostsWorkflowResult> {
  "use workflow";

  const result = await processCarCostsData();

  if (result.recordsProcessed === 0) {
    return { message: "No car cost records processed." };
  }

  return {
    message: "[CAR COSTS] Data processed successfully",
  };
}

async function processCarCostsData(): Promise<UpdaterResult> {
  "use step";

  const result = await updateCarCosts();

  if (result.recordsProcessed > 0) {
    await redis.set("last_updated:car_costs", Date.now());
  }

  return result;
}
processCarCostsData.maxRetries = 3;
