import { redis, slugify } from "@sgcarstrends/utils";
import { Checksum } from "@web/utils/checksum";
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

describe("Checksum", () => {
  let checksum: Checksum;
  const fileName = "test-file.csv";
  const mockChecksum = "abc123def456";

  beforeEach(() => {
    vi.resetAllMocks();

    // Default mock implementations
    vi.mocked(redis.hset).mockResolvedValue(1);
    vi.mocked(redis.hget).mockResolvedValue(mockChecksum);

    checksum = new Checksum();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("cacheChecksum", () => {
    it("should store a checksum in Redis hash with slugified key", async () => {
      const result = await checksum.cacheChecksum(fileName, mockChecksum);
      const key = slugify(fileName);

      expect(redis.hset).toHaveBeenCalledWith("checksum", {
        [key]: mockChecksum,
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

      const result = await checksum.cacheChecksum(fileName, mockChecksum);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe("getCachedChecksum", () => {
    it("should retrieve a checksum from Redis hash with slugified key", async () => {
      const result = await checksum.getCachedChecksum(fileName);
      const key = slugify(fileName);

      expect(redis.hget).toHaveBeenCalledWith("checksum", key);
      expect(result).toBe(mockChecksum);
    });

    it("should return null when the checksum is not found", async () => {
      vi.mocked(redis.hget).mockResolvedValueOnce(null);

      const result = await checksum.getCachedChecksum(fileName);

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

      const result = await checksum.getCachedChecksum(fileName);

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

      const customCache = new Checksum(customRedis as any);
      const key = slugify(fileName);

      await customCache.cacheChecksum(fileName, mockChecksum);
      await customCache.getCachedChecksum(fileName);

      expect(customRedis.hset).toHaveBeenCalledWith("checksum", {
        [key]: mockChecksum,
      });
      expect(customRedis.hget).toHaveBeenCalledWith("checksum", key);

      // Default redis instance should not have been called
      expect(redis.hset).not.toHaveBeenCalled();
      expect(redis.hget).not.toHaveBeenCalled();
    });
  });
});
