vi.mock("@sgcarstrends/database", () => ({
  coe: { name: "coe" },
  pqp: { name: "pqp" },
}));

vi.mock("@web/config/workflow", () => ({
  LTA_DATAMALL_BASE_URL: "https://example.com/datamall",
}));

vi.mock("@web/lib/updater", () => ({
  update: vi.fn(),
}));

import { type UpdaterResult, update } from "@web/lib/updater";
import { updateCoe } from "./process-data";

const mockResult = (overrides?: Partial<UpdaterResult>): UpdaterResult => ({
  table: "coe",
  recordsProcessed: 0,
  message: "",
  timestamp: new Date().toISOString(),
  ...overrides,
});

describe("updateCoe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call update with correct COE and PQP configurations", async () => {
    vi.mocked(update)
      .mockResolvedValueOnce(
        mockResult({ recordsProcessed: 10, message: "10 records inserted" }),
      )
      .mockResolvedValueOnce(
        mockResult({
          table: "pqp",
          recordsProcessed: 5,
          message: "5 records inserted",
        }),
      );

    await updateCoe();

    expect(update).toHaveBeenCalledTimes(2);

    // First call - COE
    expect(vi.mocked(update).mock.calls[0][0]).toMatchObject({
      url: "https://example.com/datamall/COE Bidding Results.zip",
      csvFile: "M11-coe_results.csv",
      keyFields: ["month", "biddingNo"],
    });

    // Second call - PQP
    expect(vi.mocked(update).mock.calls[1][0]).toMatchObject({
      url: "https://example.com/datamall/COE Bidding Results.zip",
      csvFile: "M11-coe_results_pqp.csv",
      keyFields: ["month", "vehicleClass", "pqp"],
    });
  });

  it("should return the COE result", async () => {
    const coeResult = mockResult({
      recordsProcessed: 10,
      message: "10 records inserted",
    });
    const pqpResult = mockResult({
      table: "pqp",
      recordsProcessed: 5,
      message: "5 records inserted",
    });

    vi.mocked(update)
      .mockResolvedValueOnce(coeResult)
      .mockResolvedValueOnce(pqpResult);

    const result = await updateCoe();

    expect(result).toEqual(coeResult);
  });

  it("should configure COE column mappings correctly", async () => {
    vi.mocked(update)
      .mockResolvedValueOnce(mockResult())
      .mockResolvedValueOnce(mockResult({ table: "pqp" }));

    await updateCoe();

    const coeConfig = vi.mocked(update).mock.calls[0][0] as {
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
    vi.mocked(update)
      .mockResolvedValueOnce(mockResult())
      .mockResolvedValueOnce(mockResult({ table: "pqp" }));

    await updateCoe();

    const pqpConfig = vi.mocked(update).mock.calls[1][0] as {
      csvTransformOptions?: { columnMapping?: Record<string, string> };
    };
    expect(pqpConfig.csvTransformOptions?.columnMapping).toEqual({
      vehicle_class: "vehicleClass",
    });
  });

  it("should parse numeric strings with commas correctly", async () => {
    vi.mocked(update)
      .mockResolvedValueOnce(mockResult())
      .mockResolvedValueOnce(mockResult({ table: "pqp" }));

    await updateCoe();

    const coeConfig = vi.mocked(update).mock.calls[0][0] as {
      csvTransformOptions?: {
        fields?: Record<string, (value: string | number) => number>;
      };
    };

    const quotaTransform = coeConfig.csvTransformOptions?.fields?.quota;
    expect(quotaTransform).toBeDefined();
    expect(quotaTransform?.("1,234")).toBe(1234);
    expect(quotaTransform?.("100")).toBe(100);
    expect(quotaTransform?.(50)).toBe(50);
  });

  it("should parse all numeric COE fields", async () => {
    vi.mocked(update)
      .mockResolvedValueOnce(mockResult())
      .mockResolvedValueOnce(mockResult({ table: "pqp" }));

    await updateCoe();

    const coeConfig = vi.mocked(update).mock.calls[0][0] as {
      csvTransformOptions?: { fields?: Record<string, unknown> };
    };
    const fields = coeConfig.csvTransformOptions?.fields;

    expect(fields?.quota).toBeDefined();
    expect(fields?.bidsSuccess).toBeDefined();
    expect(fields?.bidsReceived).toBeDefined();
    expect(fields?.premium).toBeDefined();
  });

  it("should parse PQP numeric fields", async () => {
    vi.mocked(update)
      .mockResolvedValueOnce(mockResult())
      .mockResolvedValueOnce(mockResult({ table: "pqp" }));

    await updateCoe();

    const pqpConfig = vi.mocked(update).mock.calls[1][0] as {
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

    vi.mocked(update)
      .mockResolvedValueOnce(
        mockResult({ recordsProcessed: 10, message: "success" }),
      )
      .mockResolvedValueOnce(
        mockResult({ table: "pqp", recordsProcessed: 5, message: "success" }),
      );

    await updateCoe();

    expect(consoleSpy).toHaveBeenCalledWith("[COE]", expect.anything());
    expect(consoleSpy).toHaveBeenCalledWith("[COE PQP]", expect.anything());

    consoleSpy.mockRestore();
  });
});
