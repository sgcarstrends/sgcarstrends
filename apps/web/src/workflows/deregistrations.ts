import { redis } from "@sgcarstrends/utils";
import type { UpdaterResult } from "@web/lib/updater";
import { updateDeregistration } from "@web/lib/workflows/update-deregistration";
import { getDeregistrationsLatestMonth } from "@web/queries/deregistrations/latest-month";
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

  // Step 1: Process deregistrations data
  const result = await processDeregistrationsData();

  if (result.recordsProcessed === 0) {
    return {
      message: "No deregistration records processed.",
    };
  }

  // Step 2: Get latest month from database
  const latestMonth = await getLatestMonth();
  if (!latestMonth) {
    return { message: "No deregistration data found." };
  }

  // Step 3: Revalidate data cache
  await revalidateDeregistrationsCache(latestMonth);

  return {
    message:
      "[DEREGISTRATIONS] Data processed and cache revalidated successfully",
  };
}

/**
 * Process deregistrations data from LTA DataMall and update database.
 */
async function processDeregistrationsData(): Promise<UpdaterResult> {
  "use step";

  console.log("Processing deregistrations data");

  const result = await updateDeregistration();

  if (result.recordsProcessed > 0) {
    const now = Date.now();
    await redis.set("last_updated:deregistrations", now);
    console.log("Last updated deregistrations:", now);
  } else {
    console.log("No changes for deregistrations");
  }

  return result;
}

/**
 * Get the latest month from the deregistrations database.
 */
async function getLatestMonth(): Promise<string | null> {
  "use step";

  const { month } = await getDeregistrationsLatestMonth();
  return month ?? null;
}

/**
 * Revalidate Next.js cache tags for deregistrations data.
 */
async function revalidateDeregistrationsCache(month: string): Promise<void> {
  "use step";

  const tags = [`deregistrations:month:${month}`, "deregistrations:months"];

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  console.log(`[WORKFLOW] Cache invalidated for tags: ${tags.join(", ")}`);
}
