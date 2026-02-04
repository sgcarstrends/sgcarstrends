const mockUpdate = vi.fn();
let capturedConfig: unknown = null;

vi.mock("@sgcarstrends/database", () => ({
  deregistrations: { name: "deregistrations" },
}));

vi.mock("@web/config/workflow", () => ({
  LTA_DATAMALL_BASE_URL: "https://example.com/datamall",
}));

vi.mock("@web/lib/updater", () => ({
  Updater: class MockUpdater {
    constructor(config: unknown) {
      capturedConfig = config;
    }
    update = mockUpdate;
  },
}));

import { updateDeregistration } from "./process-data";

describe("updateDeregistration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });

  it("should create an Updater with correct configuration", async () => {
    mockUpdate.mockResolvedValueOnce({
      recordsProcessed: 10,
      message: "10 records inserted",
    });

    await updateDeregistration();

    expect(capturedConfig).toMatchObject({
      url: "https://example.com/datamall/Monthly De-Registered Motor Vehicles under Vehicle Quota System (VQS).zip",
      keyFields: ["month", "category"],
    });
  });

  it("should call update on the Updater instance", async () => {
    const expectedResult = {
      recordsProcessed: 5,
      message: "5 records inserted",
    };
    mockUpdate.mockResolvedValueOnce(expectedResult);

    const result = await updateDeregistration();

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  it("should not have column mappings (uses default column names)", async () => {
    mockUpdate.mockResolvedValueOnce({
      recordsProcessed: 0,
      message: "No new data",
    });

    await updateDeregistration();

    const config = capturedConfig as {
      csvTransformOptions?: { columnMapping?: Record<string, string> };
    };
    expect(config.csvTransformOptions?.columnMapping).toBeUndefined();
  });

  it("should transform empty number values to 0", async () => {
    mockUpdate.mockResolvedValueOnce({
      recordsProcessed: 1,
      message: "1 record inserted",
    });

    await updateDeregistration();

    const config = capturedConfig as {
      csvTransformOptions?: {
        fields?: Record<string, (value: string | number) => number>;
      };
    };
    const numberTransform = config.csvTransformOptions?.fields?.number;

    expect(numberTransform).toBeDefined();
    expect(numberTransform?.("")).toBe(0);
    expect(numberTransform?.(42)).toBe(42);
    expect(numberTransform?.("100")).toBe(100);
  });

  it("should use correct key fields for deduplication", async () => {
    mockUpdate.mockResolvedValueOnce({
      recordsProcessed: 0,
      message: "No new data",
    });

    await updateDeregistration();

    const config = capturedConfig as { keyFields: string[] };
    expect(config.keyFields).toEqual(["month", "category"]);
  });
});
