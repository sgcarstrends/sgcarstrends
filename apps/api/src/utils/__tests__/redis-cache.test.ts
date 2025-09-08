import redis from "@api/config/redis";
import { RedisCache } from "@api/utils/redis-cache";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock redis
vi.mock("@api/config/redis", () => ({
  default: {
    set: vi.fn().mockResolvedValue(true),
    get: vi.fn().mockResolvedValue("abc123def456"),
  },
}));

describe("RedisCache", () => {
  let redisCache: RedisCache;
  const fileName = "test-file.csv";
  const checksum = "abc123def456";

  beforeEach(() => {
    vi.resetAllMocks();

    // Default mock implementations
    vi.mocked(redis.set).mockResolvedValue(true);
    vi.mocked(redis.get).mockResolvedValue(checksum);

    redisCache = new RedisCache();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("cacheChecksum", () => {
    it("should store a checksum in Redis", async () => {
      const result = await redisCache.cacheChecksum(fileName, checksum);

      expect(redis.set).toHaveBeenCalledWith(`checksum:${fileName}`, checksum);
      expect(result).toBe(true);
    });

    it("should handle Redis errors gracefully", async () => {
      // Setup the mock to throw an error
      vi.mocked(redis.set).mockImplementation(() => {
        throw new Error("Redis connection error");
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await redisCache.cacheChecksum(fileName, checksum);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe("getCachedChecksum", () => {
    it("should retrieve a checksum from Redis", async () => {
      const result = await redisCache.getCachedChecksum(fileName);

      expect(redis.get).toHaveBeenCalledWith(`checksum:${fileName}`);
      expect(result).toBe(checksum);
    });

    it("should return null when the checksum is not found", async () => {
      vi.mocked(redis.get).mockResolvedValueOnce(null);

      const result = await redisCache.getCachedChecksum(fileName);

      expect(result).toBeNull();
    });

    it("should handle Redis errors gracefully", async () => {
      // Setup the mock to throw an error
      vi.mocked(redis.get).mockImplementation(() => {
        throw new Error("Redis connection error");
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await redisCache.getCachedChecksum(fileName);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe("custom Redis instance", () => {
    it("should use custom Redis instance when provided", async () => {
      const customRedis = {
        set: vi.fn().mockResolvedValue("OK"),
        get: vi.fn().mockResolvedValue("custom-checksum"),
      };

      const customCache = new RedisCache(customRedis as any);

      await customCache.cacheChecksum(fileName, checksum);
      await customCache.getCachedChecksum(fileName);

      expect(customRedis.set).toHaveBeenCalledWith(
        `checksum:${fileName}`,
        checksum,
      );
      expect(customRedis.get).toHaveBeenCalledWith(`checksum:${fileName}`);

      // Default redis instance should not have been called
      expect(redis.set).not.toHaveBeenCalled();
      expect(redis.get).not.toHaveBeenCalled();
    });
  });
});
