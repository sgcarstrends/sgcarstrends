"use client";

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/react";
import type { Month } from "@web/types";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { groupByYear } from "@web/utils/group-by-year";
import { Calendar } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";

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
  }, [latestMonth, month, setMonth]);

  const memoisedGroupByYear = useMemo(() => groupByYear, []);
  const sortedMonths = useMemo(
    () => Object.entries(memoisedGroupByYear(months)).slice().reverse(),
    [memoisedGroupByYear, months],
  );

  return (
    <Autocomplete
      selectedKey={month ?? latestMonth}
      onSelectionChange={(key) => setMonth(key as string)}
      aria-label="Month"
      placeholder="Select Month"
      startContent={<Calendar className="size-4" />}
      variant="underlined"
    >
      {sortedMonths.map(([year, months]) => (
        <AutocompleteSection key={year} title={year}>
          {months.map((month) => {
            const date = `${year}-${month}`;
            return (
              <AutocompleteItem
                key={date}
                textValue={formatDateToMonthYear(date)}
              >
                {formatDateToMonthYear(date)}
              </AutocompleteItem>
            );
          })}
        </AutocompleteSection>
      ))}
    </Autocomplete>
  );
};
