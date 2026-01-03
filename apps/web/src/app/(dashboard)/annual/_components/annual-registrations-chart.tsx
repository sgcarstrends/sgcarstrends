"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { searchParams } from "@web/app/(dashboard)/annual/search-params";
import Typography from "@web/components/typography";
import { useQueryStates } from "nuqs";
import type React from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

interface YearlyData {
  year: number;
  total: number;
}

interface AnnualRegistrationsChartProps {
  data: YearlyData[];
  availableYears: { year: number }[];
}

export function AnnualRegistrationsChart({
  data,
  availableYears,
}: AnnualRegistrationsChartProps) {
  const [{ year }, setSearchParams] = useQueryStates(searchParams);

  const numberFormatter = new Intl.NumberFormat("en-SG");
  const selectedYear = data.find((item) => item.year === year);

  const chartConfig = {
    total: { label: "Registrations", color: "var(--primary)" },
  } as const;

  const handleBarClick = async (entry: YearlyData) => {
    await setSearchParams({ year: entry.year });
  };

  const handleSelectionChange = async (key: React.Key | null) => {
    if (key) {
      await setSearchParams({ year: Number(key) });
    }
  };

  return (
    <Card className="p-3">
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Typography.H3>Total New Car Registrations by Year</Typography.H3>
          {selectedYear && (
            <Typography.Text className="text-default-500">
              {numberFormatter.format(selectedYear.total)} registrations in{" "}
              {year}
            </Typography.Text>
          )}
        </div>
        <Autocomplete
          label="Year"
          variant="bordered"
          className="max-w-xs"
          selectedKey={String(year)}
          onSelectionChange={handleSelectionChange}
          defaultItems={availableYears.map((item) => ({
            key: String(item.year),
            label: String(item.year),
          }))}
        >
          {(item) => {
            return (
              <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
            );
          }}
        </Autocomplete>
      </CardHeader>
      <CardBody>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart data={data}>
            <defs>
              <linearGradient id="selectedGradient" x1="0" y1="1" x2="0" y2="0">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--heroui-primary) / 0.4)"
                />
                <stop offset="100%" stopColor="hsl(var(--heroui-primary))" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => numberFormatter.format(value)}
              width={70}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              content={
                <ChartTooltipContent
                  formatter={(value) => numberFormatter.format(value as number)}
                />
              }
            />
            <Bar
              dataKey="total"
              radius={[8, 8, 0, 0]}
              onClick={(_, index) => handleBarClick(data[index])}
              className="cursor-pointer"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.year}
                  fill={
                    year === entry.year
                      ? "url(#selectedGradient)"
                      : "hsl(var(--heroui-default-200))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardBody>
      <CardFooter>
        <Typography.TextSm className="text-default-500">
          Click on a bar to select a year, or use the dropdown above to filter
          the data
        </Typography.TextSm>
      </CardFooter>
    </Card>
  );
}
