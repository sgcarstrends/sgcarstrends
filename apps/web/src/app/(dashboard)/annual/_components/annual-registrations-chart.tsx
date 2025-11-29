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
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

interface YearlyData {
  year: number;
  total: number;
}

interface Props {
  data: YearlyData[];
}

export const AnnualRegistrationsChart = ({ data }: Props) => {
  const [{ year }, setSearchParams] = useQueryStates(searchParams);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-SG"), []);

  const chartData = useMemo(
    () => [...data].sort((a, b) => a.year - b.year),
    [data],
  );

  const sortedByYearDesc = useMemo(
    () => [...data].sort((a, b) => b.year - a.year),
    [data],
  );

  const selectedEntry = useMemo(
    () => chartData.find((item) => item.year === year),
    [chartData, year],
  );

  const chartConfig = {
    total: { label: "Registrations", color: "var(--primary)" },
  } as const;

  const handleBarClick = (entry: YearlyData) => {
    if (year === entry.year) {
      setSearchParams({ year: null });
    } else {
      setSearchParams({ year: entry.year });
    }
  };

  const handleSelectionChange = (key: React.Key | null) => {
    if (key) {
      setSearchParams({ year: Number(key) });
    }
  };

  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Typography.H3>Total New Car Registrations by Year</Typography.H3>
          {selectedEntry && (
            <Typography.Text className="text-default-500">
              {numberFormatter.format(selectedEntry.total)} registrations in{" "}
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
          defaultItems={sortedByYearDesc.map((item) => ({
            key: String(item.year),
            label: String(item.year),
          }))}
        >
          {(item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      </CardHeader>
      <CardBody>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart data={chartData}>
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
              onClick={(_, index) => handleBarClick(chartData[index])}
              className="cursor-pointer"
            >
              {chartData.map((entry) => (
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
};
