"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { numberFormat } from "@ruchernchong/number-format";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import type { Pqp } from "@web/types/coe";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface Props {
  data: Pqp.TrendPoint[];
}

const chartConfig: ChartConfig = {};

export function TrendsChart({ data }: Props) {
  return (
    <Card className="p-3">
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
          <LineChart data={data}>
            <CartesianGrid />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => formatDateToMonthYear(value)}
            />
            <YAxis
              domain={[
                (dataMin: number) => Math.floor(dataMin / 10000) * 10000,
                (dataMax: number) => Math.ceil(dataMax / 10000) * 10000,
              ]}
              tickFormatter={numberFormat}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="Category A"
              name="Category A"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
            />
            <Line
              dataKey="Category B"
              name="Category B"
              type="monotone"
              stroke="var(--chart-2)"
              strokeWidth={2}
            />
            <ChartLegend />
          </LineChart>
        </ChartContainer>
      </CardBody>
      <CardFooter>
        <p className="text-default-500 text-sm">
          Historical PQP rates (3-month average COE prices) used for COE
          renewals across categories.
        </p>
      </CardFooter>
    </Card>
  );
}
