"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { numberFormat } from "@ruchernchong/number-format";
import { addYears, format, parse, subMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from "recharts";
import useStore from "@/app/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateToMonthYear } from "@/utils/format-date-to-month-year";
import type { COEBiddingResult, COECategory, Month } from "@/types";

interface Props {
  data: COEBiddingResult[];
  months: Month[];
}

interface TimeRange {
  timeRange: string;
  label: string;
}

const LAST_12_MONTHS = (30 * 12).toString();
const LAST_5_YEARS = (5 * 30 * 12).toString();
const LAST_10_YEARS = (10 * 30 * 12).toString();

const TIME_RANGES: TimeRange[] = [
  { timeRange: LAST_12_MONTHS, label: "Last 12 Months" },
  { timeRange: LAST_5_YEARS, label: "Last 5 Years" },
  { timeRange: LAST_10_YEARS, label: "Last 10 Years" },
  { timeRange: "YTD", label: "Year to Date" },
  { timeRange: "ALL", label: "All Time" },
];

export const COEPremiumChart = ({ data, months }: Props) => {
  const categories = useStore((state) => state.categories);
  const [timeRange, setTimeRange] = useState(LAST_12_MONTHS);
  const latestMonth = months[0];
  const earliestMonth = months[months.length - 1];

  const dateOneYearAgo = format(addYears(latestMonth, -1), "yyyy-MM");

  const [, setStart] = useQueryState("start", {
    defaultValue: dateOneYearAgo,
    shallow: false,
  });
  const [, setEnd] = useQueryState("end", {
    defaultValue: latestMonth,
    shallow: false,
  });

  const updateRouterWithTimeRange = useCallback(() => {
    const formatMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2); // Note: getMonth() returns 0-based month
      return `${year}-${month}`;
    };

    const timeRangesMap: Record<string, number> = {
      [LAST_12_MONTHS]: 12,
      [LAST_5_YEARS]: 5 * 12,
      [LAST_10_YEARS]: 10 * 12,
      YTD: 0,
      ALL: Number.POSITIVE_INFINITY,
    };

    const currentYear = new Date().getFullYear();
    const formatDate = (month: string, duration: number) =>
      formatMonth(subMonths(parse(month, "yyyy-MM", new Date()), duration));

    const duration = timeRangesMap[timeRange as keyof typeof timeRangesMap];
    const setFromDate = () => {
      switch (timeRange) {
        case "YTD":
          return `${currentYear}-01`;
        case "ALL":
          return earliestMonth;
        default:
          return formatDate(latestMonth, duration);
      }
    };

    void setStart(setFromDate());
    void setEnd(latestMonth);
  }, [earliestMonth, latestMonth, setStart, setEnd, timeRange]);

  useEffect(() => {
    updateRouterWithTimeRange();
  }, [updateRouterWithTimeRange]);

  const filteredData = useMemo(() => {
    return data.map((item) =>
      Object.entries(item).reduce((acc: Record<string, any>, [key, value]) => {
        if (
          key === "month" ||
          (key.startsWith("Category") && categories[key as COECategory])
        ) {
          acc[key] = value;
        }
        return acc;
      }, {}),
    );
  }, [categories, data]);

  const chartConfig: ChartConfig = {};

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 border-b lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-1">
          <CardTitle>Quota Premium ($)</CardTitle>
          <CardDescription>
            {`Showing ${TIME_RANGES.find((range) => range.timeRange === timeRange)?.label.toLowerCase()} of COE prices`}
          </CardDescription>
        </div>
        <div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="rounded-lg sm:ml-auto">
              <SelectValue placeholder="Last 12 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {TIME_RANGES.map(({ timeRange, label }) => (
                <SelectItem
                  key={timeRange}
                  value={timeRange}
                  className="rounded-lg"
                >
                  <div className="flex items-center rounded-lg">
                    <CalendarIcon className="mr-2 size-4" />
                    {label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            data={filteredData}
            aria-label={`COE premium trends chart showing ${TIME_RANGES.find((range) => range.timeRange === timeRange)?.label.toLowerCase()} data for selected categories`}
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
                value="Quota Premium (S$)"
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
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-medium tabular-nums">
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
            {Object.entries(categories)
              .filter(([, value]) => value)
              .map(([category], index) => (
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
        <div className="mt-4 space-y-3">
          <div className="text-muted-foreground text-sm">
            <h4 className="text-foreground mb-2 font-semibold">
              Chart Description
            </h4>
            <p>
              This chart displays Certificate of Entitlement (COE) premium
              trends over{" "}
              {TIME_RANGES.find(
                (range) => range.timeRange === timeRange,
              )?.label.toLowerCase()}
              . COE premiums represent the cost of obtaining the right to own
              and operate a vehicle in Singapore for 10 years. Higher premiums
              typically indicate increased demand for vehicles or reduced quota
              availability.
            </p>
          </div>
          <div className="bg-muted/30 grid grid-cols-1 gap-3 rounded-lg p-3 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-foreground text-lg font-semibold">
                {filteredData.length > 0 ? filteredData.length : 0}
              </div>
              <div className="text-muted-foreground text-xs">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-foreground text-lg font-semibold">
                {Object.entries(categories).filter(([, value]) => value).length}
              </div>
              <div className="text-muted-foreground text-xs">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-foreground text-lg font-semibold">
                {timeRange === "ALL"
                  ? "All Time"
                  : TIME_RANGES.find((range) => range.timeRange === timeRange)
                      ?.label || "Custom"}
              </div>
              <div className="text-muted-foreground text-xs">Time Range</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
