import { render, screen } from "@testing-library/react";
import {
  InsightCards,
  MarketShareDonut,
  TrendAreaChart,
} from "@web/components/charts";
import { RegistrationTrend } from "@web/components/registration-trend";
import { TopMakesChart } from "@web/components/top-makes-chart";
import { vi } from "vitest";

describe("Dashboard visualisations", () => {
  let getBoundingClientRectSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    getBoundingClientRectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 400,
        right: 600,
        toJSON: () => ({}),
      } as DOMRect);
  });

  afterAll(() => {
    getBoundingClientRectSpy.mockRestore();
  });

  it("should render market share donut with legend", () => {
    const handleValueChange = vi.fn();
    const { getByText } = render(
      <MarketShareDonut
        title="Market Share"
        data={[
          { name: "Brand A", count: 400, percentage: 40, colour: "#ff0000" },
          { name: "Brand B", count: 350, percentage: 35, colour: "#00ff00" },
        ]}
        onValueChange={handleValueChange}
      />,
    );

    expect(getByText("Market Share")).toBeInTheDocument();
    expect(screen.getAllByText("Brand A").length).toBeGreaterThan(0);
  });

  it("should create stacked area chart with total overlay", () => {
    render(
      <TrendAreaChart
        data={[
          { month: "2024-01", total: 100, cars: 60, coe: 40 },
          { month: "2024-02", total: 120, cars: 70, coe: 50 },
        ]}
        title="COE Growth"
        subtitle="Monthly movement"
        categories={["cars", "coe"]}
        showTotal
      />,
    );

    expect(screen.getByText("COE Growth")).toBeInTheDocument();
  });

  it("should render insight cards with delta indicators", () => {
    render(
      <InsightCards
        insights={[
          {
            title: "New Registrations",
            value: 1234,
            delta: 5.2,
            deltaType: "increase",
          },
        ]}
      />,
    );

    expect(screen.getByText("New Registrations")).toBeInTheDocument();
    expect(screen.getByText("+5.2%")).toBeInTheDocument();
  });

  it("should render an empty state when no insights exist", () => {
    render(<InsightCards insights={[]} />);
    expect(screen.getByText("No insights available")).toBeInTheDocument();
  });

  it("should render top makes list for a year", () => {
    render(
      <TopMakesChart
        year={2024}
        topMakes={[
          { make: "Tesla", value: 1200 },
          { make: "Toyota", value: 1100 },
        ]}
      />,
    );

    expect(screen.getByText("Top 2 Car Makes (2024)")).toBeInTheDocument();
  });

  it("should render yearly registration trend", () => {
    render(
      <RegistrationTrend
        data={[
          { year: 2023, total: 32000 },
          { year: 2024, total: 34000 },
        ]}
      />,
    );

    expect(screen.getByText("Yearly Registration Trend")).toBeInTheDocument();
  });
});
