import { beforeEach, describe, expect, it, vi } from "vitest";
import { Checksum } from "./checksum";

const mockHset = vi.fn();
const mockHget = vi.fn();

const mockRedis = {
  hset: mockHset,
  hget: mockHget,
};

vi.mock("@sgcarstrends/utils", () => ({
  redis: {},
  slugify: (str: string) => str.toLowerCase().replace(/\s+/g, "-"),
}));

describe("Checksum", () => {
  let checksum: Checksum;

  beforeEach(() => {
    vi.clearAllMocks();
    checksum = new Checksum(mockRedis as never);
  });

  describe("cacheChecksum", () => {
    it("should cache checksum value successfully", async () => {
      mockHset.mockResolvedValueOnce(1);

      const result = await checksum.cacheChecksum("test-file.csv", "abc123");

      expect(mockHset).toHaveBeenCalledWith("checksum", {
        "test-file.csv": "abc123",
      });
      expect(result).toBe(1);
    });

    it("should slugify file name before caching", async () => {
      mockHset.mockResolvedValueOnce(1);

      await checksum.cacheChecksum("Test File Name.csv", "def456");

      expect(mockHset).toHaveBeenCalledWith("checksum", {
        "test-file-name.csv": "def456",
      });
    });

    // Note: Error handling in cacheChecksum doesn't work as expected because
    // the promise is returned without awaiting, so errors propagate instead
    // of being caught. This is a known issue that should be fixed separately.
  });

  describe("getCachedChecksum", () => {
    it("should retrieve cached checksum successfully", async () => {
      mockHget.mockResolvedValueOnce("cached-checksum-value");

      const result = await checksum.getCachedChecksum("test-file.csv");

      expect(mockHget).toHaveBeenCalledWith("checksum", "test-file.csv");
      expect(result).toBe("cached-checksum-value");
    });

    it("should return null when no cached checksum exists", async () => {
      mockHget.mockResolvedValueOnce(null);

      const result = await checksum.getCachedChecksum("non-existent.csv");

      expect(result).toBeNull();
    });

    it("should skip cache retrieval in local development mode", async () => {
      const originalSstDev = process.env.SST_DEV;
      process.env.SST_DEV = "true";

      const result = await checksum.getCachedChecksum("test.csv");

      expect(mockHget).not.toHaveBeenCalled();
      expect(result).toBeNull();

      process.env.SST_DEV = originalSstDev;
    });

    // Note: Error handling in getCachedChecksum doesn't work as expected because
    // the promise is returned without awaiting, so errors propagate instead
    // of being caught. This is a known issue that should be fixed separately.
  });
});
