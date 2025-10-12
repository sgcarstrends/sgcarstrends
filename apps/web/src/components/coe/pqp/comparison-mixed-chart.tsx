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
  data: Pqp.Comparison[];
}

const chartConfig: ChartConfig = {};

export const ComparisonMixedChart = ({ data }: Props) => {
  return (
    <Card className="p-4">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg">
            Latest COE Premium vs PQP Rate
          </h3>
          <p className="text-default-500 text-sm">
            Comparison of latest COE bidding premium against current PQP rates
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ComposedChart
            data={data}
            aria-label="COE Premium vs PQP Rate comparison"
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[
                (dataMin: number) => Math.floor(dataMin / 10000) * 10000,
                (dataMax: number) => Math.ceil(dataMax / 10000) * 10000,
              ]}
              tickFormatter={numberFormat}
              axisLine={false}
              tickLine={false}
            >
              <Label
                value="Premium (S$)"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value: any, name) => (
                    <>
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
            <Bar
              dataKey="latestPremium"
              name="Latest COE Premium"
              fill="var(--chart-1)"
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
            />
            <Line
              dataKey="pqpRate"
              name="PQP Rate (Baseline)"
              type="monotone"
              stroke="var(--chart-2)"
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={{
                fill: "var(--chart-2)",
                strokeWidth: 2,
                r: 5,
                stroke: "#fff",
              }}
            />
            <ChartLegend />
          </ComposedChart>
        </ChartContainer>
        <div className="mt-4">
          <div className="text-default-500 text-sm">
            <h4 className="mb-2 font-semibold text-foreground">
              Chart Description
            </h4>
            <p>
              Latest COE premium (bars) vs PQP baseline (dashed line). Bars
              above line indicate strong demand; bars below suggest favourable
              renewal conditions.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
