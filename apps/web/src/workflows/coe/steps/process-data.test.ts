const mockCoeUpdate = vi.fn();
const mockPqpUpdate = vi.fn();
const capturedConfigs: unknown[] = [];

vi.mock("@sgcarstrends/database", () => ({
  coe: { name: "coe" },
  pqp: { name: "pqp" },
}));

vi.mock("@web/config/workflow", () => ({
  LTA_DATAMALL_BASE_URL: "https://example.com/datamall",
}));

vi.mock("@web/lib/updater", () => ({
  Updater: class MockUpdater {
    private updateFn: () => unknown;
    constructor(config: unknown) {
      capturedConfigs.push(config);
      // First instance is COE, second is PQP
      this.updateFn =
        capturedConfigs.length === 1 ? mockCoeUpdate : mockPqpUpdate;
    }
    update = () => this.updateFn();
  },
}));

import { updateCoe } from "./process-data";

describe("updateCoe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfigs.length = 0;
  });

  it("should create COE and PQP updaters with correct configurations", async () => {
    mockCoeUpdate.mockResolvedValueOnce({
      recordsProcessed: 10,
      message: "10 records inserted",
    });
    mockPqpUpdate.mockResolvedValueOnce({
      recordsProcessed: 5,
      message: "5 records inserted",
    });

    await updateCoe();

    expect(capturedConfigs).toHaveLength(2);

    // First call - COE updater
    expect(capturedConfigs[0]).toMatchObject({
      url: "https://example.com/datamall/COE Bidding Results.zip",
      csvFile: "M11-coe_results.csv",
      keyFields: ["month", "biddingNo"],
    });

    // Second call - PQP updater
    expect(capturedConfigs[1]).toMatchObject({
      url: "https://example.com/datamall/COE Bidding Results.zip",
      csvFile: "M11-coe_results_pqp.csv",
      keyFields: ["month", "vehicleClass", "pqp"],
    });
  });

  it("should call update on both COE and PQP updaters", async () => {
    const coeResult = { recordsProcessed: 10, message: "10 records inserted" };
    const pqpResult = { recordsProcessed: 5, message: "5 records inserted" };

    mockCoeUpdate.mockResolvedValueOnce(coeResult);
    mockPqpUpdate.mockResolvedValueOnce(pqpResult);

    const result = await updateCoe();

    expect(mockCoeUpdate).toHaveBeenCalledTimes(1);
    expect(mockPqpUpdate).toHaveBeenCalledTimes(1);
    expect(result).toEqual(coeResult);
  });

  it("should configure COE column mappings correctly", async () => {
    mockCoeUpdate.mockResolvedValueOnce({ recordsProcessed: 0 });
    mockPqpUpdate.mockResolvedValueOnce({ recordsProcessed: 0 });

    await updateCoe();

    const coeConfig = capturedConfigs[0] as {
      csvTransformOptions?: { columnMapping?: Record<string, string> };
    };
    expect(coeConfig.csvTransformOptions?.columnMapping).toEqual({
      bidding_no: "biddingNo",
      vehicle_class: "vehicleClass",
      bids_success: "bidsSuccess",
      bids_received: "bidsReceived",
    });
  });

  it("should configure PQP column mappings correctly", async () => {
    mockCoeUpdate.mockResolvedValueOnce({ recordsProcessed: 0 });
    mockPqpUpdate.mockResolvedValueOnce({ recordsProcessed: 0 });

    await updateCoe();

    const pqpConfig = capturedConfigs[1] as {
      csvTransformOptions?: { columnMapping?: Record<string, string> };
    };
    expect(pqpConfig.csvTransformOptions?.columnMapping).toEqual({
      vehicle_class: "vehicleClass",
    });
  });

  it("should parse numeric strings with commas correctly", async () => {
    mockCoeUpdate.mockResolvedValueOnce({ recordsProcessed: 1 });
    mockPqpUpdate.mockResolvedValueOnce({ recordsProcessed: 1 });

    await updateCoe();

    const coeConfig = capturedConfigs[0] as {
      csvTransformOptions?: {
        fields?: Record<string, (value: string | number) => number>;
      };
    };

    // Test the quota field transform
    const quotaTransform = coeConfig.csvTransformOptions?.fields?.quota;
    expect(quotaTransform).toBeDefined();
    expect(quotaTransform?.("1,234")).toBe(1234);
    expect(quotaTransform?.("100")).toBe(100);
    expect(quotaTransform?.(50)).toBe(50);
  });

  it("should parse all numeric COE fields", async () => {
    mockCoeUpdate.mockResolvedValueOnce({ recordsProcessed: 1 });
    mockPqpUpdate.mockResolvedValueOnce({ recordsProcessed: 1 });

    await updateCoe();

    const coeConfig = capturedConfigs[0] as {
      csvTransformOptions?: { fields?: Record<string, unknown> };
    };
    const fields = coeConfig.csvTransformOptions?.fields;

    expect(fields?.quota).toBeDefined();
    expect(fields?.bidsSuccess).toBeDefined();
    expect(fields?.bidsReceived).toBeDefined();
    expect(fields?.premium).toBeDefined();
  });

  it("should parse PQP numeric fields", async () => {
    mockCoeUpdate.mockResolvedValueOnce({ recordsProcessed: 1 });
    mockPqpUpdate.mockResolvedValueOnce({ recordsProcessed: 1 });

    await updateCoe();

    const pqpConfig = capturedConfigs[1] as {
      csvTransformOptions?: {
        fields?: Record<string, (value: string | number) => number>;
      };
    };
    const pqpTransform = pqpConfig.csvTransformOptions?.fields?.pqp;

    expect(pqpTransform).toBeDefined();
    expect(pqpTransform?.("45,000")).toBe(45000);
  });

  it("should log COE and PQP results", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    mockCoeUpdate.mockResolvedValueOnce({
      recordsProcessed: 10,
      message: "success",
    });
    mockPqpUpdate.mockResolvedValueOnce({
      recordsProcessed: 5,
      message: "success",
    });

    await updateCoe();

    expect(consoleSpy).toHaveBeenCalledWith("[COE]", expect.anything());
    expect(consoleSpy).toHaveBeenCalledWith("[COE PQP]", expect.anything());

    consoleSpy.mockRestore();
  });
});
