"use client";

import { ComboBox, Input, Label, ListBox, toast } from "@heroui/react";
import { formatDateToMonthYear } from "@sgcarstrends/utils";
import type { Month } from "@web/types";
import { groupByYear } from "@web/utils/group-by-year";
import { Calendar } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useMemo, useRef } from "react";

interface MonthSelectorProps {
  months: Month[];
  latestMonth: Month;
  wasAdjusted?: boolean;
}

export function MonthSelector({
  months,
  latestMonth,
  wasAdjusted,
}: MonthSelectorProps) {
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault(latestMonth).withOptions({ shallow: false }),
  );
  const hasShownToast = useRef(false);

  // Show toast if server adjusted the month
  useEffect(() => {
    if (wasAdjusted && !hasShownToast.current) {
      hasShownToast.current = true;
      toast(`Latest data is ${formatDateToMonthYear(latestMonth)}`);
    }
  }, [wasAdjusted, latestMonth]);

  const memoisedGroupByYear = useMemo(() => groupByYear, []);
  const sortedMonths = useMemo(
    () => Object.entries(memoisedGroupByYear(months)).slice().reverse(),
    [memoisedGroupByYear, months],
  );

  return (
    <ComboBox
      selectedKey={month}
      onSelectionChange={(key) => setMonth(key as string)}
    >
      <Label className="sr-only">Month</Label>
      <ComboBox.InputGroup>
        <Calendar className="size-4 text-default-400" />
        <Input placeholder="Select Month" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {sortedMonths.map(([year, monthList]) => (
            <ListBox.Section key={year}>
              <header className="px-2 py-1 font-medium text-default-500 text-xs">
                {year}
              </header>
              {monthList.map((m) => {
                const date = `${year}-${m}`;
                return (
                  <ListBox.Item
                    key={date}
                    textValue={formatDateToMonthYear(date)}
                  >
                    {formatDateToMonthYear(date)}
                  </ListBox.Item>
                );
              })}
            </ListBox.Section>
          ))}
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}
