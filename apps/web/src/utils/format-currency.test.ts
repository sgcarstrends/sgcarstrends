import { formatCurrency } from "@/utils/format-currency";

describe("formatCurrency", () => {
  it("should format whole numbers correctly", () => {
    expect(formatCurrency(1000)).toBe("$1,000");
    expect(formatCurrency(50000)).toBe("$50,000");
    expect(formatCurrency(100000)).toBe("$100,000");
  });

  it("should format decimal numbers without fraction digits", () => {
    expect(formatCurrency(1000.5)).toBe("$1,001");
    expect(formatCurrency(999.99)).toBe("$1,000");
    expect(formatCurrency(1000.1)).toBe("$1,000");
  });

  it("should handle zero value", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("should handle negative values", () => {
    expect(formatCurrency(-1000)).toBe("-$1,000");
    expect(formatCurrency(-50000)).toBe("-$50,000");
  });

  it("should handle large numbers", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000");
    expect(formatCurrency(1234567)).toBe("$1,234,567");
  });

  it("should handle small numbers", () => {
    expect(formatCurrency(1)).toBe("$1");
    expect(formatCurrency(99)).toBe("$99");
  });
});