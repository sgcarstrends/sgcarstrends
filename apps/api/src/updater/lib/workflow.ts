import redis from "@api/updater/config/redis";
import type { UpdaterResult } from "@api/updater/lib/updater";
import type {
  Platform,
  PostToSocialMediaParam,
} from "@api/updater/types/social-media";
import type { WorkflowContext } from "@upstash/workflow";

export interface Task {
  name: string;
  handler: () => Promise<UpdaterResult>;
}

export interface IPlatform {
  platform: Platform;
  handler: ({ message, link }: PostToSocialMediaParam) => Promise<unknown>;
  enabled: boolean;
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

/**
 * Publish updates to a social media platform
 */
export const publishToPlatform = async (
  context: WorkflowContext,
  platform: IPlatform,
  options: { message: string; link: string },
): Promise<unknown | false> => {
  if (!platform.enabled) {
    return false;
  }

  return context.run(`Publish to ${platform.platform}`, async () => {
    console.log(`Publishing to ${platform.platform}`);

    const result = await platform.handler(options);

    console.log(`[${platform.platform}]`, result);

    return result;
  });
};
