"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import useStore from "@web/app/store";
import Typography from "@web/components/typography";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@web/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

interface YearlyData {
  year: number;
  total: number;
}

interface Props {
  data: YearlyData[];
}

interface YearOverYearChartProps {
  data: YearlyData[];
  numberFormatter: Intl.NumberFormat;
}

interface TrendChartProps {
  data: YearlyData[];
  chartColor: string;
  ariaLabel: string;
}

const YearOverYearChart = ({
  data,
  numberFormatter,
}: YearOverYearChartProps) => {
  const yoySeries = useMemo(
    () =>
      data
        .map((d, i) => {
          const prev = data[i - 1];
          if (!prev) return null;
          return { year: d.year, change: d.total - prev.total };
        })
        .filter(Boolean) as { year: number; change: number }[],
    [data],
  );

  const recent = useMemo(() => yoySeries.slice(-10), [yoySeries]);

  if (recent.length === 0) return null;

  const chartConfig = {
    plus: { color: "var(--success)" },
    minus: { color: "var(--destructive)" },
  } as const;

  return (
    <div className="mt-3">
      <ChartContainer
        config={chartConfig}
        className="h-[300px] w-full"
        aria-label="YoY change bar chart last 10"
      >
        <BarChart data={recent} margin={{ left: 8, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <ReferenceLine
            y={0}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="3 3"
          />
          <Bar dataKey="change">
            {recent.map((d) => (
              <Cell
                key={d.year}
                fill={
                  d.change >= 0 ? "var(--color-plus)" : "var(--color-minus)"
                }
              />
            ))}
            <LabelList
              dataKey="change"
              position="top"
              className="fill-foreground font-mono text-[10px]"
              formatter={(v: number) => numberFormatter.format(v)}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};

const TrendChart = ({ data, chartColor, ariaLabel }: TrendChartProps) => {
  const recent = useMemo(() => data.slice(-10), [data]);

  if (recent.length < 2) {
    return (
      <div className="mt-3">
        <Typography.Caption>Not enough data to draw trend</Typography.Caption>
      </div>
    );
  }

  const chartConfig = {
    total: { label: "Total", color: "var(--primary)" },
  } as const;

  return (
    <div className="mt-3">
      <ChartContainer
        config={chartConfig}
        className="h-[300px] w-full"
        aria-label={ariaLabel}
      >
        <AreaChart data={recent} margin={{ left: 8, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Area
            dataKey="total"
            type="monotone"
            stroke={`var(--color-total, ${chartColor})`}
            fill={`var(--color-total, ${chartColor})`}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export const KeyStatistics = ({ data }: Props) => {
  const selectedYear = useStore(({ selectedYear }) => selectedYear);
  const setSelectedYear = useStore(({ setSelectedYear }) => setSelectedYear);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-SG"), []);
  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-SG", {
        style: "percent",
        signDisplay: "always",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [],
  );

  const sortedByYearAsc = useMemo(
    () => [...data].sort((a, b) => a.year - b.year),
    [data],
  );
  const sortedByYearDesc = useMemo(
    () => [...data].sort((a, b) => b.year - a.year),
    [data],
  );

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const comparableAsc = useMemo(
    () => sortedByYearAsc.filter((d) => d.year !== currentYear),
    [sortedByYearAsc, currentYear],
  );
  const comparableTotalDesc = useMemo(
    () => [...comparableAsc].sort((a, b) => b.total - a.total),
    [comparableAsc],
  );

  const selectedYearNumber = useMemo(
    () => Number(selectedYear),
    [selectedYear],
  );
  const selectedEntry = useMemo(
    () => sortedByYearAsc.find((item) => item.year === selectedYearNumber),
    [sortedByYearAsc, selectedYearNumber],
  );
  const previousEntry = useMemo(
    () => sortedByYearAsc.find((item) => item.year === selectedYearNumber - 1),
    [sortedByYearAsc, selectedYearNumber],
  );
  const highestEntry = comparableTotalDesc[0];
  const lowestEntry = comparableTotalDesc[comparableTotalDesc.length - 1];

  const yoyChange = useMemo(
    () =>
      selectedEntry && previousEntry
        ? selectedEntry.total - previousEntry.total
        : null,
    [selectedEntry, previousEntry],
  );
  const yoyChangeRatio = useMemo(
    () =>
      yoyChange !== null && previousEntry?.total
        ? previousEntry.total === 0
          ? null
          : yoyChange / previousEntry.total
        : null,
    [yoyChange, previousEntry],
  );

  const yoyToneClass = useMemo(() => {
    if (yoyChangeRatio === null) return "text-muted-foreground";
    if (yoyChangeRatio > 0) return "text-emerald-600";
    if (yoyChangeRatio < 0) return "text-destructive";
    return "text-muted-foreground";
  }, [yoyChangeRatio]);

  return (
    <div className="flex flex-col gap-4">
      <Typography.H2>Key Statistics</Typography.H2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Typography.TextSm>
              Explore the last {data.length} years of registrations
            </Typography.TextSm>
            <div className="font-semibold text-xl">
              {selectedEntry
                ? numberFormatter.format(selectedEntry.total)
                : "—"}
              <Typography.TextSm>
                total registrations in {selectedYear || "—"}
              </Typography.TextSm>
            </div>
          </div>
          <Select
            onValueChange={(year) => setSelectedYear(year)}
            value={selectedYear}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {sortedByYearDesc.map((item) => (
                <SelectItem key={item.year} value={item.year.toString()}>
                  {item.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>Year-over-year change</CardHeader>
            <CardBody>
              <p className="mt-2 font-semibold text-2xl">
                {yoyChange !== null ? numberFormatter.format(yoyChange) : "—"}
              </p>
              <Typography.Caption
                className={`mt-1 font-medium ${yoyToneClass}`}
              >
                {yoyChangeRatio !== null
                  ? `${percentFormatter.format(yoyChangeRatio)} vs ${
                      previousEntry?.year ?? "previous"
                    }`
                  : previousEntry
                    ? "Cannot calculate percentage change from a zero baseline"
                    : "No data for the previous year"}
              </Typography.Caption>
              {comparableAsc.length > 1 && (
                <YearOverYearChart
                  data={comparableAsc}
                  numberFormatter={numberFormatter}
                />
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Highest year on record</CardHeader>
            <CardBody>
              <p className="mt-2 font-semibold text-2xl">
                {highestEntry
                  ? numberFormatter.format(highestEntry.total)
                  : "—"}
              </p>
              <Typography.Caption>
                {highestEntry ? `Set in ${highestEntry.year}` : "No data"}
              </Typography.Caption>
              {comparableAsc.length > 1 && (
                <TrendChart
                  data={comparableAsc}
                  chartColor="hsl(var(--chart-1))"
                  ariaLabel="Trend to highest year"
                />
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Lowest year on record</CardHeader>
            <CardBody>
              <p className="mt-2 font-semibold text-2xl">
                {lowestEntry ? numberFormatter.format(lowestEntry.total) : "—"}
              </p>
              <Typography.Caption>
                {lowestEntry ? `Set in ${lowestEntry.year}` : "No data"}
              </Typography.Caption>
              {comparableAsc.length > 1 && (
                <TrendChart
                  data={comparableAsc}
                  chartColor="hsl(var(--chart-3))"
                  ariaLabel="Trend to lowest year"
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
