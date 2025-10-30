import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  TopTypeResult,
  TypeDetailData,
  TypeDistribution,
} from "../categories";
import {
  FUEL_TYPE,
  getDistinctTypes,
  getTopType,
  getTypeDetails,
  getTypeDistribution,
  VEHICLE_TYPE,
} from "../categories";

// Create a chainable query builder mock
const createQueryBuilderMock = (returnValue: unknown) => {
  // Create a promise that resolves to returnValue
  const promise = Promise.resolve(returnValue);

  const mock = {
    select: vi.fn().mockReturnThis(),
    selectDistinct: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnValue(promise),
  };

  // Make the mock thenable by copying promise methods
  Object.assign(mock, {
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
  });

  return mock;
};

// Mock the database module
vi.mock("@sgcarstrends/database", () => ({
  db: {
    select: vi.fn(),
    selectDistinct: vi.fn(),
  },
  cars: {
    month: "month",
    fuel_type: "fuel_type",
    vehicle_type: "vehicle_type",
    number: "number",
    make: "make",
  },
}));

describe("getTypeDistribution", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return type distribution ordered by count descending", async () => {
    const mockData: TypeDistribution[] = [
      { name: "Petrol", count: 1000 },
      { name: "Electric", count: 500 },
      { name: "Diesel", count: 200 },
    ];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.select).mockReturnValue(
      createQueryBuilderMock(mockData) as never,
    );

    const result = await getTypeDistribution(FUEL_TYPE, "2024-01");

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("count");
    expect(typeof result[0].count).toBe("number");
    if (result.length > 1) {
      expect(result[0].count).toBeGreaterThanOrEqual(result[1].count);
    }
  });

  it("should return empty array for non-existent month", async () => {
    const mockData: TypeDistribution[] = [];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.select).mockReturnValue(
      createQueryBuilderMock(mockData) as never,
    );

    const result = await getTypeDistribution(FUEL_TYPE, "9999-12");

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

describe("getTopType", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return top types with correct structure", async () => {
    const mockData: TopTypeResult[] = [{ name: "Petrol", total: 1000 }];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.select).mockReturnValue(
      createQueryBuilderMock(mockData) as never,
    );

    const result = await getTopType(FUEL_TYPE, "2024-01", 1);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("total");
    expect(typeof result[0].total).toBe("number");
  });

  it("should respect limit parameter and order by total descending", async () => {
    const mockDataTop1: TopTypeResult[] = [{ name: "Petrol", total: 1000 }];
    const mockDataTop3: TopTypeResult[] = [
      { name: "Petrol", total: 1000 },
      { name: "Electric", total: 500 },
      { name: "Diesel", total: 200 },
    ];

    const { db } = await import("@sgcarstrends/database");

    vi.mocked(db.select).mockReturnValueOnce(
      createQueryBuilderMock(mockDataTop1) as never,
    );
    const top1 = await getTopType(FUEL_TYPE, "2024-01", 1);

    vi.mocked(db.select).mockReturnValueOnce(
      createQueryBuilderMock(mockDataTop3) as never,
    );
    const top3 = await getTopType(FUEL_TYPE, "2024-01", 3);

    expect(top1.length).toBeLessThanOrEqual(1);
    expect(top3.length).toBeLessThanOrEqual(3);
    if (top3.length > 1) {
      expect(top3[0].total).toBeGreaterThanOrEqual(top3[1].total);
    }
  });

  it("should return empty array for non-existent month", async () => {
    const mockData: TopTypeResult[] = [];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.select).mockReturnValue(
      createQueryBuilderMock(mockData) as never,
    );

    const result = await getTopType(FUEL_TYPE, "9999-12");

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

describe("getDistinctTypes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all distinct types", async () => {
    const mockData = [
      { value: "Petrol" },
      { value: "Electric" },
      { value: "Diesel" },
      { value: "Petrol-Hybrid" },
    ];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.selectDistinct).mockReturnValue(
      createQueryBuilderMock(mockData) as never,
    );

    const result = await getDistinctTypes(FUEL_TYPE);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should filter by month when provided and return subset", async () => {
    const mockAllTypes = [
      { value: "Petrol" },
      { value: "Electric" },
      { value: "Diesel" },
      { value: "Petrol-Hybrid" },
    ];
    const mockMonthTypes = [{ value: "Petrol" }, { value: "Electric" }];

    const { db } = await import("@sgcarstrends/database");

    vi.mocked(db.selectDistinct).mockReturnValueOnce(
      createQueryBuilderMock(mockAllTypes) as never,
    );
    const allTypes = await getDistinctTypes(FUEL_TYPE);

    vi.mocked(db.selectDistinct).mockReturnValueOnce(
      createQueryBuilderMock(mockMonthTypes) as never,
    );
    const monthTypes = await getDistinctTypes(FUEL_TYPE, "2024-01");

    expect(Array.isArray(allTypes)).toBe(true);
    expect(Array.isArray(monthTypes)).toBe(true);
    expect(monthTypes.length).toBeLessThanOrEqual(allTypes.length);
  });

  it("should filter out null values", async () => {
    const mockData = [
      { value: "Petrol" },
      { value: "Electric" },
      { value: null },
    ];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.selectDistinct).mockReturnValue(
      createQueryBuilderMock(mockData) as never,
    );

    const result = await getDistinctTypes(FUEL_TYPE);

    expect(result.every((v) => v !== null && v !== "null")).toBe(true);
  });
});

describe("getTypeDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return detailed data with correct structure and ordering", async () => {
    const mockTotalResult = [{ total: 1500 }];
    const mockDetailData = [
      {
        month: "2024-01",
        make: "Toyota",
        type: "Petrol",
        count: 800,
      },
      {
        month: "2024-01",
        make: "Honda",
        type: "Petrol",
        count: 700,
      },
    ];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.select)
      .mockReturnValueOnce(createQueryBuilderMock(mockTotalResult) as never)
      .mockReturnValueOnce(createQueryBuilderMock(mockDetailData) as never);

    const result = await getTypeDetails(FUEL_TYPE, "petrol", "2024-01");

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("data");
    expect(typeof result.total).toBe("number");
    expect(Array.isArray(result.data)).toBe(true);
    if (result.data.length > 0) {
      expect(result.data[0]).toHaveProperty("month");
      expect(result.data[0]).toHaveProperty("make");
      expect(result.data[0]).toHaveProperty("type");
      expect(result.data[0]).toHaveProperty("count");
      if (result.data.length > 1) {
        expect(result.data[0].count).toBeGreaterThanOrEqual(
          result.data[1].count,
        );
      }
    }
  });

  it("should handle hyphenated type values", async () => {
    const mockTotalResult = [{ total: 300 }];
    const mockDetailData = [
      {
        month: "2024-01",
        make: "Toyota",
        type: "Petrol-Hybrid",
        count: 300,
      },
    ];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.select)
      .mockReturnValueOnce(createQueryBuilderMock(mockTotalResult) as never)
      .mockReturnValueOnce(createQueryBuilderMock(mockDetailData) as never);

    const result = await getTypeDetails(FUEL_TYPE, "petrol-hybrid", "2024-01");

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("data");
    expect(typeof result.total).toBe("number");
  });

  it("should work without month filter", async () => {
    const mockTotalResult = [{ total: 5000 }];
    const mockDetailData = [
      {
        month: "2024-01",
        make: "Toyota",
        type: "Petrol",
        count: 2500,
      },
      {
        month: "2023-12",
        make: "Toyota",
        type: "Petrol",
        count: 2500,
      },
    ];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.select)
      .mockReturnValueOnce(createQueryBuilderMock(mockTotalResult) as never)
      .mockReturnValueOnce(createQueryBuilderMock(mockDetailData) as never);

    const result = await getTypeDetails(FUEL_TYPE, "petrol");

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("data");
  });

  it("should return zero total for non-existent type", async () => {
    const mockTotalResult: TypeDetailData["data"] = [];
    const mockDetailData: TypeDetailData["data"] = [];

    const { db } = await import("@sgcarstrends/database");
    vi.mocked(db.select)
      .mockReturnValueOnce(createQueryBuilderMock(mockTotalResult) as never)
      .mockReturnValueOnce(createQueryBuilderMock(mockDetailData) as never);

    const result = await getTypeDetails(
      FUEL_TYPE,
      "non-existent-type",
      "2024-01",
    );

    expect(result.total).toBe(0);
    expect(result.data.length).toBe(0);
  });
});

describe("Type configurations", () => {
  it("FUEL_TYPE should have correct structure", () => {
    expect(FUEL_TYPE).toHaveProperty("column");
    expect(FUEL_TYPE).toHaveProperty("fieldName");
    expect(FUEL_TYPE.fieldName).toBe("fuelType");
  });

  it("VEHICLE_TYPE should have correct structure", () => {
    expect(VEHICLE_TYPE).toHaveProperty("column");
    expect(VEHICLE_TYPE).toHaveProperty("fieldName");
    expect(VEHICLE_TYPE.fieldName).toBe("vehicleType");
  });
});
