import { beforeEach, describe, expect, it, vi } from "vitest";
import { downloadLogo, getLogo, listLogos } from "@/services/logo";

// Mock config
vi.mock("@/config", () => ({
  BASE_URL: "https://www.carlogos.org/car-logos",
  R2_PUBLIC_DOMAIN: "https://assets.sgcarstrends.com",
  PATH_PREFIX: "logos",
}));

// Mock utils
vi.mock("@/utils", () => ({
  normaliseBrandName: vi.fn(
    (name: string) => name?.toLowerCase().replace(/\s+/g, "-") || "",
  ),
}));

// Mock logger
vi.mock("@/utils/logger", () => ({
  logInfo: vi.fn(),
  logError: vi.fn(),
}));

// Mock KV metadata service
vi.mock("@/infra/storage/kv.service", () => ({
  listAllLogos: vi.fn(),
  getLogoMetadata: vi.fn(),
  setLogoMetadata: vi.fn(),
  addLogoToList: vi.fn(),
  removeLogoMetadata: vi.fn(),
  removeLogoFromList: vi.fn(),
}));

describe("Download Service", () => {
  let mockBucket: R2Bucket;
  let mockKV: KVNamespace;

  beforeEach(() => {
    vi.clearAllMocks();
    mockBucket = {
      list: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
    } as unknown as R2Bucket;

    mockKV = {
      get: vi.fn(),
      put: vi.fn(),
    } as unknown as KVNamespace;
  });

  describe("listLogos", () => {
    it("should list logos from bucket", async () => {
      const { listAllLogos } = await import("@/infra/storage/kv.service");

      // Mock KV returning empty list, so it falls back to R2
      vi.mocked(listAllLogos).mockResolvedValue([]);

      const mockObjects = {
        objects: [
          { key: "logos/bmw.png" },
          { key: "logos/audi.jpg" },
          { key: "manifest.json" },
          { key: "readme.txt" },
        ],
        delimitedPrefixes: [],
        truncated: false,
      } as unknown as R2Objects;

      vi.mocked(mockBucket.list).mockResolvedValue(mockObjects);

      const result = await listLogos(mockBucket, mockKV);

      expect(result).toEqual([
        {
          brand: "bmw",
          filename: "bmw.png",
          url: "https://assets.sgcarstrends.com/logos/bmw.png",
        },
        {
          brand: "audi",
          filename: "audi.jpg",
          url: "https://assets.sgcarstrends.com/logos/audi.jpg",
        },
      ]);
    });

    it("should return empty array on error", async () => {
      const { listAllLogos } = await import("@/infra/storage/kv.service");

      vi.mocked(listAllLogos).mockRejectedValue(new Error("KV error"));
      vi.mocked(mockBucket.list).mockRejectedValue(new Error("R2 error"));

      const result = await listLogos(mockBucket, mockKV);

      expect(result).toEqual([]);
    });
  });

  describe("getLogo", () => {
    it("should find existing logo when both KV and R2 exist", async () => {
      const { getLogoMetadata } = await import("@/infra/storage/kv.service");

      // Mock KV returning logo metadata
      vi.mocked(getLogoMetadata).mockResolvedValue({
        brand: "bmw",
        filename: "bmw.jpg",
        url: "https://assets.sgcarstrends.com/logos/bmw.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        fileSize: 1000,
      });

      // Mock R2 bucket returning the file (verifying it exists)
      vi.mocked(mockBucket.get).mockResolvedValue({} as R2Object);

      const result = await getLogo(mockBucket, mockKV, "BMW");

      expect(result).toEqual({
        brand: "bmw",
        filename: "bmw.jpg",
        url: "https://assets.sgcarstrends.com/logos/bmw.jpg",
      });
    });

    it("should clean up stale metadata when R2 file missing", async () => {
      const { getLogoMetadata, removeLogoMetadata, removeLogoFromList } =
        await import("@/infra/storage/kv.service");

      // Mock KV returning stale metadata
      vi.mocked(getLogoMetadata).mockResolvedValue({
        brand: "bmw",
        filename: "bmw.jpg",
        url: "https://assets.sgcarstrends.com/logos/bmw.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        fileSize: 1000,
      });

      // Mock R2 bucket returning null (file doesn't exist)
      vi.mocked(mockBucket.get).mockResolvedValue(null);

      const result = await getLogo(mockBucket, mockKV, "BMW");

      // Should clean up stale metadata
      expect(removeLogoMetadata).toHaveBeenCalledWith(mockKV, "BMW");
      expect(removeLogoFromList).toHaveBeenCalledWith(mockKV, "BMW");

      // Should fall back to R2 scan and return null (no file found)
      expect(result).toBeNull();
    });

    it("should return null when logo not found", async () => {
      const { getLogoMetadata } = await import("@/infra/storage/kv.service");

      // Mock KV returning null, and R2 bucket returning null
      vi.mocked(getLogoMetadata).mockResolvedValue(null);
      vi.mocked(mockBucket.get).mockResolvedValue(null);

      const result = await getLogo(mockBucket, mockKV, "unknown");

      expect(result).toBeNull();
    });
  });

  describe("downloadLogo", () => {
    it("should return existing logo if found", async () => {
      const { getLogoMetadata } = await import("@/infra/storage/kv.service");

      const existingLogo = {
        brand: "bmw",
        filename: "bmw.png",
        url: "https://assets.sgcarstrends.com/logos/bmw.png",
      };

      // Mock KV returning existing logo metadata
      vi.mocked(getLogoMetadata).mockResolvedValue({
        brand: "bmw",
        filename: "bmw.png",
        url: "https://assets.sgcarstrends.com/logos/bmw.png",
        createdAt: "2023-01-01T00:00:00Z",
        fileSize: 1000,
      });

      // Mock R2 bucket returning the file (verifying it exists)
      vi.mocked(mockBucket.get).mockResolvedValue({} as R2Object);

      const result = await downloadLogo(mockBucket, mockKV, "BMW");

      expect(result.success).toBe(true);
      expect(result.logo).toEqual(existingLogo);
    });

    it("should download new logo successfully", async () => {
      const { getLogoMetadata, setLogoMetadata, addLogoToList } = await import(
        "@/infra/storage/kv.service"
      );

      // Mock no existing logo
      vi.mocked(getLogoMetadata).mockResolvedValue(null);
      vi.mocked(mockBucket.get).mockResolvedValue(null);

      // Mock successful direct logo fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1000)),
      });

      const result = await downloadLogo(mockBucket, mockKV, "BMW");

      expect(result.success).toBe(true);
      expect(result.logo?.brand).toBe("bmw");
      expect(result.logo?.filename).toBe("bmw.png");
      expect(mockBucket.put).toHaveBeenCalled();
      expect(vi.mocked(setLogoMetadata)).toHaveBeenCalled();
      expect(vi.mocked(addLogoToList)).toHaveBeenCalled();
    });

    it("should fail when logo not found", async () => {
      const { getLogoMetadata } = await import("@/infra/storage/kv.service");

      vi.mocked(getLogoMetadata).mockResolvedValue(null);
      vi.mocked(mockBucket.get).mockResolvedValue(null);

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await downloadLogo(mockBucket, mockKV, "unknown");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Failed to fetch logo: 404");
    });

    it("should fail when logo image too small", async () => {
      const { getLogoMetadata } = await import("@/infra/storage/kv.service");

      vi.mocked(getLogoMetadata).mockResolvedValue(null);
      vi.mocked(mockBucket.get).mockResolvedValue(null);

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(1000)),
        })
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(50)), // Too small
        });

      const result = await downloadLogo(mockBucket, mockKV, "test");

      expect(result.success).toBe(false);
      expect(result.error).toContain(
        "Downloaded image is too small, likely corrupted",
      );
    });
  });
});
