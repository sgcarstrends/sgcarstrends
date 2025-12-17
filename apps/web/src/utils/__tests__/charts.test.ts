import {
  createDataFormatter,
  customTooltipFormatter,
  formatCount,
  formatGrowthRate,
  formatMonthYear,
  formatNumber,
  formatPercent,
  formatPercentage,
} from "@web/utils/charts";
import { describe, expect, it } from "vitest";

describe("formatNumber", () => {
  it("should format numbers with Singapore locale", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(999)).toBe("999");
  });
});

describe("formatPercentage", () => {
  it("should format percentage with 1 decimal place", () => {
    expect(formatPercentage(25.5)).toBe("25.5%");
    expect(formatPercentage(100)).toBe("100.0%");
    expect(formatPercentage(0)).toBe("0.0%");
  });
});

describe("formatPercent", () => {
  it("should format decimal as percentage", () => {
    expect(formatPercent(0.255)).toBe("26%");
    expect(formatPercent(1)).toBe("100%");
    expect(formatPercent(0)).toBe("0%");
  });

  it("should accept custom options", () => {
    expect(formatPercent(0.255, { minimumFractionDigits: 1 })).toBe("25.5%");
  });
});

describe("formatCount", () => {
  it("should format values >= 1000 as K", () => {
    expect(formatCount(1000)).toBe("1.0K");
    expect(formatCount(1500)).toBe("1.5K");
    expect(formatCount(12345)).toBe("12.3K");
  });

  it("should return string for values < 1000", () => {
    expect(formatCount(999)).toBe("999");
    expect(formatCount(0)).toBe("0");
    expect(formatCount(500)).toBe("500");
  });
});

describe("formatGrowthRate", () => {
  it("should add + sign for positive values", () => {
    expect(formatGrowthRate(5.5)).toBe("+5.5%");
    expect(formatGrowthRate(0.1)).toBe("+0.1%");
  });

  it("should not add sign for negative or zero values", () => {
    expect(formatGrowthRate(-5.5)).toBe("-5.5%");
    expect(formatGrowthRate(0)).toBe("0.0%");
  });
});

describe("createDataFormatter", () => {
  it("should format as number", () => {
    const formatter = createDataFormatter("number");
    expect(formatter(1234)).toBe("1,234");
  });

  it("should format as percentage", () => {
    const formatter = createDataFormatter("percentage");
    expect(formatter(25.5)).toBe("25.5%");
  });

  it("should format as currency", () => {
    const formatter = createDataFormatter("currency");
    expect(formatter(1234)).toBe("$1,234");
  });

  it("should format as count", () => {
    const formatter = createDataFormatter("count");
    expect(formatter(1500)).toBe("1.5K");
    expect(formatter(500)).toBe("500");
  });

  it("should format as growth", () => {
    const formatter = createDataFormatter("growth");
    expect(formatter(5.5)).toBe("+5.5%");
    expect(formatter(-3.2)).toBe("-3.2%");
  });

  it("should return string for unknown format type", () => {
    // @ts-expect-error Testing invalid format type
    const formatter = createDataFormatter("unknown");
    expect(formatter(123)).toBe("123");
  });
});

describe("customTooltipFormatter", () => {
  it("should return formatted value and name", () => {
    const result = customTooltipFormatter(1234, "Sales");
    expect(result).toEqual(["1,234", "Sales"]);
  });

  it("should use specified format type", () => {
    const result = customTooltipFormatter(25.5, "Growth", "percentage");
    expect(result).toEqual(["25.5%", "Growth"]);
  });
});

describe("formatMonthYear", () => {
  it("should format month string to month year", () => {
    expect(formatMonthYear("2024-01")).toBe("Jan 2024");
    expect(formatMonthYear("2023-12")).toBe("Dec 2023");
  });
});
