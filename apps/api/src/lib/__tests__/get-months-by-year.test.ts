import { getMonthsByYear } from "@api/lib/get-months-by-year";
import { describe, expect, it } from "vitest";

describe("getMonthsByYear", () => {
  it("should group months by year", () => {
    const months = ["2022-01", "2022-12", "2023-01", "2023-02"];

    expect(Object.keys(getMonthsByYear(months))).toHaveLength(2);
    expect(getMonthsByYear(months)).toEqual([
      { year: "2023", months: ["02", "01"] },
      { year: "2022", months: ["12", "01"] },
    ]);
  });

  it("should handle empty array", () => {
    const months: string[] = [];

    const result = getMonthsByYear(months);

    expect(Object.keys(result)).toHaveLength(0);
  });

  it("should handle single year", () => {
    const months = ["2023-01", "2023-02", "2023-03"];

    expect(Object.keys(getMonthsByYear(months))).toHaveLength(1);
    expect(getMonthsByYear(months)).toEqual([
      {
        year: "2023",
        months: ["03", "02", "01"],
      },
    ]);
  });
});
