import { render, screen } from "@testing-library/react";
import { MetricCard } from "@web/components/shared/metric-card";

describe("MetricCard", () => {
  it("should combine metric value and comparison", () => {
    render(
      <MetricCard
        title="COE Premiums"
        value={50000}
        current={50000}
        previousMonth={45000}
      />,
    );

    expect(screen.getByText("COE Premiums")).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });
});
