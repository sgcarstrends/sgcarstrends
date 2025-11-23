import useStore from "@web/app/store";
import { useMemo } from "react";

interface YearlyData {
  year: number;
  total: number;
}

/**
 * Custom hook for key statistics data management and calculations
 *
 * Handles year selection, YoY calculations, and statistical aggregations
 * for the key statistics dashboard component.
 */
export const useKeyStatistics = (data: YearlyData[]) => {
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

  return {
    // Selection state
    selectedYear,
    setSelectedYear,

    // Formatters
    numberFormatter,
    percentFormatter,

    // Sorted data
    sortedByYearAsc,
    sortedByYearDesc,
    comparableAsc,

    // Selected year data
    selectedEntry,
    previousEntry,

    // Statistics
    highestEntry,
    lowestEntry,
    yoyChange,
    yoyChangeRatio,
    yoyToneClass,
  };
};
