"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  ChartDescriptionSection,
  currencyTooltipFormatter,
  MonthXAxis,
  PriceYAxis,
} from "@web/components/charts/shared-chart-components";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@web/components/ui/chart";
import type { Pqp } from "@web/types/coe";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { CartesianGrid, Line, LineChart } from "recharts";

interface Props {
  data: Pqp.TrendPoint[];
}

const chartConfig: ChartConfig = {};

export const TrendsChart = ({ data }: Props) => {
  return (
    <Card className="p-4">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg">PQP Trends</h3>
          <p className="text-default-500 text-sm">
            Historical Prevailing Quota Premium rates across all COE categories
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={data}
            aria-label="COE PQP trends chart showing historical Prevailing Quota Premium rates"
          >
            <CartesianGrid />
            <MonthXAxis tickFormatter={formatDateToMonthYear} />
            <PriceYAxis label="PQP Rate (S$)" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={formatDateToMonthYear}
                  formatter={(value, name, _, index) =>
                    currencyTooltipFormatter({
                      value:
                        typeof value === "number"
                          ? value
                          : Number.parseFloat(String(value)),
                      name,
                      index,
                    })
                  }
                />
              }
            />
            <Line
              dataKey="Category A"
              name="Category A"
              type="natural"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="Category B"
              name="Category B"
              type="natural"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend />
          </LineChart>
        </ChartContainer>
        <ChartDescriptionSection description="Historical PQP rates (3-month average COE prices) used for COE renewals across categories." />
      </CardBody>
    </Card>
  );
};
