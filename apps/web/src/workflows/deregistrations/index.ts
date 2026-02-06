import { redis } from "@sgcarstrends/utils";
import { getDeregistrationsMonthlyRevalidationTags } from "@web/lib/cache-tags";
import type { UpdaterResult } from "@web/lib/updater";
import { getDeregistrationsLatestMonth } from "@web/queries/deregistrations/latest-month";
import { updateDeregistration } from "@web/workflows/deregistrations/steps/process-data";
import { revalidateTag } from "next/cache";

interface DeregistrationsWorkflowPayload {
  month?: string;
}

interface DeregistrationsWorkflowResult {
  message: string;
}

/**
 * Deregistrations data workflow using Vercel WDK.
 * Processes vehicle deregistration data and revalidates cache.
 */
export async function deregistrationsWorkflow(
  _payload: DeregistrationsWorkflowPayload,
): Promise<DeregistrationsWorkflowResult> {
  "use workflow";

  const result = await processDeregistrationsData();

  if (result.recordsProcessed === 0) {
    return { message: "No deregistration records processed." };
  }

  const latestMonth = await getLatestMonth();
  if (!latestMonth) {
    return { message: "No deregistration data found." };
  }

  await revalidateDeregistrationsCache(latestMonth);

  return {
    message:
      "[DEREGISTRATIONS] Data processed and cache revalidated successfully",
  };
}

async function processDeregistrationsData(): Promise<UpdaterResult> {
  "use step";

  const result = await updateDeregistration();

  if (result.recordsProcessed > 0) {
    await redis.set("last_updated:deregistrations", Date.now());
  }

  return result;
}
processDeregistrationsData.maxRetries = 3;

async function getLatestMonth(): Promise<string | null> {
  "use step";

  const { month } = await getDeregistrationsLatestMonth();
  return month ?? null;
}

async function revalidateDeregistrationsCache(month: string): Promise<void> {
  "use step";

  const tags = getDeregistrationsMonthlyRevalidationTags(month);
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}
