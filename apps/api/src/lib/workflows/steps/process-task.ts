import type { UpdaterResult } from "@api/lib/updater";
import { redis } from "@sgcarstrends/utils";
import type { WorkflowContext } from "@upstash/workflow";

export interface WorkflowStep {
  name: string;
  handler: () => Promise<UpdaterResult>;
}

/**
 * Process a single task and update its timestamp if data was updated
 */
export const processTask = async (
  context: WorkflowContext,
  name: string,
  handler: () => Promise<UpdaterResult>,
): Promise<UpdaterResult> =>
  context.run(`Processing "${name}" data`, async () => {
    console.log(`Processing "${name}" data`);

    try {
      const result = await handler();

      if (result.recordsProcessed > 0) {
        const now = Date.now();
        await redis.set(`last_updated:${name}`, now);
        console.log(`Last updated "${name}":`, now);
      } else {
        console.log(`No changes for "${name}"`);
      }

      return result;
    } catch (error) {
      console.error(`Task "${name}" failed`, error);
      throw error;
    }
  });
