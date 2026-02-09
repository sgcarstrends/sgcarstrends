import { vi } from "vitest";

const { zrangeMock } = vi.hoisted(() => ({
  zrangeMock: vi.fn(),
}));

vi.mock("@sgcarstrends/utils", () => ({
  redis: {
    zrange: zrangeMock,
  },
}));

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock("@web/lib/redis/makes", () => ({
  MAKES_SORTED_SET_KEY: "makes:alpha",
}));

import { getGroupedMakes } from "./grouped-makes";

describe("getGroupedMakes", () => {
  beforeEach(() => {
    zrangeMock.mockReset();
  });

  it("should return sorted makes grouped by first letter", async () => {
    zrangeMock.mockResolvedValue([
      "123MOTORS",
      "AUDI",
      "BMW",
      "MERCEDES BENZ",
      "PORSCHE",
      "VOLKSWAGEN",
    ]);

    const result = await getGroupedMakes();

    expect(result.sortedMakes).toEqual([
      "123MOTORS",
      "AUDI",
      "BMW",
      "MERCEDES BENZ",
      "PORSCHE",
      "VOLKSWAGEN",
    ]);

    expect(result.groupedMakes).toEqual({
      "#": ["123MOTORS"],
      A: ["AUDI"],
      B: ["BMW"],
      M: ["MERCEDES BENZ"],
      P: ["PORSCHE"],
      V: ["VOLKSWAGEN"],
    });
  });

  it("should create letters array with ALL first and # last", async () => {
    zrangeMock.mockResolvedValue([
      "123MOTORS",
      "AUDI",
      "BMW",
      "MERCEDES BENZ",
      "PORSCHE",
      "VOLKSWAGEN",
    ]);

    const result = await getGroupedMakes();

    expect(result.letters).toEqual(["ALL", "A", "B", "M", "P", "V", "#"]);
  });

  it("should handle empty sorted set", async () => {
    zrangeMock.mockResolvedValue([]);

    const result = await getGroupedMakes();

    expect(result.sortedMakes).toEqual([]);
    expect(result.groupedMakes).toEqual({});
    expect(result.letters).toEqual(["ALL"]);
  });

  it("should handle null from Redis", async () => {
    zrangeMock.mockResolvedValue(null);

    const result = await getGroupedMakes();

    expect(result.sortedMakes).toEqual([]);
    expect(result.groupedMakes).toEqual({});
    expect(result.letters).toEqual(["ALL"]);
  });

  it("should handle makes starting with numbers", async () => {
    zrangeMock.mockResolvedValue(["3M", "7-ELEVEN", "BMW"]);

    const result = await getGroupedMakes();

    expect(result.groupedMakes["#"]).toEqual(["3M", "7-ELEVEN"]);
    expect(result.groupedMakes.B).toEqual(["BMW"]);
  });

  it("should handle whitespace in make names", async () => {
    zrangeMock.mockResolvedValue([" AUDI ", "BMW", "  MERCEDES BENZ  "]);

    const result = await getGroupedMakes();

    expect(result.groupedMakes.A).toEqual([" AUDI "]);
    expect(result.groupedMakes.M).toEqual(["  MERCEDES BENZ  "]);
  });
});
