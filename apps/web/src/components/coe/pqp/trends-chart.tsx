"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { numberFormat } from "@ruchernchong/number-format";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@web/components/ui/chart";
import type { Pqp } from "@web/types/coe";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import type { CSSProperties } from "react";
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from "recharts";

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
            <XAxis
              dataKey="month"
              tickFormatter={formatDateToMonthYear}
              axisLine={false}
            />
            <YAxis
              domain={[
                (dataMin: number) => Math.floor(dataMin / 10000) * 10000,
                (dataMax: number) => Math.ceil(dataMax / 10000) * 10000,
              ]}
              tickFormatter={numberFormat}
              axisLine={false}
              hide
            >
              <Label
                value="PQP Rate (S$)"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={formatDateToMonthYear}
                  formatter={(value: any, name, _, index) => (
                    <>
                      <div
                        className="size-2.5 shrink-0 rounded-[2px] bg-(--colour-bg)"
                        style={
                          {
                            "--colour-bg": `var(--chart-${index + 1})`,
                          } as CSSProperties
                        }
                      />
                      {name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-medium text-foreground tabular-nums">
                        {new Intl.NumberFormat("en-SG", {
                          style: "currency",
                          currency: "SGD",
                          minimumFractionDigits: 0,
                        }).format(value)}
                      </div>
                    </>
                  )}
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
        <div className="mt-4">
          <div className="text-default-500 text-sm">
            <h4 className="mb-2 font-semibold text-foreground">
              Chart Description
            </h4>
            <p>
              Historical PQP rates (3-month average COE prices) used for COE
              renewals across categories.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
