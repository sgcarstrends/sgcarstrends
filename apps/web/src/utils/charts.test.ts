import { describe, expect, it } from "vitest";
import {
  formatCount,
  formatGrowthRate,
  formatNumber,
  formatPercentage,
} from "./charts";

describe("formatNumber", () => {
  it("should format number with thousand separators", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1000000)).toBe("1,000,000");
  });

  it("should format small numbers without separators", () => {
    expect(formatNumber(100)).toBe("100");
    expect(formatNumber(50)).toBe("50");
  });

  it("should handle zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatPercentage", () => {
  it("should format percentage with 1 decimal place", () => {
    expect(formatPercentage(25.5)).toBe("25.5%");
    expect(formatPercentage(50.0)).toBe("50.0%");
  });

  it("should round to 1 decimal place", () => {
    expect(formatPercentage(25.567)).toBe("25.6%");
    expect(formatPercentage(25.123)).toBe("25.1%");
  });

  it("should handle zero", () => {
    expect(formatPercentage(0)).toBe("0.0%");
  });

  it("should handle 100 percent", () => {
    expect(formatPercentage(100)).toBe("100.0%");
  });
});

describe("formatCount", () => {
  it("should format numbers >= 1000 with K suffix", () => {
    expect(formatCount(1000)).toBe("1.0K");
    expect(formatCount(1500)).toBe("1.5K");
    expect(formatCount(2345)).toBe("2.3K");
  });

  it("should not format numbers < 1000", () => {
    expect(formatCount(999)).toBe("999");
    expect(formatCount(500)).toBe("500");
    expect(formatCount(0)).toBe("0");
  });
});

describe("formatGrowthRate", () => {
  it("should format positive growth with plus sign", () => {
    expect(formatGrowthRate(5.5)).toBe("+5.5%");
    expect(formatGrowthRate(10.0)).toBe("+10.0%");
  });

  it("should format negative growth without extra sign", () => {
    expect(formatGrowthRate(-5.5)).toBe("-5.5%");
    expect(formatGrowthRate(-10.0)).toBe("-10.0%");
  });

  it("should format zero growth without sign", () => {
    expect(formatGrowthRate(0)).toBe("0.0%");
  });
});
