"use client";

import { useEffect, useMemo } from "react";
import { Calendar } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateToMonthYear } from "@/utils/format-date-to-month-year";
import { groupByYear } from "@/utils/group-by-year";
import type { Month } from "@/types";

interface Props {
  months: Month[];
}

export const MonthSelector = ({ months }: Props) => {
  const [month, setMonth] = useQueryState("month", { shallow: false });
  const latestMonth = months[0];

  useEffect(() => {
    if (!month) {
      void setMonth(latestMonth);
    }
  }, [latestMonth, month, months, setMonth]);

  const memoisedGroupByYear = useMemo(() => groupByYear, []);
  const sortedMonths = useMemo(
    () => Object.entries(memoisedGroupByYear(months)).slice().reverse(),
    [memoisedGroupByYear, months],
  );

  return (
    <Select value={month || latestMonth} onValueChange={setMonth}>
      <SelectTrigger>
        <SelectValue placeholder="Select Month" />
      </SelectTrigger>
      <SelectContent>
        {sortedMonths.map(([year, months]) => (
          <SelectGroup key={year}>
            <SelectLabel>{year}</SelectLabel>
            {months.slice().map((month) => {
              const date = `${year}-${month}`;
              return (
                <SelectItem key={month} value={date}>
                  <div className="flex items-center">
                    <Calendar className="mr-2 size-4" />
                    {formatDateToMonthYear(date)}
                  </div>
                </SelectItem>
              );
            })}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MonthSelector;
