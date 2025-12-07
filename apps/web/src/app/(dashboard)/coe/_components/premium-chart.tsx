"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { type Period, periods } from "@web/app/(dashboard)/coe/search-params";
import {
  currencyTooltipFormatter,
  MonthXAxis,
  PriceYAxis,
} from "@web/components/charts/shared";
import type { COEBiddingResult } from "@web/types";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { CalendarIcon } from "lucide-react";
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart } from "recharts";

interface Props {
  data: COEBiddingResult[];
}

const PERIOD_LABELS: Record<Period, string> = {
  "12m": "Last 12 Months",
  "5y": "Last 5 Years",
  "10y": "Last 10 Years",
  ytd: "Year to Date",
  all: "All Time",
};

const defaultCategories = ["Category A", "Category B", "Category E"];

export const COEPremiumChart = ({ data }: Props) => {
  const [period, setPeriod] = useQueryState(
    "period",
    parseAsStringLiteral(periods)
      .withDefault("12m")
      .withOptions({ shallow: false }),
  );
  const [categories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault(defaultCategories),
  );

  const filteredData = useMemo(() => {
    return data.map((item) =>
      Object.entries(item).reduce(
        (acc: Record<string, unknown>, [key, value]) => {
          if (
            key === "month" ||
            (key.startsWith("Category") && categories.includes(key))
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {},
      ),
    );
  }, [categories, data]);

  const chartConfig: ChartConfig = {};

  const periodLabel = PERIOD_LABELS[period].toLowerCase();

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 border-b lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-1">
          <h3 className="font-medium text-foreground text-xl">
            Quota Premium ($)
          </h3>
          <p className="text-default-600 text-sm">
            {`Showing ${periodLabel} of COE prices`}
          </p>
        </div>
        <Select
          aria-label="Select time period"
          placeholder="Last 12 months"
          className="max-w-xs"
          selectedKeys={new Set([period])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (selected) setPeriod(selected as Period);
          }}
          startContent={<CalendarIcon className="size-4" />}
        >
          {periods.map((p) => (
            <SelectItem key={p}>{PERIOD_LABELS[p]}</SelectItem>
          ))}
        </Select>
      </CardHeader>
      <CardBody className="p-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            data={filteredData}
            aria-label={`COE premium trends chart showing ${periodLabel} data for selected categories`}
          >
            <CartesianGrid />
            <MonthXAxis tickFormatter={formatDateToMonthYear} />
            <PriceYAxis label="Quota Premium (S$)" hide />
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
            {categories.map((category, index) => (
              <Line
                key={category}
                dataKey={category}
                name={category}
                type="natural"
                stroke={`var(--chart-${index + 1})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
            <ChartLegend />
          </LineChart>
        </ChartContainer>
      </CardBody>
    </Card>
  );
};
