import { render, screen } from "@testing-library/react";
import { PageHeader } from "@web/components/page-header";
import { vi } from "vitest";

vi.mock("@web/components/shared/month-selector", () => ({
  MonthSelector: ({ months }: { months: string[] }) => (
    <div data-testid="month-selector">{months.join(",") || "no-months"}</div>
  ),
}));

describe("PageHeader", () => {
  it("should show last updated date, month selector, and action area", () => {
    render(
      <PageHeader
        title="COE Trends"
        subtitle="Latest insights"
        lastUpdated={1704067200000}
        showMonthSelector
        months={["2024-01", "2023-12"]}
      >
        <span data-testid="extra-actions">Actions</span>
      </PageHeader>,
    );

    expect(screen.getByText("COE Trends")).toBeInTheDocument();
    expect(screen.getByText("Latest insights")).toBeInTheDocument();
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    expect(screen.getByTestId("month-selector")).toHaveTextContent(
      "2024-01,2023-12",
    );
    expect(screen.getByTestId("extra-actions")).toBeInTheDocument();
  });
});
