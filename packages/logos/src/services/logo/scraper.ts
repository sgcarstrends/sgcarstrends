import { BASE_URL, PATH_PREFIX, R2_PUBLIC_DOMAIN } from "@/config";
import { addLogoToList, setLogoMetadata } from "@/infra/storage/kv.service";
import { getLogo } from "@/services/logo/service";
import type { CarLogo, LogoMetadata } from "@/types";
import { extractFileExtension, getContentType } from "@/utils/file-utils";
import { logError, logInfo } from "@/utils/logger";
import { normaliseBrandName } from "@/utils/normalisation";

export interface ScrapeResult {
  success: boolean;
  logo?: CarLogo & { url: string };
  error?: string;
}

export const downloadLogo = async (
  bucket: R2Bucket,
  kv: KVNamespace,
  brand: string,
): Promise<ScrapeResult> => {
  const overallStartTime = Date.now();

  try {
    const normalisedBrand = normaliseBrandName(brand);
    logInfo("Starting logo download process", {
      brand,
      normalised: normalisedBrand,
    });

    // Check if already exists
    const existingCheckStart = Date.now();
    const existing = await getLogo(bucket, kv, brand);
    const existingCheckDuration = Date.now() - existingCheckStart;

    if (existing) {
      logInfo("Logo already exists, returning cached version", {
        brand: normalisedBrand,
        duration: existingCheckDuration,
      });
      return {
        success: true,
        logo: existing,
      };
    }

    logInfo("No existing logo found, proceeding with download", {
      brand: normalisedBrand,
      duration: existingCheckDuration,
    });

    // Download logo using direct URL pattern
    let logoData: CarLogo | null = null;
    try {
      const logoUrl = `${BASE_URL}/${normalisedBrand}-logo.png`;

      logInfo("Attempting direct logo download", {
        brand: normalisedBrand,
        url: logoUrl,
      });
      const checkStart = Date.now();

      const response = await fetch(logoUrl);
      if (!response.ok) {
        const checkDuration = Date.now() - checkStart;
        logError(
          "Failed to fetch logo directly",
          new Error(`HTTP ${response.status}`),
          {
            brand: normalisedBrand,
            status: response.status,
            duration: checkDuration,
          },
        );
        return {
          success: false,
          error: `Failed to fetch logo: ${response.status}`,
        };
      }

      const checkDuration = Date.now() - checkStart;
      logInfo("Successfully found logo at direct URL", {
        brand: normalisedBrand,
        duration: checkDuration,
      });

      const extension = extractFileExtension(logoUrl);
      const filename = `${normalisedBrand}.${extension}`;

      logoData = {
        brand: normalisedBrand,
        url: logoUrl,
        filename,
      };

      logInfo("Using direct logo URL", {
        brand: normalisedBrand,
        url: logoUrl,
        extension,
      });
    } catch (error) {
      logError("Error downloading logo", error, {
        brand: normalisedBrand,
      });
    }

    if (!logoData) {
      const totalDuration = Date.now() - overallStartTime;
      logError("Logo scraping failed", new Error("Logo not found on website"), {
        brand: normalisedBrand,
        duration: totalDuration,
      });
      return {
        success: false,
        error: "Logo not found on website",
      };
    }

    // Download and store in R2
    logInfo("Downloading logo image", {
      brand: normalisedBrand,
      url: logoData.url,
    });
    const downloadStart = Date.now();

    const response = await fetch(logoData.url);
    if (!response.ok) {
      const downloadDuration = Date.now() - downloadStart;
      logError(
        "Failed to download logo image",
        new Error(`HTTP ${response.status}`),
        {
          brand: normalisedBrand,
          status: response.status,
          duration: downloadDuration,
        },
      );
      return {
        success: false,
        error: "Failed to download logo",
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    if (buffer.length < 100) {
      logError(
        "Downloaded image too small",
        new Error("Image likely corrupted"),
        {
          brand: normalisedBrand,
          bytes: buffer.length,
        },
      );
      return {
        success: false,
        error: "Downloaded image is too small, likely corrupted",
      };
    }

    // Store in R2 with aggressive caching
    const fullPath = `${PATH_PREFIX}/${logoData.filename}`;
    const contentType = getContentType(logoData.filename);

    logInfo("Storing logo in R2", {
      brand: normalisedBrand,
      path: fullPath,
      contentType,
    });

    await bucket.put(fullPath, buffer, {
      httpMetadata: {
        contentType,
      },
    });

    const absoluteUrl = `${R2_PUBLIC_DOMAIN}/${fullPath}`;

    // Store metadata in KV
    const metadata: LogoMetadata = {
      brand: normalisedBrand,
      filename: logoData.filename,
      url: absoluteUrl,
      createdAt: new Date().toISOString(),
      fileSize: buffer.length,
    };

    logInfo("Storing logo metadata in KV", {
      brand: normalisedBrand,
      filename: logoData.filename,
      url: absoluteUrl,
    });

    const kvStoreStart = Date.now();
    await setLogoMetadata(kv, brand, metadata);
    const kvStoreDuration = Date.now() - kvStoreStart;

    // Add to logos list
    const logoForList = {
      brand: normalisedBrand,
      filename: logoData.filename,
      url: absoluteUrl,
    };

    await addLogoToList(kv, logoForList);

    logInfo("Logo download and metadata storage completed", {
      brand: normalisedBrand,
      kvStoreDuration,
      totalDuration: Date.now() - overallStartTime,
    });

    return {
      success: true,
      logo: logoForList,
    };
  } catch (error) {
    const totalDuration = Date.now() - overallStartTime;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logError("Logo download failed", error, {
      brand,
      duration: totalDuration,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
};
