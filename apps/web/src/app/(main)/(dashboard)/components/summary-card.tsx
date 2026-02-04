import { AnimatedNumber } from "@web/components/animated-number";
import { getYearlyRegistrations } from "@web/queries/cars";
import {
  ArrowUpRight,
  BarChart3,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export async function SummaryCard() {
  const yearlyData = await getYearlyRegistrations();
  const currentYear = yearlyData.at(-1);
  const previousYear = yearlyData.at(-2);

  const totalRegistrations = currentYear?.total ?? 0;
  const previousTotal = previousYear?.total ?? 0;
  const changePercent =
    previousTotal > 0
      ? (((totalRegistrations - previousTotal) / previousTotal) * 100).toFixed(
          1,
        )
      : "0.0";
  const isPositive = totalRegistrations >= previousTotal;

  return (
    <div className="rounded-3xl border-2 border-primary bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
          <BarChart3 className="size-6 text-primary" />
        </div>
        <Link
          href="/cars"
          className="flex size-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
        >
          <ArrowUpRight className="size-6" />
        </Link>
      </div>
      <p className="text-default-500 text-sm">
        Total Registrations ({currentYear?.year ?? new Date().getFullYear()})
      </p>
      <p className="mt-1 font-bold text-4xl text-primary tabular-nums">
        <AnimatedNumber value={totalRegistrations} />
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
          {changePercent}%
        </span>
        <span className="text-default-500 text-xs">vs previous year</span>
      </div>
    </div>
  );
}
