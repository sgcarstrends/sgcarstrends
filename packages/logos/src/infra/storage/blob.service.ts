import type { CarLogo } from "@logos/types";
import { getFileExtension } from "@logos/utils/file-utils";
import { logError, logInfo } from "@logos/utils/logger";
import { normaliseMake } from "@logos/utils/normalise-make";
import { redis } from "@sgcarstrends/utils";
import { del, list, put } from "@vercel/blob";

const REDIS_TTL = 86400; // 24 hours in seconds
const BLOB_PREFIX = "logos/";

/**
 * Upload a logo to Vercel Blob storage
 */
export const uploadLogo = async (
  make: string,
  buffer: ArrayBuffer,
  contentType: string,
): Promise<{ url: string; filename: string } | null> => {
  const start = Date.now();
  const normalisedMake = normaliseMake(make);
  const extension = getFileExtension(contentType);
  const filename = `${normalisedMake}.${extension}`;
  const pathname = `${BLOB_PREFIX}${filename}`;

  try {
    logInfo("Uploading logo to Vercel Blob", {
      make: normalisedMake,
      filename,
      contentType,
      size: buffer.byteLength,
    });

    const blob = await put(pathname, buffer, {
      access: "public",
      contentType,
      cacheControlMaxAge: 31536000, // 1 year
    });

    const duration = Date.now() - start;
    logInfo("Successfully uploaded logo to Vercel Blob", {
      make: normalisedMake,
      url: blob.url,
      duration,
    });

    // Cache metadata in Redis
    const metadata = {
      make: normalisedMake,
      filename,
      url: blob.url,
      createdAt: new Date().toISOString(),
      fileSize: buffer.byteLength,
    };

    await redis.set(`logo:${normalisedMake}`, JSON.stringify(metadata), {
      ex: REDIS_TTL,
    });

    return { url: blob.url, filename };
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to upload logo to Vercel Blob", error, {
      make: normalisedMake,
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
    const cachedLogos = await redis.get<CarLogo[]>("logos:all");
    if (cachedLogos) {
      const duration = Date.now() - start;
      logInfo("Found logos list in Redis cache", {
        count: cachedLogos.length,
        duration,
      });

      return cachedLogos;
    }

    logInfo("Fetching all logos from Vercel Blob", {
      prefix: BLOB_PREFIX,
    });

    const { blobs } = await list({ prefix: BLOB_PREFIX });

    const logos: CarLogo[] = blobs.map((blob) => {
      const filename = blob.pathname.replace(BLOB_PREFIX, "");
      const make = filename.replace(/\.[^/.]+$/, ""); // Remove extension

      return {
        make,
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
 * Get a specific logo by make
 * Uses Redis cache for fast lookups, falls back to Blob list API
 */
export const getLogo = async (make: string) => {
  const start = Date.now();
  make = normaliseMake(make);

  try {
    // Try Redis cache first
    const cached = await redis.get<CarLogo>(`logo:${make}`);
    if (cached) {
      const duration = Date.now() - start;
      logInfo("Found logo metadata in Redis cache", {
        make,
        duration,
      });

      return {
        make: cached.make,
        filename: cached.filename,
        url: cached.url,
      };
    }

    logInfo("Fetching logo from Vercel Blob", {
      make,
    });

    // Search for logo with any extension
    const { blobs } = await list({
      prefix: `${BLOB_PREFIX}${make}`,
      limit: 1,
    });

    if (blobs.length === 0) {
      const duration = Date.now() - start;
      logInfo("Logo not found in Vercel Blob", {
        make,
        duration,
      });
      return null;
    }

    const blob = blobs[0];
    if (blob) {
      const filename = blob.pathname.replace(BLOB_PREFIX, "");

      const logo: CarLogo = {
        make,
        filename,
        url: blob.url,
      };

      const duration = Date.now() - start;
      logInfo("Found logo in Vercel Blob", {
        make,
        url: blob.url,
        duration,
      });

      // Cache in Redis
      const metadata = {
        make,
        filename,
        url: blob.url,
        createdAt: new Date().toISOString(),
        fileSize: blob.size,
      };

      await redis.set(`logo:${make}`, JSON.stringify(metadata), {
        ex: REDIS_TTL,
      });

      return logo;
    }
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to get logo from Vercel Blob", error, {
      make,
      duration,
    });

    return null;
  }
};

/**
 * Delete a logo from Vercel Blob storage and clear Redis cache
 */
export const deleteLogo = async (make: string): Promise<boolean> => {
  const start = Date.now();
  const normalisedMake = normaliseMake(make);

  try {
    // Find the logo first to get the exact URL
    const logo = await getLogo(normalisedMake);
    if (!logo) {
      logInfo("Logo not found, nothing to delete", {
        make: normalisedMake,
      });
      return true;
    }

    logInfo("Deleting logo from Vercel Blob", {
      make: normalisedMake,
      url: logo.url,
    });

    await del(logo.url);

    // Clear Redis caches
    await redis.del(`logo:${normalisedMake}`);
    await redis.del("logos:all");

    const duration = Date.now() - start;
    logInfo("Successfully deleted logo", {
      make: normalisedMake,
      duration,
    });

    return true;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to delete logo from Vercel Blob", error, {
      make: normalisedMake,
      duration,
    });

    return false;
  }
};
