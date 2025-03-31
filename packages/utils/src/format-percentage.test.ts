import { describe, expect, it } from "vitest";
import { formatPercentage } from "./format-percentage";

describe("formatPercentage", () => {
  it("should format numbers with default fraction digits (2)", () => {
    expect(formatPercentage(12.3456)).toEqual(12.35);
    expect(formatPercentage(1.2)).toEqual(1.2);
    expect(formatPercentage(100)).toEqual(100.0);
  });

  it("should format numbers with custom fraction digits", () => {
    expect(formatPercentage(12.3456, 3)).toEqual(12.346);
    expect(formatPercentage(1.2, 0)).toEqual(1);
  });

  it("should format negative numbers", () => {
    expect(formatPercentage(0)).toEqual(0.0);
    expect(formatPercentage(-12.345)).toEqual(-12.35);
    expect(formatPercentage(-12.345, 3)).toEqual(-12.345);
  });
});
