import * as blobStorage from "@logos/infra/storage/blob.service";
import { logInfo } from "@logos/utils/logger";
import { normaliseBrandName } from "@logos/utils/normalisation";

/**
 * Get a logo by brand name
 * Uses Vercel Blob storage with Redis caching
 */
export const getLogo = async (brand: string) => {
  const startTime = Date.now();
  const normalisedBrand = normaliseBrandName(brand);

  logInfo("Looking up logo", {
    brand,
    normalised: normalisedBrand,
  });

  // Use blob service which handles Redis cache internally
  const logo = await blobStorage.getLogo(brand);

  const duration = Date.now() - startTime;

  if (logo) {
    logInfo("Found logo", {
      brand: normalisedBrand,
      filename: logo.filename,
      duration,
    });
  } else {
    logInfo("No logo found", {
      brand: normalisedBrand,
      duration,
    });
  }

  return logo;
};
