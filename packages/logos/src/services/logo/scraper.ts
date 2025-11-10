import { BASE_URL } from "@logos/config";
import * as blobStorage from "@logos/infra/storage/blob.service";
import { getLogo } from "@logos/services/logo/service";
import type { CarLogo } from "@logos/types";
import { extractFileExtension, getContentType } from "@logos/utils/file-utils";
import { logError, logInfo } from "@logos/utils/logger";
import { normaliseBrandName } from "@logos/utils/normalisation";

export interface ScrapeResult {
  success: boolean;
  logo?: CarLogo;
  error?: string;
}

/**
 * Download a logo from external source and store in Vercel Blob
 * Uses Redis caching for metadata
 */
export const downloadLogo = async (brand: string): Promise<ScrapeResult> => {
  const overallStartTime = Date.now();

  try {
    const normalisedBrand = normaliseBrandName(brand);
    logInfo("Starting logo download process", {
      brand,
      normalised: normalisedBrand,
    });

    // Check if already exists
    const existingCheckStart = Date.now();
    const existing = await getLogo(brand);
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

    // Download and validate image
    logInfo("Downloading logo image", {
      brand: normalisedBrand,
      url: logoUrl,
    });
    const downloadStart = Date.now();

    const arrayBuffer = await response.arrayBuffer();

    if (arrayBuffer.byteLength < 100) {
      logError(
        "Downloaded image too small",
        new Error("Image likely corrupted"),
        {
          brand: normalisedBrand,
          bytes: arrayBuffer.byteLength,
        },
      );
      return {
        success: false,
        error: "Downloaded image is too small, likely corrupted",
      };
    }

    const downloadDuration = Date.now() - downloadStart;
    logInfo("Successfully downloaded logo image", {
      brand: normalisedBrand,
      bytes: arrayBuffer.byteLength,
      duration: downloadDuration,
    });

    // Determine content type
    const extension = extractFileExtension(logoUrl);
    const contentType = getContentType(`${normalisedBrand}.${extension}`);

    logInfo("Uploading logo to Vercel Blob", {
      brand: normalisedBrand,
      contentType,
    });

    // Upload to Vercel Blob (also caches in Redis)
    const uploadStart = Date.now();
    const result = await blobStorage.uploadLogo(
      brand,
      arrayBuffer,
      contentType,
    );

    if (!result) {
      logError(
        "Failed to upload logo to Vercel Blob",
        new Error("Upload failed"),
        {
          brand: normalisedBrand,
        },
      );
      return {
        success: false,
        error: "Failed to upload logo to storage",
      };
    }

    const uploadDuration = Date.now() - uploadStart;
    const totalDuration = Date.now() - overallStartTime;

    logInfo("Logo download and upload completed", {
      brand: normalisedBrand,
      url: result.url,
      uploadDuration,
      totalDuration,
    });

    return {
      success: true,
      logo: {
        brand: normalisedBrand,
        filename: result.filename,
        url: result.url,
      },
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
