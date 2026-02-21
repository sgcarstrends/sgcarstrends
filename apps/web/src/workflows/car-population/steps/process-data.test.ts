import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sgcarstrends/database", () => ({
  db: {
    selectDistinct: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
  },
  getTableName: vi.fn(() => "car_population"),
  inArray: vi.fn(),
  carPopulation: {
    year: "year",
    make: "make",
    fuelType: "fuelType",
  },
}));

vi.mock("@web/lib/updater/services/download-file", () => ({
  downloadFile: vi.fn().mockResolvedValue("data.csv"),
}));

vi.mock("@web/lib/updater/services/calculate-checksum", () => ({
  calculateChecksum: vi.fn().mockResolvedValue("abc123"),
}));

vi.mock("@web/lib/updater/services/process-csv", () => ({
  processCsv: vi.fn().mockResolvedValue([]),
}));

const mockGetCachedChecksum = vi.fn().mockResolvedValue(null);
const mockCacheChecksum = vi.fn().mockResolvedValue(null);

vi.mock("@web/utils/checksum", () => ({
  Checksum: class MockChecksum {
    getCachedChecksum = mockGetCachedChecksum;
    cacheChecksum = mockCacheChecksum;
  },
}));

vi.mock("@web/config/workflow", () => ({
  AWS_LAMBDA_TEMP_DIR: "/tmp",
}));

import { db } from "@sgcarstrends/database";
import { calculateChecksum } from "@web/lib/updater/services/calculate-checksum";
import { downloadFile } from "@web/lib/updater/services/download-file";
import { processCsv } from "@web/lib/updater/services/process-csv";
import { updateCarPopulation } from "./process-data";

describe("updateCarPopulation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should download the correct URL", async () => {
    vi.mocked(processCsv).mockResolvedValueOnce([]);
    vi.mocked(db.selectDistinct).mockReturnValue({
      from: vi.fn().mockResolvedValue([]),
    } as unknown as ReturnType<typeof db.selectDistinct>);

    await updateCarPopulation();

    expect(downloadFile).toHaveBeenCalledWith(
      expect.stringContaining("Annual Car Population by Make"),
    );
  });

  it("should return early when checksum matches cached value", async () => {
    mockGetCachedChecksum.mockResolvedValueOnce("abc123");

    const result = await updateCarPopulation();

    expect(result.recordsProcessed).toBe(0);
    expect(result.message).toContain("has not changed");
    expect(processCsv).not.toHaveBeenCalled();
  });

  it("should process CSV with correct column mapping", async () => {
    vi.mocked(processCsv).mockResolvedValueOnce([]);
    vi.mocked(db.selectDistinct).mockReturnValue({
      from: vi.fn().mockResolvedValue([]),
    } as unknown as ReturnType<typeof db.selectDistinct>);

    await updateCarPopulation();

    expect(processCsv).toHaveBeenCalledWith(
      "/tmp/data.csv",
      expect.objectContaining({
        columnMapping: {
          fuel_type: "fuelType",
        },
      }),
    );
  });

  it("should transform empty number values to 0", async () => {
    vi.mocked(processCsv).mockResolvedValueOnce([]);
    vi.mocked(db.selectDistinct).mockReturnValue({
      from: vi.fn().mockResolvedValue([]),
    } as unknown as ReturnType<typeof db.selectDistinct>);

    await updateCarPopulation();

    const csvOptions = vi.mocked(processCsv).mock.calls[0][1];
    const numberTransform = csvOptions?.fields?.number;

    expect(numberTransform).toBeDefined();
    expect(numberTransform?.("")).toBe(0);
    expect(numberTransform?.("100")).toBe(100);
  });

  it("should return no records when all data already exists", async () => {
    vi.mocked(processCsv).mockResolvedValueOnce([
      { year: "2025", make: "TOYOTA", fuelType: "Petrol", number: 100 },
    ]);
    vi.mocked(db.selectDistinct).mockReturnValue({
      from: vi.fn().mockResolvedValue([{ year: "2025" }]),
    } as unknown as ReturnType<typeof db.selectDistinct>);
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi
          .fn()
          .mockResolvedValue([
            { year: "2025", make: "TOYOTA", fuelType: "Petrol" },
          ]),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const result = await updateCarPopulation();

    expect(result.recordsProcessed).toBe(0);
    expect(result.message).toContain("No new data");
  });

  it("should insert records from new years", async () => {
    const newRecords = [
      { year: "2025", make: "TOYOTA", fuelType: "Petrol", number: 200 },
      { year: "2025", make: "BMW", fuelType: "Electric", number: 50 },
    ];

    vi.mocked(processCsv).mockResolvedValueOnce(newRecords);
    vi.mocked(db.selectDistinct).mockReturnValue({
      from: vi.fn().mockResolvedValue([{ year: "2024" }]),
    } as unknown as ReturnType<typeof db.selectDistinct>);
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue(newRecords),
      }),
    } as unknown as ReturnType<typeof db.insert>);

    const result = await updateCarPopulation();

    expect(result.recordsProcessed).toBe(2);
    expect(result.message).toContain("2 record(s) inserted");
  });

  it("should calculate checksum for downloaded file", async () => {
    vi.mocked(processCsv).mockResolvedValueOnce([]);
    vi.mocked(db.selectDistinct).mockReturnValue({
      from: vi.fn().mockResolvedValue([]),
    } as unknown as ReturnType<typeof db.selectDistinct>);

    await updateCarPopulation();

    expect(calculateChecksum).toHaveBeenCalledWith("/tmp/data.csv");
  });
});
