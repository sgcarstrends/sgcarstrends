"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface YearTotal {
  year: number;
  total: number;
}

interface RegistrationTrendProps {
  data: YearTotal[];
}

export const RegistrationTrend = ({ data }: RegistrationTrendProps) => {
  const chartConfig = {
    total: {
      label: "Total",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <h3>Yearly Registration Trend</h3>
      </CardHeader>
      <CardBody>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="total"
              type="number"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line dataKey="total" fill="var(--primary)" />
          </LineChart>
        </ChartContainer>
      </CardBody>
    </Card>
  );
};
