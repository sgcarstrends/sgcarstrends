import { AnimatedNumber } from "@web/components/animated-number";
import { getCarsComparison, getCarsLatestMonth } from "@web/queries/cars";
import {
  ArrowUpRight,
  CalendarDays,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export async function MonthlyChangeSummary() {
  const latestMonth = await getCarsLatestMonth();

  if (!latestMonth) {
    return null;
  }

  const comparison = await getCarsComparison(latestMonth);
  const currentTotal = comparison.currentMonth.total;
  const previousTotal = comparison.previousMonth.total;

  const changeAmount = currentTotal - previousTotal;
  const changePercent =
    previousTotal > 0
      ? ((changeAmount / previousTotal) * 100).toFixed(1)
      : "0.0";
  const isPositive = changeAmount >= 0;

  // Format the month for display (e.g., "2025-01" -> "Jan 2025")
  const [year, month] = latestMonth.split("-");
  const displayMonth = new Date(Number(year), Number(month) - 1).toLocaleString(
    "en-SG",
    { month: "short", year: "numeric" },
  );

  return (
    <div className="rounded-3xl border-2 border-primary bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
          <CalendarDays className="size-6 text-primary" />
        </div>
        <Link
          href={`/cars?month=${latestMonth}`}
          aria-label="View monthly car registration details"
          className="flex size-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
        >
          <ArrowUpRight className="size-6" />
        </Link>
      </div>
      <p className="text-default-500 text-sm">
        Monthly Change ({displayMonth})
      </p>
      <p className="mt-1 font-bold text-4xl text-primary tabular-nums">
        {isPositive ? "+" : ""}
        <AnimatedNumber value={Number(changePercent)} />%
      </p>
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-xs ${
            isPositive
              ? "bg-success/20 text-success"
              : "bg-danger/20 text-danger"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="size-4" />
          ) : (
            <TrendingDown className="size-4" />
          )}
          {isPositive ? "+" : ""}
          {changeAmount.toLocaleString()}
        </span>
        <span className="text-default-500 text-xs">vs previous month</span>
      </div>
    </div>
  );
}
