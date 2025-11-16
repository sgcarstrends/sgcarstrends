import { redis, slugify } from "@sgcarstrends/utils";
import type { Redis } from "@upstash/redis";

export class Checksum {
  private redis: Redis;

  constructor(redisInstance: Redis = redis) {
    this.redis = redisInstance;
  }

  /**
   * Caches a checksum value for a given file name
   *
   * @param fileName Name of the file to cache checksum for
   * @param checksum The checksum value to cache
   * @returns Promise resolving to the number of fields added (0 or 1) or null if failed
   */
  async cacheChecksum(fileName: string, checksum: string) {
    try {
      const key = slugify(fileName);
      return this.redis.hset("checksum", { [key]: checksum });
    } catch (error) {
      console.error(`Error caching checksum: ${error}`);
      return null;
    }
  }

  /**
   * Retrieves a cached checksum value for a given file name
   *
   * @param fileName Name of the file to get checksum for
   * @returns Promise resolving to the cached checksum string or null if not found/error
   */
  async getCachedChecksum(fileName: string) {
    // Skip cache retrieval in local development mode
    if (process.env.SST_DEV) {
      return null;
    }

    try {
      const key = slugify(fileName);
      return this.redis.hget<string>("checksum", key);
    } catch (error) {
      console.error(`Error retrieving cached checksum: ${error}`);
      return null;
    }
  }
}
