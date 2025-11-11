"use server";

import { downloadLogo, getLogo, listLogos } from "@logos/services/logo";
import type { CarLogo } from "@logos/types";
import { redis } from "@sgcarstrends/utils";

/**
 * Get a single car logo by make
 * Automatically downloads logo from source if not found in cache
 * @param make - The car make (will be normalized automatically)
 * @returns Logo data or error if download fails
 */
export const getCarLogo = async (
  make: string,
): Promise<{ logo: CarLogo } | { error: string }> => {
  try {
    let logo = await getLogo(make);

    // Auto-download if not found
    if (!logo) {
      console.log(`[getCarLogo] Logo not found, downloading for make: ${make}`);
      const downloadResult = await downloadLogo(make);

      if (downloadResult.success && downloadResult.logo) {
        logo = downloadResult.logo;
        console.log(`[getCarLogo] Successfully downloaded logo for: ${make}`);

        // Clear list cache so the new logo appears in the makes list
        await redis.del("logos");
        console.log("[getCarLogo] Cleared logos list cache");
      } else {
        return {
          error: downloadResult.error || "Logo download failed",
        };
      }
    }

    return { logo };
  } catch (error) {
    console.error("[getCarLogo] Error fetching logo:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch logo",
    };
  }
};

/**
 * Get all available car logos
 * @returns Array of all logos or error
 */
export const getAllCarLogos = async (): Promise<
  { logos: CarLogo[] } | { error: string }
> => {
  try {
    const logos = await listLogos();

    return { logos };
  } catch (error) {
    console.error("[getAllCarLogos] Error fetching logos:", error);

    return {
      error: error instanceof Error ? error.message : "Failed to fetch logos",
    };
  }
};

/**
 * Create a make-to-URL map for quick logo lookups
 * @returns Map of makes to logo URLs
 */
export const getLogoUrlMap = async () => {
  try {
    const logos = await listLogos();
    return logos.reduce<Record<string, string>>((acc, logo) => {
      acc[logo.make] = logo.url;
      return acc;
    }, {});
  } catch (error) {
    console.error("[getLogoUrlMap] Error creating logo map:", error);
    return {};
  }
};
