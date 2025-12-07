"use client";

import { Select, SelectItem } from "@heroui/select";
import { type Period, periods } from "@web/app/(dashboard)/coe/search-params";
import { parseAsStringLiteral, useQueryState } from "nuqs";

const periodLabels: Record<Period, string> = {
  "12m": "12 Months",
  "5y": "5 Years",
  "10y": "10 Years",
  ytd: "Year to Date",
  all: "All Time",
};

export const PeriodSelector = () => {
  const [period, setPeriod] = useQueryState(
    "period",
    parseAsStringLiteral(periods).withDefault("12m"),
  );

  return (
    <Select
      aria-label="Select time period"
      selectedKeys={[period]}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as Period;
        if (selected) {
          setPeriod(selected);
        }
      }}
      className="w-40"
      size="sm"
    >
      {periods.map((periodOption) => (
        <SelectItem key={periodOption}>{periodLabels[periodOption]}</SelectItem>
      ))}
    </Select>
  );
};
