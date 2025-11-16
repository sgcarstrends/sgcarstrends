import path from "node:path";
import { AWS_LAMBDA_TEMP_DIR } from "@api/config";
import {
  Updater,
  type UpdaterConfig,
  type UpdaterOptions,
} from "@api/lib/updater";
import { calculateChecksum } from "@api/lib/updater/services/calculate-checksum";
import { downloadFile } from "@api/lib/updater/services/download-file";
import { processCsv } from "@api/lib/updater/services/process-csv";
import type { Checksum } from "@api/utils/checksum";
import { db } from "@sgcarstrends/database";
import { createUniqueKey } from "@sgcarstrends/utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock all dependencies
vi.mock("@api/lib/updater/services/download-file");
vi.mock("@api/lib/updater/services/calculate-checksum");
vi.mock("@api/lib/updater/services/process-csv");
vi.mock("@api/utils/checksum");
vi.mock("@sgcarstrends/database", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    $cache: {
      invalidate: vi.fn(),
    },
  },
}));
vi.mock("@sgcarstrends/utils", () => ({
  createUniqueKey: vi.fn(),
  redis: {
    set: vi.fn(),
    get: vi.fn(),
  },
}));
vi.mock("drizzle-orm", () => ({
  getTableName: vi.fn(() => "test_table"),
}));

// Mock table object
const mockTable = {
  month: "month",
  make: "make",
  fuel_type: "fuel_type",
} as any;

describe("Updater", () => {
  let mockChecksum: Checksum;
  let updaterConfig: UpdaterConfig<any>;
  let updaterOptions: UpdaterOptions;

  const mockData = [
    { month: "2024-01", make: "TOYOTA", fuel_type: "Petrol" },
    { month: "2024-01", make: "HONDA", fuel_type: "Hybrid" },
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock Checksum
    mockChecksum = {
      getCachedChecksum: vi.fn(),
      cacheChecksum: vi.fn(),
    } as any;

    // Setup basic config
    updaterConfig = {
      table: mockTable,
      url: "https://example.com/data.zip",
      keyFields: ["month", "make", "fuel_type"],
      csvTransformOptions: {},
    };

    updaterOptions = {
      checksum: mockChecksum,
      batchSize: 2,
    };

    // Default mock implementations
    vi.mocked(downloadFile).mockResolvedValue("test-file.csv");
    vi.mocked(calculateChecksum).mockResolvedValue("abc123");
    vi.mocked(processCsv).mockResolvedValue(mockData);
    vi.mocked(createUniqueKey).mockImplementation((record, fields: []) =>
      fields.map((field) => record[field]).join("|"),
    );

    // getTableName is already mocked in vi.mock above

    // Mock database operations
    const mockSelect = {
      from: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(db.select).mockReturnValue(mockSelect as any);

    const mockInsert = {
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{}, {}]),
    };
    vi.mocked(db.insert).mockReturnValue(mockInsert as any);

    vi.mocked(db.$cache.invalidate).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default options", () => {
      const updater = new Updater(updaterConfig);

      expect(updater).toBeInstanceOf(Updater);
    });

    it("should initialize with custom options", () => {
      const updater = new Updater(updaterConfig, updaterOptions);

      expect(updater).toBeInstanceOf(Updater);
    });
  });

  describe("update", () => {
    it("should successfully process new data", async () => {
      // Mock no cached checksum (first run)
      vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue(null);
      vi.mocked(mockChecksum.cacheChecksum).mockResolvedValue("cached");

      const updater = new Updater(updaterConfig, updaterOptions);
      const result = await updater.update();

      expect(result).toEqual({
        table: "test_table",
        recordsProcessed: 2,
        message: "2 record(s) inserted",
        timestamp: expect.any(String),
      });

      expect(downloadFile).toHaveBeenCalledWith(
        "https://example.com/data.zip",
        undefined,
      );
      expect(calculateChecksum).toHaveBeenCalledWith(
        path.join(AWS_LAMBDA_TEMP_DIR, "test-file.csv"),
      );
      expect(mockChecksum.cacheChecksum).toHaveBeenCalledWith(
        "test-file.csv",
        "abc123",
      );
    });

    it("should return early when file hasn't changed", async () => {
      // Mock cached checksum matches current checksum
      vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue("abc123");

      const updater = new Updater(updaterConfig, updaterOptions);
      const result = await updater.update();

      expect(result).toEqual({
        table: "test_table",
        recordsProcessed: 0,
        message: "File has not changed since last update",
        timestamp: expect.any(String),
      });

      // Should not process data or insert records
      expect(processCsv).not.toHaveBeenCalled();
      expect(db.insert).not.toHaveBeenCalled();
    });

    it("should handle no new records to insert", async () => {
      // Mock checksum change but all records already exist
      vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue(
        "different123",
      );

      // Mock existing records query to return all records
      const mockSelect = {
        from: vi.fn().mockResolvedValue(mockData),
      };
      vi.mocked(db.select).mockReturnValue(mockSelect as any);

      const updater = new Updater(updaterConfig, updaterOptions);
      const result = await updater.update();

      expect(result).toEqual({
        table: "test_table",
        recordsProcessed: 0,
        message:
          "No new data to insert. The provided data matches the existing records.",
        timestamp: expect.any(String),
      });

      expect(db.insert).not.toHaveBeenCalled();
    });

    it("should process data in batches", async () => {
      const largeDataSet = Array(5)
        .fill(null)
        .map((_, i) => ({
          month: "2024-01",
          make: `MAKE_${i}`,
          fuel_type: "Petrol",
        }));

      vi.mocked(processCsv).mockResolvedValue(largeDataSet);
      vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue(null);

      // Mock insert to return the batch
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi
          .fn()
          .mockResolvedValueOnce([{}, {}]) // First batch of 2
          .mockResolvedValueOnce([{}, {}]) // Second batch of 2
          .mockResolvedValueOnce([{}]), // Third batch of 1
      };
      vi.mocked(db.insert).mockReturnValue(mockInsert as any);

      const updater = new Updater(updaterConfig, updaterOptions);
      const result = await updater.update();

      expect(result.recordsProcessed).toBe(5);
      expect(db.insert).toHaveBeenCalledTimes(3); // 3 batches
    });

    it("should handle errors and rethrow", async () => {
      vi.mocked(downloadFile).mockRejectedValue(new Error("Download failed"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const updater = new Updater(updaterConfig, updaterOptions);

      await expect(updater.update()).rejects.toThrow("Download failed");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in updater:",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("downloadAndVerify", () => {
    it("should download file and calculate checksum", async () => {
      vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue(null);

      const updater = new Updater(updaterConfig, updaterOptions);
      // Access private method for testing
      const result = await (updater as any).downloadAndVerify();

      expect(result).toEqual({
        filePath: path.join(AWS_LAMBDA_TEMP_DIR, "test-file.csv"),
        checksum: "abc123",
      });

      expect(downloadFile).toHaveBeenCalledWith(
        "https://example.com/data.zip",
        undefined,
      );
      expect(calculateChecksum).toHaveBeenCalledWith(
        path.join(AWS_LAMBDA_TEMP_DIR, "test-file.csv"),
      );
    });

    it("should return null checksum when file hasn't changed", async () => {
      vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue("abc123");

      const updater = new Updater(updaterConfig, updaterOptions);
      const result = await (updater as any).downloadAndVerify();

      expect(result.checksum).toBeNull();
    });

    it("should use csvFile parameter when provided", async () => {
      const configWithCsvFile = {
        ...updaterConfig,
        csvFile: "specific-file.csv",
      };

      vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue(null);

      const updater = new Updater(configWithCsvFile, updaterOptions);
      await (updater as any).downloadAndVerify();

      expect(downloadFile).toHaveBeenCalledWith(
        "https://example.com/data.zip",
        "specific-file.csv",
      );
    });
  });

  describe("processData", () => {
    it("should process CSV with transform options", async () => {
      const configWithTransforms = {
        ...updaterConfig,
        csvTransformOptions: {
          fields: {
            make: (value: string) => value.toUpperCase(),
          },
        },
      };

      const updater = new Updater(configWithTransforms, updaterOptions);
      const result = await (updater as any).processData("/path/to/file.csv");

      expect(processCsv).toHaveBeenCalledWith(
        "/path/to/file.csv",
        configWithTransforms.csvTransformOptions,
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("insertNewRecords", () => {
    it("should filter out existing records and insert new ones", async () => {
      // Mock existing records query
      const existingRecords = [
        { month: "2024-01", make: "TOYOTA", fuel_type: "Petrol" },
      ];
      const mockSelect = {
        from: vi.fn().mockResolvedValue(existingRecords),
      };
      vi.mocked(db.select).mockReturnValue(mockSelect as any);

      const updater = new Updater(updaterConfig, updaterOptions);
      const result = await (updater as any).insertNewRecords(mockData);

      expect(result).toBe(2); // Only 1 new record (HONDA)
      expect(db.$cache.invalidate).toHaveBeenCalledWith({ tables: mockTable });
    });

    it("should return 0 when no new records", async () => {
      // Mock all records as existing
      const mockSelect = {
        from: vi.fn().mockResolvedValue(mockData),
      };
      vi.mocked(db.select).mockReturnValue(mockSelect as any);

      const updater = new Updater(updaterConfig, updaterOptions);
      const result = await (updater as any).insertNewRecords(mockData);

      expect(result).toBe(0);
      expect(db.insert).not.toHaveBeenCalled();
    });
  });
});
