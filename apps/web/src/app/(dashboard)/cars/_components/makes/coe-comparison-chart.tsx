"use client";

import { numberFormat } from "@ruchernchong/number-format";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { ChartDescriptionSection } from "@web/components/charts/shared";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: MakeCoeComparisonData[];
}

const chartConfig = {
  registrations: {
    label: "Registrations",
    color: "var(--chart-1)",
  },
  categoryAPremium: {
    label: "Category A Premium",
    color: "var(--chart-2)",
  },
  categoryBPremium: {
    label: "Category B Premium",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export const CoeComparisonChart = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <ComposedChart
          accessibilityLayer
          data={data}
          aria-label="Dual-axis chart comparing monthly registrations with COE Category A and B premiums"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={formatDateToMonthYear}
            tickMargin={8}
          />

          {/* Left Y-axis for registrations */}
          <YAxis yAxisId="registrations" type="number" orientation="left">
            <Label
              value="Registrations"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          {/* Right Y-axis for COE premiums */}
          <YAxis
            yAxisId="premium"
            orientation="right"
            domain={[
              (dataMin: number) => Math.floor(dataMin / 10000) * 10000,
              (dataMax: number) => Math.ceil(dataMax / 10000) * 10000,
            ]}
            tickFormatter={numberFormat}
          >
            <Label
              value="COE Premium (S$)"
              angle={90}
              position="insideRight"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar
            dataKey="registrations"
            yAxisId="registrations"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />

          <Line
            dataKey="categoryAPremium"
            yAxisId="premium"
            type="monotone"
            dot={false}
            stroke="var(--chart-1)"
            strokeWidth={2}
          />

          <Line
            dataKey="categoryBPremium"
            yAxisId="premium"
            type="monotone"
            dot={false}
            stroke="var(--chart-2)"
            strokeWidth={2}
            strokeDasharray="10 10"
          />

          <ChartLegend />
        </ComposedChart>
      </ChartContainer>

      <ChartDescriptionSection description="Registration bars (left axis) show monthly vehicle purchases, while COE premium lines (right axis) display Category A and B prices. Rising premiums typically correlate with increased demand, though luxury makes may respond differently to Category B changes versus mass-market makes to Category A." />
    </div>
  );
};
