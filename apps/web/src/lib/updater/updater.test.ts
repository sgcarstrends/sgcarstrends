import path from "node:path";
import { db } from "@sgcarstrends/database";
import { createUniqueKey } from "@sgcarstrends/utils";
import { AWS_LAMBDA_TEMP_DIR } from "@web/config/workflow";
import {
  type UpdaterConfig,
  type UpdaterOptions,
  update,
} from "@web/lib/updater";
import { calculateChecksum } from "@web/lib/updater/services/calculate-checksum";
import { downloadFile } from "@web/lib/updater/services/download-file";
import { processCsv } from "@web/lib/updater/services/process-csv";
import type { Checksum } from "@web/utils/checksum";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock all dependencies
vi.mock("@web/lib/updater/services/download-file");
vi.mock("@web/lib/updater/services/calculate-checksum");
vi.mock("@web/lib/updater/services/process-csv");
vi.mock("@web/utils/checksum");
vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn(() => vi.fn()),
}));
vi.mock("@sgcarstrends/database", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@sgcarstrends/database")>();
  return {
    ...actual,
    getTableName: vi.fn(() => "test_table"),
    db: {
      select: vi.fn(),
      selectDistinct: vi.fn(),
      insert: vi.fn(),
      $cache: {
        invalidate: vi.fn(),
      },
    },
  };
});
vi.mock("@sgcarstrends/utils", () => ({
  createUniqueKey: vi.fn(),
  redis: {
    set: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock table object
const mockTable = {
  month: "month",
  make: "make",
  fuel_type: "fuel_type",
} as any;

describe("update", () => {
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
    vi.mocked(createUniqueKey).mockImplementation(
      (record: Record<string, unknown>, fields: unknown[]) =>
        (fields as string[]).map((field) => record[field]).join("|"),
    );

    // getTableName is already mocked in vi.mock above

    // Mock database operations
    // Mock selectDistinct for month-level partitioning (Phase 1)
    const mockSelectDistinct = {
      from: vi.fn().mockResolvedValue([]), // No existing months by default
    };
    vi.mocked(db.selectDistinct).mockReturnValue(mockSelectDistinct as any);

    // Mock select for key-level comparison (Phase 2)
    const mockSelect = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
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

  const mockExistingPartitionsAndRecords = (
    existingPartitions: Array<Record<string, string>>,
    existingRecords: Array<Record<string, unknown>>,
    insertCount?: number,
  ) => {
    const mockSelectDistinct = {
      from: vi.fn().mockResolvedValue(existingPartitions),
    };
    vi.mocked(db.selectDistinct).mockReturnValue(mockSelectDistinct as any);

    const mockSelect = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(existingRecords),
      }),
    };
    vi.mocked(db.select).mockReturnValue(mockSelect as any);

    if (insertCount !== undefined) {
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(Array(insertCount).fill({})),
      };
      vi.mocked(db.insert).mockReturnValue(mockInsert as any);
    }
  };

  it("should successfully process new data", async () => {
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue(null);
    vi.mocked(mockChecksum.cacheChecksum).mockResolvedValue(null);

    const result = await update(updaterConfig, updaterOptions);

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
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue("abc123");

    const result = await update(updaterConfig, updaterOptions);

    expect(result).toEqual({
      table: "test_table",
      recordsProcessed: 0,
      message: "File has not changed since last update",
      timestamp: expect.any(String),
    });

    expect(processCsv).not.toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("should handle no new records to insert", async () => {
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue("different123");

    mockExistingPartitionsAndRecords([{ month: "2024-01" }], mockData);

    const result = await update(updaterConfig, updaterOptions);

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

    const mockInsert = {
      values: vi.fn().mockReturnThis(),
      returning: vi
        .fn()
        .mockResolvedValueOnce([{}, {}])
        .mockResolvedValueOnce([{}, {}])
        .mockResolvedValueOnce([{}]),
    };
    vi.mocked(db.insert).mockReturnValue(mockInsert as any);

    const result = await update(updaterConfig, updaterOptions);

    expect(result.recordsProcessed).toBe(5);
    expect(db.insert).toHaveBeenCalledTimes(3);
  });

  it("should propagate errors from download", async () => {
    vi.mocked(downloadFile).mockRejectedValue(new Error("Download failed"));

    await expect(update(updaterConfig, updaterOptions)).rejects.toThrow(
      "Download failed",
    );
  });

  it("should use csvFile parameter when provided", async () => {
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue(null);

    const configWithCsvFile = {
      ...updaterConfig,
      csvFile: "specific-file.csv",
    };

    await update(configWithCsvFile, updaterOptions);

    expect(downloadFile).toHaveBeenCalledWith(
      "https://example.com/data.zip",
      "specific-file.csv",
    );
  });

  it("should insert all records when partition is new (Phase 1)", async () => {
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue(null);

    const result = await update(updaterConfig, updaterOptions);

    expect(result.recordsProcessed).toBe(2);
    expect(db.select).not.toHaveBeenCalled();
  });

  it("should filter out existing records for overlapping partitions (Phase 2)", async () => {
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue("different123");

    const existingRecords = [
      { month: "2024-01", make: "TOYOTA", fuel_type: "Petrol" },
    ];
    mockExistingPartitionsAndRecords(
      [{ month: "2024-01" }],
      existingRecords,
      1,
    );

    const result = await update(updaterConfig, updaterOptions);

    expect(result.recordsProcessed).toBe(1);
  });

  it("should return 0 when all records exist (isSubsetOf early exit)", async () => {
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue("different123");

    mockExistingPartitionsAndRecords([{ month: "2024-01" }], mockData);

    const result = await update(updaterConfig, updaterOptions);

    expect(result.recordsProcessed).toBe(0);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("should handle mixed partitions (some new, some overlapping)", async () => {
    const mixedData = [
      { month: "2024-01", make: "TOYOTA", fuel_type: "Petrol" },
      { month: "2024-02", make: "BMW", fuel_type: "Electric" },
    ];

    vi.mocked(processCsv).mockResolvedValue(mixedData);
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue("different123");

    const existingRecords = [
      { month: "2024-01", make: "TOYOTA", fuel_type: "Petrol" },
    ];
    mockExistingPartitionsAndRecords(
      [{ month: "2024-01" }],
      existingRecords,
      1,
    );

    const result = await update(updaterConfig, updaterOptions);

    expect(result.recordsProcessed).toBe(1);
  });

  it("should support year-based partitioning", async () => {
    const yearTable = {
      year: "year",
      category: "category",
      fuelType: "fuelType",
    } as any;
    const yearData = [
      { year: "2024", category: "Cars", fuelType: "Petrol" },
      { year: "2024", category: "Cars", fuelType: "Electric" },
    ];

    vi.mocked(processCsv).mockResolvedValue(yearData);
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue(null);

    const result = await update(
      {
        table: yearTable,
        url: "https://example.com/annual.zip",
        partitionField: "year",
        keyFields: ["year", "category", "fuelType"],
      },
      updaterOptions,
    );

    expect(result.recordsProcessed).toBe(2);
    expect(db.select).not.toHaveBeenCalled();
  });

  it("should deduplicate by year for overlapping year partitions", async () => {
    const yearTable = {
      year: "year",
      category: "category",
      fuelType: "fuelType",
    } as any;
    const yearData = [
      { year: "2024", category: "Cars", fuelType: "Petrol" },
      { year: "2024", category: "Cars", fuelType: "Electric" },
    ];

    vi.mocked(processCsv).mockResolvedValue(yearData);
    vi.mocked(mockChecksum.getCachedChecksum).mockResolvedValue("different123");

    const existingRecords = [
      { year: "2024", category: "Cars", fuelType: "Petrol" },
    ];
    mockExistingPartitionsAndRecords([{ year: "2024" }], existingRecords, 1);

    const result = await update(
      {
        table: yearTable,
        url: "https://example.com/annual.zip",
        partitionField: "year",
        keyFields: ["year", "category", "fuelType"],
      },
      updaterOptions,
    );

    expect(result.recordsProcessed).toBe(1);
  });
});
