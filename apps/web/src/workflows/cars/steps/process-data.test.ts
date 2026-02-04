const mockUpdate = vi.fn();
let capturedConfig: unknown = null;

vi.mock("@sgcarstrends/database", () => ({
  cars: { name: "cars" },
}));

vi.mock("@sgcarstrends/utils", () => ({
  cleanSpecialChars: vi.fn(
    (
      value: string,
      options?: { separator?: string; joinSeparator?: string },
    ) => {
      if (options?.separator === ".") {
        return value.replace(/\./g, "");
      }
      if (options?.separator === "/") {
        return value.replace(/\s*\/\s*/g, options.joinSeparator ?? "");
      }
      return value;
    },
  ),
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

import { cleanSpecialChars } from "@sgcarstrends/utils";
import { updateCars } from "./process-data";

describe("updateCars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });

  it("should create an Updater with correct configuration", async () => {
    mockUpdate.mockResolvedValueOnce({
      recordsProcessed: 10,
      message: "10 records inserted",
    });

    await updateCars();

    expect(capturedConfig).toMatchObject({
      url: "https://example.com/datamall/Monthly New Registration of Cars by Make.zip",
      keyFields: ["month", "make", "fuelType", "vehicleType"],
    });
  });

  it("should call update on the Updater instance", async () => {
    const expectedResult = {
      recordsProcessed: 5,
      message: "5 records inserted",
    };
    mockUpdate.mockResolvedValueOnce(expectedResult);

    const result = await updateCars();

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  it("should configure CSV transform options with column mappings", async () => {
    mockUpdate.mockResolvedValueOnce({
      recordsProcessed: 0,
      message: "No new data",
    });

    await updateCars();

    const config = capturedConfig as {
      csvTransformOptions?: { columnMapping?: Record<string, string> };
    };
    expect(config.csvTransformOptions?.columnMapping).toEqual({
      fuel_type: "fuelType",
      vehicle_type: "vehicleType",
      importer_type: "importerType",
    });
  });

  it("should transform make field to uppercase with special chars cleaned", async () => {
    mockUpdate.mockResolvedValueOnce({
      recordsProcessed: 1,
      message: "1 record inserted",
    });

    await updateCars();

    const config = capturedConfig as {
      csvTransformOptions?: {
        fields?: Record<string, (value: string) => string>;
      };
    };
    const makeTransform = config.csvTransformOptions?.fields?.make;

    expect(makeTransform).toBeDefined();
    expect(makeTransform?.("B.M.W.")).toBe("BMW");
    expect(cleanSpecialChars).toHaveBeenCalledWith("B.M.W.", {
      separator: ".",
    });
  });

  it("should transform vehicleType with slash separator", async () => {
    mockUpdate.mockResolvedValueOnce({
      recordsProcessed: 1,
      message: "1 record inserted",
    });

    await updateCars();

    const config = capturedConfig as {
      csvTransformOptions?: {
        fields?: Record<string, (value: string) => string>;
      };
    };
    const vehicleTypeTransform =
      config.csvTransformOptions?.fields?.vehicleType;

    expect(vehicleTypeTransform).toBeDefined();
    expect(vehicleTypeTransform?.("Saloon / Sports")).toBe("Saloon/Sports");
  });

  it("should transform empty number values to 0", async () => {
    mockUpdate.mockResolvedValueOnce({
      recordsProcessed: 1,
      message: "1 record inserted",
    });

    await updateCars();

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
});
