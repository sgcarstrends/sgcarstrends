import { PATH_PREFIX, R2_PUBLIC_DOMAIN } from "@/config";
import {
  getLogoMetadata,
  removeLogoFromList,
  removeLogoMetadata,
} from "@/infra/storage/kv.service";
import type { CarLogo } from "@/types";
import { logInfo } from "@/utils/logger";
import { normaliseBrandName } from "@/utils/normalisation";

export const getLogo = async (
  bucket: R2Bucket,
  kv: KVNamespace,
  brand: string,
): Promise<(CarLogo & { url: string }) | null> => {
  const startTime = Date.now();
  const normalisedBrand = normaliseBrandName(brand);

  logInfo("Looking up logo", {
    brand,
    normalised: normalisedBrand,
  });

  // First check KV metadata
  const metadata = await getLogoMetadata(kv, brand);

  if (metadata) {
    const kvDuration = Date.now() - startTime;
    logInfo("Found logo metadata in KV, verifying R2 file exists", {
      brand: normalisedBrand,
      filename: metadata.filename,
      duration: kvDuration,
    });

    // Verify the file actually exists in R2
    const fullPath = `${PATH_PREFIX}/${metadata.filename}`;
    const r2Object = await bucket.get(fullPath);

    if (r2Object) {
      const totalDuration = Date.now() - startTime;
      logInfo("Verified logo exists in both KV and R2", {
        brand: normalisedBrand,
        filename: metadata.filename,
        duration: totalDuration,
      });

      return {
        brand: metadata.brand,
        filename: metadata.filename,
        url: metadata.url,
      };
    }

    // R2 file missing but KV metadata exists - stale cache
    logInfo("Found stale KV metadata, R2 file missing - cleaning up", {
      brand: normalisedBrand,
      filename: metadata.filename,
      kvDuration,
    });

    // Clean up stale KV metadata
    await Promise.all([
      removeLogoMetadata(kv, brand),
      removeLogoFromList(kv, brand),
    ]);

    logInfo("Cleaned up stale KV metadata, will proceed to R2 fallback", {
      brand: normalisedBrand,
    });
  }

  // Fallback to R2 bucket scan if not in KV
  logInfo("No KV metadata found, checking R2 bucket directly", {
    brand: normalisedBrand,
  });

  const possibleExtensions = ["png", "jpg", "jpeg", "gif", "svg", "webp"];

  logInfo("Checking file extensions", {
    brand: normalisedBrand,
    extensions: possibleExtensions.length,
  });

  for (const ext of possibleExtensions) {
    const filename = `${normalisedBrand}.${ext}`;
    const fullPath = `${PATH_PREFIX}/${filename}`;

    const object = await bucket.get(fullPath);

    if (object) {
      const duration = Date.now() - startTime;
      logInfo("Found existing logo in R2 (missing KV metadata)", {
        brand: normalisedBrand,
        filename,
        duration,
      });

      return {
        brand: normalisedBrand,
        filename,
        url: `${R2_PUBLIC_DOMAIN}/${fullPath}`,
      };
    }
  }

  const duration = Date.now() - startTime;
  logInfo("No existing logo found", {
    brand: normalisedBrand,
    extensionsChecked: possibleExtensions.length,
    duration,
  });
  return null;
};
