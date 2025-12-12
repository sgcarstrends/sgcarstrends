import { AnimatedNumber } from "@web/components/animated-number";
import { getYearlyRegistrations } from "@web/queries/cars";
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
    <div className="col-span-12 rounded-3xl border-2 border-primary bg-white p-6 lg:col-span-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <svg
            className="h-6 w-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <Link
          href="/cars"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7v10"
            />
          </svg>
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
              ? "bg-secondary-100 text-secondary"
              : "bg-danger-100 text-danger"
          }`}
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isPositive
                  ? "M5 10l7-7m0 0l7 7m-7-7v18"
                  : "M19 14l-7 7m0 0l-7-7m7 7V3"
              }
            />
          </svg>
          {isPositive ? "+" : ""}
          {changePercent}%
        </span>
        <span className="text-default-500 text-xs">vs previous year</span>
      </div>
    </div>
  );
}
