import { render, screen } from "@testing-library/react";
import { MonthSelector } from "./month-selector";

vi.mock("nuqs", () => ({
  useQueryState: vi.fn(() => [null, vi.fn()]),
}));

vi.mock("@/utils/format-date-to-month-year", () => ({
  formatDateToMonthYear: vi.fn(() => "January 2024"),
}));

vi.mock("@/utils/group-by-year", () => ({
  groupByYear: vi.fn(() => ({ "2024": ["01"] })),
}));

describe("MonthSelector", () => {
  it("should render with months array", () => {
    const mockMonths = ["2024-01"];
    render(<MonthSelector months={mockMonths} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should render with empty months array", () => {
    render(<MonthSelector months={[]} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
