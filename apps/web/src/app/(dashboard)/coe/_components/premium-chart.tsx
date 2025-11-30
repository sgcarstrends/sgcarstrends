"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sgcarstrends/ui/components/select";
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
          <CardTitle>Quota Premium ($)</CardTitle>
          <CardDescription>
            {`Showing ${periodLabel} of COE prices`}
          </CardDescription>
        </div>
        <div>
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as Period)}
          >
            <SelectTrigger className="rounded-lg sm:ml-auto">
              <SelectValue placeholder="Last 12 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {periods.map((p) => (
                <SelectItem key={p} value={p} className="rounded-lg">
                  <div className="flex items-center rounded-lg">
                    <CalendarIcon className="mr-2 size-4" />
                    {PERIOD_LABELS[p]}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6">
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
        <div className="flex flex-col gap-4">
          <div className="text-muted-foreground text-sm">
            <h4 className="mb-2 font-semibold text-foreground">
              Chart Description
            </h4>
            <p>
              This chart displays Certificate of Entitlement (COE) premium
              trends over {periodLabel}. COE premiums represent the cost of
              obtaining the right to own and operate a vehicle in Singapore for
              10 years. Higher premiums typically indicate increased demand for
              vehicles or reduced quota availability.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted/30 p-3 sm:grid-cols-3">
            <div className="text-center">
              <div className="font-semibold text-foreground text-lg">
                {filteredData.length > 0 ? filteredData.length : 0}
              </div>
              <div className="text-muted-foreground text-xs">Data Points</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground text-lg">
                {categories.length}
              </div>
              <div className="text-muted-foreground text-xs">Categories</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground text-lg">
                {PERIOD_LABELS[period]}
              </div>
              <div className="text-muted-foreground text-xs">Time Range</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
