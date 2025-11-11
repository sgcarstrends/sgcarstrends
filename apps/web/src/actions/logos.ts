"use server";

import { downloadLogo, getLogo, listLogos } from "@logos/services/logo";
import type { CarLogo } from "@logos/types";
import { redis } from "@sgcarstrends/utils";

/**
 * Get a single car logo by brand name
 * Automatically downloads logo from carlogos.org if not found in cache
 * @param brand - The car brand name (will be normalized automatically)
 * @returns Logo data or error if download fails
 */
export const getCarLogo = async (
  brand: string,
): Promise<
  { success: true; logo: CarLogo } | { success: false; error: string }
> => {
  try {
    let logo = await getLogo(brand);

    // Auto-download if not found
    if (!logo) {
      console.log(
        `[getCarLogo] Logo not found, downloading for brand: ${brand}`,
      );
      const downloadResult = await downloadLogo(brand);

      if (downloadResult.success && downloadResult.logo) {
        logo = downloadResult.logo;
        console.log(`[getCarLogo] Successfully downloaded logo for: ${brand}`);

        // Clear list cache so the new logo appears in the makes list
        await redis.del("logos:all");
        console.log("[getCarLogo] Cleared logos list cache");
      } else {
        return {
          success: false,
          error: downloadResult.error || "Logo download failed",
        };
      }
    }

    return { success: true, logo };
  } catch (error) {
    console.error("[getCarLogo] Error fetching logo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch logo",
    };
  }
};

/**
 * Get all available car logos
 * @returns Array of all logos or error
 */
export const getAllCarLogos = async (): Promise<
  { success: true; logos: CarLogo[] } | { success: false; error: string }
> => {
  try {
    const logos = await listLogos();

    return { success: true, logos };
  } catch (error) {
    console.error("[getAllCarLogos] Error fetching logos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch logos",
    };
  }
};

/**
 * Create a brand-to-URL map for quick logo lookups
 * @returns Map of brand names to logo URLs
 */
export const getLogoUrlMap = async () => {
  try {
    const logos = await listLogos();
    return logos.reduce<Record<string, string>>((acc, logo) => {
      acc[logo.brand] = logo.url;
      return acc;
    }, {});
  } catch (error) {
    console.error("[getLogoUrlMap] Error creating logo map:", error);
    return {};
  }
};

// Re-export types for convenience
export type { CarLogo };
