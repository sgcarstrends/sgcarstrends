import * as blobStorage from "@logos/infra/storage/blob.service";
import { logInfo } from "@logos/utils/logger";
import { normaliseMake } from "@logos/utils/normalise-make.ts";

/**
 * Get a logo by make
 * Uses Vercel Blob storage with Redis caching
 */
export const getLogo = async (make: string) => {
  const startTime = Date.now();
  const normalisedMake = normaliseMake(make);

  logInfo("Looking up logo", {
    make,
    normalised: normalisedMake,
  });

  // Use blob service which handles Redis cache internally
  const logo = await blobStorage.getLogo(make);

  const duration = Date.now() - startTime;

  if (logo) {
    logInfo("Found logo", {
      make: normalisedMake,
      filename: logo.filename,
      duration,
    });
  } else {
    logInfo("No logo found", {
      make: normalisedMake,
      duration,
    });
  }

  return logo;
};
