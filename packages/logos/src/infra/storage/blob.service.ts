import type { CarLogo } from "@logos/types";
import { getFileExtension } from "@logos/utils/file-utils";
import { logError, logInfo } from "@logos/utils/logger";
import { normaliseBrandName } from "@logos/utils/normalise-brand-name.ts";
import { redis } from "@sgcarstrends/utils";
import { del, list, put } from "@vercel/blob";

const REDIS_TTL = 86400; // 24 hours in seconds
const BLOB_PREFIX = "logos/";

/**
 * Upload a logo to Vercel Blob storage
 */
export const uploadLogo = async (
  brand: string,
  buffer: ArrayBuffer,
  contentType: string,
): Promise<{ url: string; filename: string } | null> => {
  const start = Date.now();
  const normalisedBrand = normaliseBrandName(brand);
  const extension = getFileExtension(contentType);
  const filename = `${normalisedBrand}.${extension}`;
  const pathname = `${BLOB_PREFIX}${filename}`;

  try {
    logInfo("Uploading logo to Vercel Blob", {
      brand: normalisedBrand,
      filename,
      contentType,
      size: buffer.byteLength,
    });

    const blob = await put(pathname, buffer, {
      access: "public",
      contentType,
      cacheControlMaxAge: 31536000, // 1 year
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const duration = Date.now() - start;
    logInfo("Successfully uploaded logo to Vercel Blob", {
      brand: normalisedBrand,
      url: blob.url,
      duration,
    });

    // Cache metadata in Redis
    const metadata: LogoMetadata = {
      brand: normalisedBrand,
      filename,
      url: blob.url,
      createdAt: new Date().toISOString(),
      fileSize: buffer.byteLength,
    };

    await redis.set(`logo:${normalisedBrand}`, JSON.stringify(metadata), {
      ex: REDIS_TTL,
    });

    return { url: blob.url, filename };
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to upload logo to Vercel Blob", error, {
      brand: normalisedBrand,
      filename,
      duration,
    });
    return null;
  }
};

/**
 * List all logos from Vercel Blob storage
 * Optionally caches the list in Redis for performance
 */
export const listLogos = async (): Promise<CarLogo[]> => {
  const start = Date.now();

  try {
    // Try Redis cache first
    const cached = await redis.get<CarLogo[]>("logos:all");
    if (cached) {
      const duration = Date.now() - start;
      logInfo("Found logos list in Redis cache", {
        count: cached.length,
        duration,
      });
      return cached;
    }

    logInfo("Fetching all logos from Vercel Blob", {
      prefix: BLOB_PREFIX,
    });

    const { blobs } = await list({
      prefix: BLOB_PREFIX,
      limit: 1000,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const logos: CarLogo[] = blobs.map((blob) => {
      const filename = blob.pathname.replace(BLOB_PREFIX, "");
      const brand = filename.replace(/\.[^/.]+$/, ""); // Remove extension

      return {
        brand,
        filename,
        url: blob.url,
      };
    });

    const duration = Date.now() - start;
    logInfo("Successfully fetched logos from Vercel Blob", {
      count: logos.length,
      duration,
    });

    // Cache in Redis for 1 hour
    await redis.set("logos:all", JSON.stringify(logos), { ex: 3600 });

    return logos;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to list logos from Vercel Blob", error, {
      duration,
    });
    return [];
  }
};

/**
 * Get a specific logo by brand name
 * Uses Redis cache for fast lookups, falls back to Blob list API
 */
export const getLogo = async (brand: string) => {
  const start = Date.now();
  const normalisedBrand = normaliseBrandName(brand);

  try {
    // Try Redis cache first
    const cached = await redis.get<LogoMetadata>(`logo:${normalisedBrand}`);
    if (cached) {
      const duration = Date.now() - start;
      logInfo("Found logo metadata in Redis cache", {
        brand: normalisedBrand,
        duration,
      });

      return {
        brand: cached.brand,
        filename: cached.filename,
        url: cached.url,
      };
    }

    logInfo("Fetching logo from Vercel Blob", {
      brand: normalisedBrand,
    });

    // Search for logo with any extension
    const { blobs } = await list({
      prefix: `${BLOB_PREFIX}${normalisedBrand}`,
      limit: 1,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (blobs.length === 0) {
      const duration = Date.now() - start;
      logInfo("Logo not found in Vercel Blob", {
        brand: normalisedBrand,
        duration,
      });
      return null;
    }

    const blob = blobs[0];
    if (blob) {
      const filename = blob.pathname.replace(BLOB_PREFIX, "");

      const logo: CarLogo = {
        brand: normalisedBrand,
        filename,
        url: blob.url,
      };

      const duration = Date.now() - start;
      logInfo("Found logo in Vercel Blob", {
        brand: normalisedBrand,
        url: blob.url,
        duration,
      });

      // Cache in Redis
      const metadata: LogoMetadata = {
        brand: normalisedBrand,
        filename,
        url: blob.url,
        createdAt: new Date().toISOString(),
        fileSize: blob.size,
      };

      await redis.set(`logo:${normalisedBrand}`, JSON.stringify(metadata), {
        ex: REDIS_TTL,
      });

      return logo;
    }
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to get logo from Vercel Blob", error, {
      brand: normalisedBrand,
      duration,
    });
    return null;
  }
};

/**
 * Delete a logo from Vercel Blob storage and clear Redis cache
 */
export const deleteLogo = async (brand: string): Promise<boolean> => {
  const start = Date.now();
  const normalisedBrand = normaliseBrandName(brand);

  try {
    // Find the logo first to get the exact URL
    const logo = await getLogo(normalisedBrand);
    if (!logo) {
      logInfo("Logo not found, nothing to delete", {
        brand: normalisedBrand,
      });
      return true;
    }

    logInfo("Deleting logo from Vercel Blob", {
      brand: normalisedBrand,
      url: logo.url,
    });

    await del(logo.url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Clear Redis caches
    await redis.del(`logo:${normalisedBrand}`);
    await redis.del("logos:all");

    const duration = Date.now() - start;
    logInfo("Successfully deleted logo", {
      brand: normalisedBrand,
      duration,
    });

    return true;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to delete logo from Vercel Blob", error, {
      brand: normalisedBrand,
      duration,
    });
    return false;
  }
};
