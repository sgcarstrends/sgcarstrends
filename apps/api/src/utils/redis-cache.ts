import redis from "@api/config/redis";
import type { Redis } from "@upstash/redis";

export class RedisCache {
  private redis: Redis;

  constructor(redisInstance: Redis = redis) {
    this.redis = redisInstance;
  }

  /**
   * Caches a checksum value for a given file name
   *
   * @param fileName Name of the file to cache checksum for
   * @param checksum The checksum value to cache
   * @returns Promise resolving to true if successful, null if failed
   */
  async cacheChecksum(fileName: string, checksum: string) {
    try {
      return this.redis.set(`checksum:${fileName}`, checksum);
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
      return this.redis.get<string>(`checksum:${fileName}`);
    } catch (error) {
      console.error(`Error retrieving cached checksum: ${error}`);
      return null;
    }
  }
}
