import { formatDateToMonthYear } from "@/utils/format-date-to-month-year";

describe("formatDateToMonthYear", () => {
  it("should return the formatted dates correctly", () => {
    expect(formatDateToMonthYear("2024-01")).toBe("Jan 2024");
    expect(formatDateToMonthYear("2023-12")).toBe("Dec 2023");
    expect(formatDateToMonthYear("2025-06")).toBe("Jun 2025");
  });
});