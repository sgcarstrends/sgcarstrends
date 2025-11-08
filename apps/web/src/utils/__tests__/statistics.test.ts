import { describe, expect, it } from "vitest";
import {
  calculateChangePercentage,
  calculatePercentage,
  calculateStats,
  findMinMax,
} from "../statistics";

describe("calculatePercentage", () => {
  it("should calculate percentage correctly", () => {
    expect(calculatePercentage(25, 100)).toBe(25);
    expect(calculatePercentage(50, 200)).toBe(25);
    expect(calculatePercentage(1, 3)).toBeCloseTo(33.333, 2);
  });

  it("should return 0 when total is 0", () => {
    expect(calculatePercentage(10, 0)).toBe(0);
  });

  it("should handle decimal values", () => {
    expect(calculatePercentage(12.5, 50)).toBe(25);
  });
});

describe("calculateChangePercentage", () => {
  it("should calculate percentage increase", () => {
    expect(calculateChangePercentage(120, 100)).toBe(20);
    expect(calculateChangePercentage(150, 100)).toBe(50);
  });

  it("should calculate percentage decrease", () => {
    expect(calculateChangePercentage(80, 100)).toBe(-20);
    expect(calculateChangePercentage(50, 100)).toBe(-50);
  });

  it("should return 0 when previous is 0", () => {
    expect(calculateChangePercentage(100, 0)).toBe(0);
  });

  it("should return 0 when values are equal", () => {
    expect(calculateChangePercentage(100, 100)).toBe(0);
  });

  it("should handle decimal values", () => {
    expect(calculateChangePercentage(110.5, 100)).toBe(10.5);
  });
});

describe("calculateStats", () => {
  it("should calculate stats for array of numbers", () => {
    const data = [10, 20, 30, 40, 50];
    const stats = calculateStats(data, (x) => x);

    expect(stats.min).toBe(10);
    expect(stats.max).toBe(50);
    expect(stats.average).toBe(30);
    expect(stats.sum).toBe(150);
    expect(stats.count).toBe(5);
  });

  it("should calculate stats for array of objects", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 20 },
      { name: "C", value: 30 },
    ];
    const stats = calculateStats(data, (item) => item.value);

    expect(stats.min).toBe(10);
    expect(stats.max).toBe(30);
    expect(stats.average).toBe(20);
    expect(stats.sum).toBe(60);
    expect(stats.count).toBe(3);
  });

  it("should return zeros for empty array", () => {
    const stats = calculateStats([], (x) => x);

    expect(stats.min).toBe(0);
    expect(stats.max).toBe(0);
    expect(stats.average).toBe(0);
    expect(stats.sum).toBe(0);
    expect(stats.count).toBe(0);
  });

  it("should handle single item array", () => {
    const data = [42];
    const stats = calculateStats(data, (x) => x);

    expect(stats.min).toBe(42);
    expect(stats.max).toBe(42);
    expect(stats.average).toBe(42);
    expect(stats.sum).toBe(42);
    expect(stats.count).toBe(1);
  });

  it("should handle negative numbers", () => {
    const data = [-10, -5, 0, 5, 10];
    const stats = calculateStats(data, (x) => x);

    expect(stats.min).toBe(-10);
    expect(stats.max).toBe(10);
    expect(stats.average).toBe(0);
    expect(stats.sum).toBe(0);
    expect(stats.count).toBe(5);
  });
});

describe("findMinMax", () => {
  it("should find min and max items for array of numbers", () => {
    const data = [10, 5, 30, 15, 25];
    const result = findMinMax(data, (x) => x);

    expect(result).not.toBeNull();
    expect(result?.min).toBe(5);
    expect(result?.max).toBe(30);
    expect(result?.minItem).toBe(5);
    expect(result?.maxItem).toBe(30);
  });

  it("should find min and max items for array of objects", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 5 },
      { name: "C", value: 30 },
    ];
    const result = findMinMax(data, (item) => item.value);

    expect(result).not.toBeNull();
    expect(result?.min).toBe(5);
    expect(result?.max).toBe(30);
    expect(result?.minItem).toEqual({ name: "B", value: 5 });
    expect(result?.maxItem).toEqual({ name: "C", value: 30 });
  });

  it("should return null for empty array", () => {
    const result = findMinMax([], (x) => x);
    expect(result).toBeNull();
  });

  it("should handle single item array", () => {
    const data = [{ name: "A", value: 42 }];
    const result = findMinMax(data, (item) => item.value);

    expect(result).not.toBeNull();
    expect(result?.min).toBe(42);
    expect(result?.max).toBe(42);
    expect(result?.minItem).toEqual({ name: "A", value: 42 });
    expect(result?.maxItem).toEqual({ name: "A", value: 42 });
  });

  it("should handle negative numbers", () => {
    const data = [
      { id: 1, value: -10 },
      { id: 2, value: -5 },
      { id: 3, value: 0 },
    ];
    const result = findMinMax(data, (item) => item.value);

    expect(result).not.toBeNull();
    expect(result?.min).toBe(-10);
    expect(result?.max).toBe(0);
    expect(result?.minItem).toEqual({ id: 1, value: -10 });
    expect(result?.maxItem).toEqual({ id: 3, value: 0 });
  });
});
