import { RedisCache } from "@api/utils/redis-cache";
import { redis, slugify } from "@sgcarstrends/utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock redis
vi.mock("@sgcarstrends/utils", async () => {
  const actual = await vi.importActual("@sgcarstrends/utils");
  return {
    ...actual,
    redis: {
      hset: vi.fn(),
      hget: vi.fn(),
    },
  };
});

describe("RedisCache", () => {
  let redisCache: RedisCache;
  const fileName = "test-file.csv";
  const checksum = "abc123def456";

  beforeEach(() => {
    vi.resetAllMocks();

    // Default mock implementations
    vi.mocked(redis.hset).mockResolvedValue(1);
    vi.mocked(redis.hget).mockResolvedValue(checksum);

    redisCache = new RedisCache();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("cacheChecksum", () => {
    it("should store a checksum in Redis hash with slugified key", async () => {
      const result = await redisCache.cacheChecksum(fileName, checksum);
      const key = slugify(fileName);

      expect(redis.hset).toHaveBeenCalledWith("checksum", {
        [key]: checksum,
      });
      expect(result).toBe(1);
    });

    it("should handle Redis errors gracefully", async () => {
      // Setup the mock to throw an error
      vi.mocked(redis.hset).mockImplementation(() => {
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
    it("should retrieve a checksum from Redis hash with slugified key", async () => {
      const result = await redisCache.getCachedChecksum(fileName);
      const key = slugify(fileName);

      expect(redis.hget).toHaveBeenCalledWith("checksum", key);
      expect(result).toBe(checksum);
    });

    it("should return null when the checksum is not found", async () => {
      vi.mocked(redis.hget).mockResolvedValueOnce(null);

      const result = await redisCache.getCachedChecksum(fileName);

      expect(result).toBeNull();
    });

    it("should handle Redis errors gracefully", async () => {
      // Setup the mock to throw an error
      vi.mocked(redis.hget).mockImplementation(() => {
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
        hset: vi.fn().mockResolvedValue(1),
        hget: vi.fn().mockResolvedValue("custom-checksum"),
      };

      const customCache = new RedisCache(customRedis as any);
      const key = slugify(fileName);

      await customCache.cacheChecksum(fileName, checksum);
      await customCache.getCachedChecksum(fileName);

      expect(customRedis.hset).toHaveBeenCalledWith("checksum", {
        [key]: checksum,
      });
      expect(customRedis.hget).toHaveBeenCalledWith("checksum", key);

      // Default redis instance should not have been called
      expect(redis.hset).not.toHaveBeenCalled();
      expect(redis.hget).not.toHaveBeenCalled();
    });
  });
});
