"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import {
  type ChartConfig,
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
import { format, startOfYear, subDays, subMonths, subYears } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback, useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface Props {
  data: Array<{
    date: string;
    count: number;
  }>;
  onDateRangeChange?: (start: string, end: string) => void;
  isLoading?: boolean;
}

interface TimeRange {
  value: string;
  label: string;
}

const TIME_RANGES: TimeRange[] = [
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last Quarter" },
  { value: "180", label: "Last 6 Months" },
  { value: "365", label: "Last Year" },
  { value: "YTD", label: "Year to Date" },
  { value: "ALL", label: "All Time" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  count: {
    label: "Count",
  },
} satisfies ChartConfig;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const VisitorTrendsChart = ({
  data,
  onDateRangeChange,
  isLoading = false,
}: Props) => {
  const [start, setStart] = useQueryState("start", {
    defaultValue: "",
    shallow: false,
  });
  const [end, setEnd] = useQueryState("end", {
    defaultValue: "",
    shallow: false,
  });

  const getCurrentSelection = useCallback(() => {
    if (!start && !end) return "ALL";

    const today = new Date();
    const formatDateString = (date: Date) => format(date, "yyyy-MM-dd");

    // Check if it matches any of our presets
    const startOfYearStr = formatDateString(startOfYear(today));
    const todayStr = formatDateString(today);

    if (start === startOfYearStr && end === todayStr) return "YTD";
    if (start === formatDateString(subYears(today, 1)) && end === todayStr)
      return "365";
    if (start === formatDateString(subMonths(today, 6)) && end === todayStr)
      return "180";
    if (start === formatDateString(subDays(today, 90)) && end === todayStr)
      return "90";
    if (start === formatDateString(subDays(today, 30)) && end === todayStr)
      return "30";

    return "CUSTOM";
  }, [start, end]);

  const getSelectionLabel = useCallback(() => {
    const selection = getCurrentSelection();
    if (selection === "CUSTOM" && start && end) {
      return `${start} to ${end}`;
    }
    return (
      TIME_RANGES.find((range) => range.value === selection)?.label ||
      "Last 30 Days"
    );
  }, [getCurrentSelection, start, end]);

  const calculateDateRange = useCallback((range: string) => {
    const today = new Date();
    const formatDateString = (date: Date) => format(date, "yyyy-MM-dd");

    switch (range) {
      case "30":
        return {
          from: formatDateString(subDays(today, 30)),
          to: formatDateString(today),
        };
      case "90":
        return {
          from: formatDateString(subDays(today, 90)),
          to: formatDateString(today),
        };
      case "180":
        return {
          from: formatDateString(subMonths(today, 6)),
          to: formatDateString(today),
        };
      case "365":
        return {
          from: formatDateString(subYears(today, 1)),
          to: formatDateString(today),
        };
      case "YTD":
        return {
          from: formatDateString(startOfYear(today)),
          to: formatDateString(today),
        };
      case "ALL":
        return {
          from: "2020-01-01", // Assuming this is far enough back
          to: formatDateString(today),
        };
      default:
        return {
          from: formatDateString(subDays(today, 30)),
          to: formatDateString(today),
        };
    }
  }, []);

  const handleTimeRangeChange = useCallback(
    (value: string) => {
      if (value === "ALL") {
        setStart("");
        setEnd("");
        if (onDateRangeChange) {
          onDateRangeChange("", "");
        }
      } else {
        const { from, to } = calculateDateRange(value);
        setStart(from);
        setEnd(to);
        if (onDateRangeChange) {
          onDateRangeChange(from, to);
        }
      }
    },
    [setStart, setEnd, onDateRangeChange, calculateDateRange],
  );

  useEffect(() => {
    if (onDateRangeChange) {
      if (!start && !end) {
        onDateRangeChange("", "");
      } else if (start && end) {
        onDateRangeChange(start, end);
      } else {
        // Default to last 30 days if only partial data
        const { from, to } = calculateDateRange("30");
        setStart(from);
        setEnd(to);
        onDateRangeChange(from, to);
      }
    }
  }, [start, end, onDateRangeChange, calculateDateRange, setStart, setEnd]);

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toISOString().split("T")[0], // Format as YYYY-MM-DD
  }));

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 border-b lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-1">
          <CardTitle>Visitor Trends</CardTitle>
          <CardDescription>
            Daily page views for {getSelectionLabel().toLowerCase()}
          </CardDescription>
        </div>
        <div>
          <Select
            value={getCurrentSelection()}
            onValueChange={handleTimeRangeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="rounded-lg sm:ml-auto">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {TIME_RANGES.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="rounded-lg">
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
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart accessibilityLayer data={formattedData}>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <YAxis axisLine={true} tickLine={true} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={formatDate}
                />
              }
            />
            <Line dataKey="count" type="monotone" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
