"use client";

import { Button } from "@heroui/button";
import { CalendarIcon } from "lucide-react";

export interface TimeRange {
  value: string;
  label: string;
}

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  ranges: TimeRange[];
  className?: string;
}

/**
 * Time range preset button group selector
 *
 * @example
 * ```tsx
 * const TIME_RANGES = [
 *   { value: "1M", label: "1 Month" },
 *   { value: "3M", label: "3 Months" },
 *   { value: "6M", label: "6 Months" },
 *   { value: "1Y", label: "1 Year" },
 *   { value: "ALL", label: "All Time" }
 * ];
 *
 * <TimeRangeSelector
 *   value={timeRange}
 *   onChange={setTimeRange}
 *   ranges={TIME_RANGES}
 * />
 * ```
 */
export const TimeRangeSelector = ({
  value,
  onChange,
  ranges,
  className = "",
}: TimeRangeSelectorProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <CalendarIcon className="size-4 text-muted-foreground" />
      <div className="flex flex-wrap gap-2">
        {ranges.map((range) => (
          <Button
            key={range.value}
            size="sm"
            variant={value === range.value ? "solid" : "bordered"}
            color={value === range.value ? "primary" : "default"}
            onPress={() => onChange(range.value)}
            className="min-w-[80px]"
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
