import { render, screen } from "@testing-library/react";
import {
  InsightCards,
  MarketShareDonut,
  TopPerformersBar,
  TrendAreaChart,
} from "@web/components/charts";
import { GeoChart } from "@web/components/geo-chart";
import { PageViewsChart } from "@web/components/page-views-chart";
import { ReferrerChart } from "@web/components/referrer-chart";
import { TopMakesByYear } from "@web/components/top-makes-by-year";
import { TotalNewCarRegistrationsByYear } from "@web/components/total-new-car-registrations-by-year";
import { VisitorTrendsChart } from "@web/components/visitor-trends-chart";
import { VisitorsAnalytics } from "@web/components/visitors-analytics";
import type { AnalyticsData } from "@web/types/analytics";
import { vi } from "vitest";

const analyticsData: AnalyticsData = {
  totalViews: 1000,
  uniqueVisitors: 750,
  dailyViews: [
    { date: "2024-01-01", count: 120 },
    { date: "2024-01-02", count: 140 },
  ],
  topReferrers: [
    { referrer: "https://www.google.com/search?q=coe", count: 400 },
    { referrer: "https://twitter.com/sgcars", count: 200 },
  ],
  topPages: [
    { pathname: "/cars", count: 300 },
    { pathname: "/visitors", count: 200 },
  ],
  topCountries: [
    { flag: "🇸🇬", country: "Singapore", count: 600 },
    { flag: "🇲🇾", country: "Malaysia", count: 150 },
  ],
  topCities: [
    { flag: "🇸🇬", country: "Singapore", city: "Singapore", count: 400 },
    { flag: "🇮🇩", country: "Indonesia", city: "Jakarta", count: 80 },
  ],
};

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

  it("renders the visitors analytics panels with fallback rows", () => {
    const { getByText } = render(<VisitorsAnalytics data={analyticsData} />);
    expect(getByText("Top Sources")).toBeInTheDocument();
    expect(getByText("Direct / None")).toBeInTheDocument();
    expect(getByText("/cars")).toBeInTheDocument();
    expect(getByText("Singapore, Singapore")).toBeInTheDocument();
  });

  it("defaults to direct traffic when no referrers are recorded", () => {
    render(
      <VisitorsAnalytics
        data={{
          ...analyticsData,
          topReferrers: [],
        }}
      />,
    );

    expect(screen.getAllByText("Direct / None").length).toBeGreaterThan(0);
  });

  it("renders charts for visitor trends", () => {
    render(<VisitorTrendsChart data={analyticsData.dailyViews} />);
    expect(screen.getByText("Visitor Trends")).toBeInTheDocument();
  });

  it("renders GeoChart card heading", () => {
    const { getByText } = render(
      <GeoChart data={analyticsData.topCountries} />,
    );
    expect(getByText("Top Countries")).toBeInTheDocument();
    expect(getByText("Visitor distribution by country")).toBeInTheDocument();
  });

  it("renders PageViews chart heading", () => {
    const { getByText } = render(
      <PageViewsChart
        data={[
          {
            pathname: "/very/long/page/path/that/needs/truncation",
            count: 100,
          },
        ]}
      />,
    );

    expect(getByText("Popular Pages")).toBeInTheDocument();
  });

  it("falls back when no referrer data exists", () => {
    render(<ReferrerChart data={[]} totalViews={0} />);
    expect(screen.getByText("No referrer data available")).toBeInTheDocument();
  });

  it("renders ReferrerChart heading", () => {
    const { getByText } = render(
      <ReferrerChart
        totalViews={500}
        data={[
          { referrer: "https://www.google.com", count: 200 },
          { referrer: "https://www.facebook.com/groups", count: 180 },
        ]}
      />,
    );

    expect(getByText("Traffic Sources")).toBeInTheDocument();
  });

  it("renders market share donut with legend", () => {
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

  it("creates stacked area chart with total overlay", () => {
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

  it("highlights top performers with ranking badges", () => {
    render(
      <TopPerformersBar
        title="Top Makes"
        data={[
          { name: "Tesla", count: 120, percentage: 0.12, rank: 1 },
          { name: "Toyota", count: 110, percentage: 0.11, rank: 2 },
          { name: "BMW", count: 90, percentage: 0.09, rank: 3 },
        ]}
      />,
    );

    expect(screen.getByText(/Tesla/)).toBeInTheDocument();
    expect(screen.queryByText(/Showing top/)).not.toBeInTheDocument();
  });

  it("shows informational footer when more performers are available", async () => {
    const { findByText } = render(
      <TopPerformersBar
        title="Top Makes"
        data={Array.from({ length: 12 }).map((_, index) => ({
          name: `Brand ${index}`,
          count: 100 - index,
          percentage: 0.01 * (index + 1),
          rank: index + 1,
        }))}
      />,
    );

    expect(await findByText(/Showing top 10 of 12 items/i)).toBeInTheDocument();
  });

  it("renders insight cards with delta indicators", () => {
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

  it("renders an empty state when no insights exist", () => {
    render(<InsightCards insights={[]} />);
    expect(screen.getByText("No insights available")).toBeInTheDocument();
  });

  it("renders top makes list for a year", () => {
    render(
      <TopMakesByYear
        year={2024}
        topMakes={[
          { make: "Tesla", value: 1200 },
          { make: "Toyota", value: 1100 },
        ]}
      />,
    );

    expect(screen.getByText("Top 2 Car Makes (2024)")).toBeInTheDocument();
  });

  it("renders yearly registration totals", () => {
    render(
      <TotalNewCarRegistrationsByYear
        data={[
          { year: 2023, total: 32000 },
          { year: 2024, total: 34000 },
        ]}
      />,
    );

    expect(
      screen.getByText("Total New Car Registrations by Year"),
    ).toBeInTheDocument();
  });
});
