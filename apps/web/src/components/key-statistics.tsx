"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import useStore from "@web/app/store";
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

interface Props {
  data: { year: number; total: number }[];
}

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

  const currentYear = new Date().getFullYear();
  const comparableAsc = useMemo(
    () => sortedByYearAsc.filter((d) => d.year !== currentYear),
    [sortedByYearAsc, currentYear],
  );
  const comparableTotalDesc = useMemo(
    () => [...comparableAsc].sort((a, b) => b.total - a.total),
    [comparableAsc],
  );

  const selectedYearNumber = Number(selectedYear);
  const selectedEntry = sortedByYearAsc.find(
    (item) => item.year === selectedYearNumber,
  );
  const previousEntry = sortedByYearAsc.find(
    (item) => item.year === selectedYearNumber - 1,
  );
  const highestEntry = comparableTotalDesc[0];
  const lowestEntry = comparableTotalDesc[comparableTotalDesc.length - 1];

  const yoyChange =
    selectedEntry && previousEntry
      ? selectedEntry.total - previousEntry.total
      : null;
  const yoyChangeRatio =
    yoyChange !== null && previousEntry?.total
      ? previousEntry.total === 0
        ? null
        : yoyChange / previousEntry.total
      : null;

  const yoyToneClass =
    yoyChangeRatio !== null
      ? yoyChangeRatio > 0
        ? "text-emerald-600"
        : yoyChangeRatio < 0
          ? "text-destructive"
          : "text-muted-foreground"
      : "text-muted-foreground";

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-2xl">Key Statistics</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-medium text-muted-foreground text-sm">
              Explore the last {data.length} years of registrations
            </p>
            <p className="font-semibold text-xl">
              {selectedEntry
                ? numberFormatter.format(selectedEntry.total)
                : "—"}
              <span className="ml-2 font-normal text-muted-foreground text-sm">
                total registrations in {selectedYear || "—"}
              </span>
            </p>
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
              <p className={`mt-1 font-medium text-xs ${yoyToneClass}`}>
                {yoyChangeRatio !== null
                  ? `${percentFormatter.format(yoyChangeRatio)} vs ${
                      previousEntry?.year ?? "previous"
                    }`
                  : previousEntry
                    ? "Cannot calculate percentage change from a zero baseline"
                    : "No data for the previous year"}
              </p>
              {comparableAsc.length > 1 ? (
                <div className="mt-3">
                  {(() => {
                    const yoySeries = comparableAsc
                      .map((d, i) => {
                        const prev = comparableAsc[i - 1];
                        if (!prev) return null;
                        return { year: d.year, change: d.total - prev.total };
                      })
                      .filter(Boolean) as { year: number; change: number }[];
                    const recent = yoySeries.slice(-10);
                    if (recent.length === 0) return null;
                    const chartConfig = {
                      plus: { color: "var(--success)" },
                      minus: { color: "var(--destructive)" },
                    } as const;
                    return (
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
                                  d.change >= 0
                                    ? "var(--color-plus)"
                                    : "var(--color-minus)"
                                }
                              />
                            ))}
                            <LabelList
                              dataKey="change"
                              position="top"
                              className="fill-foreground font-mono text-[10px]"
                              formatter={(v: number) =>
                                numberFormatter.format(v)
                              }
                            />
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    );
                  })()}
                </div>
              ) : null}
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
              <p className="mt-1 text-muted-foreground text-xs">
                {highestEntry ? `Set in ${highestEntry.year}` : "No data"}
              </p>
              {comparableAsc.length > 1 ? (
                <div className="mt-3">
                  {(() => {
                    const recent = comparableAsc.slice(-10);
                    if (recent.length < 2) {
                      return (
                        <p className="text-muted-foreground text-xs">
                          Not enough data to draw trend
                        </p>
                      );
                    }
                    const chartConfig = {
                      total: { label: "Total", color: "var(--primary)" },
                    } as const;
                    return (
                      <ChartContainer
                        config={chartConfig}
                        className="h-[300px] w-full"
                        aria-label="Trend to highest year"
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
                            stroke="var(--color-total, hsl(var(--chart-1)))"
                            fill="var(--color-total, hsl(var(--chart-1)))"
                            fillOpacity={0.15}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ChartContainer>
                    );
                  })()}
                </div>
              ) : null}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Lowest year on record</CardHeader>
            <CardBody>
              <p className="mt-2 font-semibold text-2xl">
                {lowestEntry ? numberFormatter.format(lowestEntry.total) : "—"}
              </p>
              <p className="mt-1 text-muted-foreground text-xs">
                {lowestEntry ? `Set in ${lowestEntry.year}` : "No data"}
              </p>
              {comparableAsc.length > 1 ? (
                <div className="mt-3">
                  {(() => {
                    const recent = comparableAsc.slice(-10);
                    if (recent.length < 2) {
                      return (
                        <p className="text-muted-foreground text-xs">
                          Not enough data to draw trend
                        </p>
                      );
                    }
                    const chartConfig = {
                      total: { label: "Total", color: "var(--primary)" },
                    } as const;
                    return (
                      <ChartContainer
                        config={chartConfig}
                        className="h-[300px] w-full"
                        aria-label="Trend to lowest year"
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
                            stroke="var(--color-total, hsl(var(--chart-3)))"
                            fill="var(--color-total, hsl(var(--chart-3)))"
                            fillOpacity={0.15}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ChartContainer>
                    );
                  })()}
                </div>
              ) : null}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
