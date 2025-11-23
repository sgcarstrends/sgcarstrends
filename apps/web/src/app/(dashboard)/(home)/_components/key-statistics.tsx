"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sgcarstrends/ui/components/select";
import Typography from "@web/components/typography";
import { MonthlyTrendChart } from "./monthly-trend-chart";
import { useKeyStatistics } from "./use-key-statistics";
import { YearOverYearChart } from "./year-over-year-chart";

interface YearlyData {
  year: number;
  total: number;
}

interface Props {
  data: YearlyData[];
}

export const KeyStatistics = ({ data }: Props) => {
  const {
    selectedYear,
    setSelectedYear,
    numberFormatter,
    percentFormatter,
    sortedByYearDesc,
    comparableAsc,
    selectedEntry,
    previousEntry,
    highestEntry,
    lowestEntry,
    yoyChange,
    yoyChangeRatio,
    yoyToneClass,
  } = useKeyStatistics(data);

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
            <CardBody className="flex flex-col gap-2">
              <p className="font-semibold text-2xl">
                {yoyChange !== null ? numberFormatter.format(yoyChange) : "—"}
              </p>
              <Typography.Caption className={`font-medium ${yoyToneClass}`}>
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
            <CardBody className="flex flex-col gap-2">
              <p className="font-semibold text-2xl">
                {highestEntry
                  ? numberFormatter.format(highestEntry.total)
                  : "—"}
              </p>
              <Typography.Caption>
                {highestEntry ? `Set in ${highestEntry.year}` : "No data"}
              </Typography.Caption>
              {comparableAsc.length > 1 && (
                <MonthlyTrendChart
                  data={comparableAsc}
                  chartColor="hsl(var(--chart-1))"
                  ariaLabel="Trend to highest year"
                />
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Lowest year on record</CardHeader>
            <CardBody className="flex flex-col gap-2">
              <p className="font-semibold text-2xl">
                {lowestEntry ? numberFormatter.format(lowestEntry.total) : "—"}
              </p>
              <Typography.Caption>
                {lowestEntry ? `Set in ${lowestEntry.year}` : "No data"}
              </Typography.Caption>
              {comparableAsc.length > 1 && (
                <MonthlyTrendChart
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
