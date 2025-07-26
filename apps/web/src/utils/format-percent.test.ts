import { formatPercent } from "@web/utils/format-percent";

describe("formatPercent", () => {
  it("should format a value in percentage", () => {
    expect(formatPercent(1)).toBe("100%");
    expect(formatPercent(0.01)).toBe("1%");
  });

  it.each([
    {
      decimalPoint: 1,
      expected: "100.0%",
    },
    {
      decimalPoint: 2,
      expected: "100.00%",
    },
  ])(
    "should format a value in percentage up to $decimalPoint decimal points",
    ({ decimalPoint, expected }) => {
      expect(
        formatPercent(1, {
          minimumFractionDigits: decimalPoint,
          maximumFractionDigits: decimalPoint,
        }),
      ).toBe(expected);
    },
  );
});
