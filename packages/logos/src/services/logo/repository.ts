import * as blobStorage from "@logos/infra/storage/blob.service";
import type { CarLogo } from "@logos/types";
import { logError, logInfo } from "@logos/utils/logger";

/**
 * List all logos from Vercel Blob storage
 * Uses Redis caching for performance
 */
export const listLogos = async (): Promise<CarLogo[]> => {
  const startTime = Date.now();

  try {
    logInfo("Listing logos from Vercel Blob", {});

    // Use blob service which handles Redis cache internally
    const logos = await blobStorage.listLogos();

    const duration = Date.now() - startTime;
    logInfo("Retrieved logos", {
      count: logos.length,
      duration,
    });

    return logos;
  } catch (error) {
    const duration = Date.now() - startTime;
    logError("Failed to list logos", error, { duration });
    return [];
  }
};
