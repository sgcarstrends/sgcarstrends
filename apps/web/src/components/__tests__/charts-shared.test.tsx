import { render, screen } from "@testing-library/react";
import {
  ChartDescriptionSection,
  currencyTooltipFormatter,
  MonthXAxis,
  PriceYAxis,
} from "@web/components/charts/shared";
import { Line, LineChart } from "recharts";

describe("Chart shared helpers", () => {
  it("formats currency tooltip content with matching colour indicator", () => {
    const fragment = currencyTooltipFormatter({
      value: 123456,
      name: "COE Premium",
      index: 0,
    });

    render(<div>{fragment}</div>);
    expect(screen.getByText("COE Premium")).toBeInTheDocument();
    expect(screen.getByText("$123,456")).toBeInTheDocument();
  });

  it("renders axis helpers without crashing", () => {
    render(
      <LineChart
        width={400}
        height={200}
        data={[{ month: "2024-01", price: 50000 }]}
      >
        <PriceYAxis />
        <MonthXAxis tickFormatter={(value) => value} />
        <Line dataKey="price" stroke="#000" />
      </LineChart>,
    );

    expect(document.querySelector("svg")).toBeTruthy();
  });

  it("renders a chart description section", () => {
    render(
      <ChartDescriptionSection
        title="Trend insight"
        description="COE premiums are stabilising."
      />,
    );

    expect(screen.getByText("Trend insight")).toBeInTheDocument();
    expect(
      screen.getByText("COE premiums are stabilising."),
    ).toBeInTheDocument();
  });
});
