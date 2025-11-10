import { PATH_PREFIX, R2_PUBLIC_DOMAIN } from "@/config";
import { listAllLogos } from "@/infra/storage/kv.service";
import type { CarLogo } from "@/types";
import { logError, logInfo } from "@/utils/logger";

export const listLogos = async (
  bucket: R2Bucket,
  kv: KVNamespace,
): Promise<Array<CarLogo & { url: string }>> => {
  const startTime = Date.now();

  try {
    logInfo("Listing logos from KV metadata", {});

    // First try to get logos from KV
    const logos = await listAllLogos(kv);

    if (logos.length > 0) {
      const kvDuration = Date.now() - startTime;
      logInfo("Found logos in KV metadata", {
        count: logos.length,
        duration: kvDuration,
      });
      return logos;
    }

    // Fallback to R2 bucket listing if KV is empty
    logInfo("No logos in KV, falling back to R2 bucket listing", {});

    const { objects } = await bucket.list({ prefix: PATH_PREFIX });

    const filteredObjects = objects.filter(({ key }) =>
      key.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i),
    );

    logInfo("Filtered logo files from R2", {
      total: objects.length,
      filtered: filteredObjects.length,
    });

    const r2Logos = filteredObjects.map(({ key }) => {
      const brand = key.replace(`${PATH_PREFIX}/`, "").replace(/\.[^.]+$/, "");

      return {
        brand,
        filename: key.replace(`${PATH_PREFIX}/`, ""),
        url: `${R2_PUBLIC_DOMAIN}/${key}`,
      };
    });

    const totalDuration = Date.now() - startTime;
    logInfo("Retrieved logos from R2 fallback", {
      count: r2Logos.length,
      duration: totalDuration,
    });

    return r2Logos;
  } catch (error) {
    const duration = Date.now() - startTime;
    logError("Failed to list logos", error, { duration });
    return [];
  }
};
