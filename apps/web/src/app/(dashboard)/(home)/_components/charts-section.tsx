import { getTopMakesByYear, getYearlyRegistrations } from "@web/queries/cars";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function YearlyChartContent() {
  const yearlyData = await getYearlyRegistrations();
  const maxTotal = Math.max(...yearlyData.map((d) => d.total));

  return (
    <div className="col-span-12 rounded-3xl bg-white p-6 md:col-span-6 lg:col-span-4">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">
            Yearly Registrations
          </h2>
          <p className="text-default-500 text-sm">
            Total registrations over the years
          </p>
        </div>
        <Link
          href="/annual"
          className="flex size-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
        >
          <ArrowUpRight className="size-6" />
        </Link>
      </div>
      <div className="flex h-[160px] items-end gap-4">
        {yearlyData.slice(-6).map((item, i, arr) => {
          const height = (item.total / maxTotal) * 140;
          const isLatest = i === arr.length - 1;
          return (
            <div
              key={item.year}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="font-medium text-default-500 text-xs tabular-nums">
                {(item.total / 1000).toFixed(1)}K
              </span>
              <div
                className={`w-full rounded-t-xl transition-colors ${isLatest ? "bg-[var(--chart-1)]" : "bg-default-200 hover:bg-default-300"}`}
                style={{ height: `${height}px` }}
              />
              <span className="text-default-500 text-xs">{item.year}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function TopMakesContent() {
  const topMakes = await getTopMakesByYear();
  const maxValue = topMakes[0]?.value ?? 1;

  return (
    <div className="col-span-12 rounded-3xl bg-white p-6 md:col-span-6 lg:col-span-4">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Top Makes</h2>
        <Link
          href="/cars/makes"
          className="flex size-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
        >
          <ArrowUpRight className="size-6" />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {topMakes.slice(0, 5).map((item, i) => (
          <div key={item.make} className="flex items-center gap-3">
            <span className="w-5 font-medium text-default-500 text-sm">
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-sm">{item.make}</span>
                <span className="text-default-500 text-xs tabular-nums">
                  {item.value.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-default-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: `var(--chart-${i + 1})`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function YearlyChartSkeleton() {
  return (
    <div className="col-span-12 rounded-3xl bg-white p-6 lg:col-span-7">
      <div className="mb-5 h-6 w-40 animate-pulse rounded bg-default-200" />
      <div className="flex h-[160px] items-end gap-4">
        {[0, 1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="flex flex-1 flex-col items-center gap-2">
            <div className="h-4 w-8 animate-pulse rounded bg-default-200" />
            <div className="w-full animate-pulse rounded-t-xl bg-default-200" />
            <div className="h-4 w-8 animate-pulse rounded bg-default-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TopMakesSkeleton() {
  return (
    <div className="col-span-12 rounded-3xl bg-white p-6 md:col-span-6 lg:col-span-4">
      <div className="mb-5 h-6 w-24 animate-pulse rounded bg-default-200" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3, 4].map((num) => (
          <div key={num} className="flex items-center gap-3">
            <div className="h-5 w-5 animate-pulse rounded bg-default-200" />
            <div className="flex-1">
              <div className="mb-1 h-4 w-20 animate-pulse rounded bg-default-200" />
              <div className="h-1.5 w-full animate-pulse rounded-full bg-default-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function YearlyChart() {
  return (
    <Suspense fallback={<YearlyChartSkeleton />}>
      <YearlyChartContent />
    </Suspense>
  );
}

export function TopMakesSection() {
  return (
    <Suspense fallback={<TopMakesSkeleton />}>
      <TopMakesContent />
    </Suspense>
  );
}

// Keep ChartsSection for backward compatibility but mark as deprecated
export function ChartsSection() {
  return (
    <>
      <YearlyChart />
      <TopMakesSection />
    </>
  );
}
