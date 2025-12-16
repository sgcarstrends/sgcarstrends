import { AnimatedNumber } from "@web/components/animated-number";
import { getLatestAndPreviousCoeResults } from "@web/queries/coe";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { calculateChangePercent, calculateTrend } from "./coe-trend-utils";

async function CoeSectionContent() {
  const { latest, previous } = await getLatestAndPreviousCoeResults();

  // Create a map of previous results by vehicle class for easy lookup
  const previousMap = new Map(previous.map((r) => [r.vehicleClass, r.premium]));

  return (
    <div className="col-span-12 rounded-3xl bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Latest COE Results</h2>
        <div className="flex items-center gap-3">
          <Link
            href="/coe"
            aria-label="View all COE results"
            className="flex size-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
          >
            <ArrowUpRight className="size-6" />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {latest.map((result) => {
          const previousPremium =
            previousMap.get(result.vehicleClass) ?? result.premium;
          const trend = calculateTrend(result.premium, previousPremium);
          const changePercent = calculateChangePercent(
            result.premium,
            previousPremium,
          );

          return (
            <div key={result.vehicleClass} className="rounded-2xl bg-muted p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-default-500 text-xs">
                  {result.vehicleClass}
                </span>
                {trend === "up" && (
                  <span
                    className="flex size-5 items-center justify-center rounded-full bg-danger text-white text-xs"
                    aria-label="Price increased"
                    role="img"
                  >
                    ↑
                  </span>
                )}
                {trend === "down" && (
                  <span
                    className="flex size-5 items-center justify-center rounded-full bg-success text-white text-xs"
                    aria-label="Price decreased"
                    role="img"
                  >
                    ↓
                  </span>
                )}
              </div>
              <p className="font-bold text-foreground text-lg tabular-nums">
                S$
                <AnimatedNumber value={result.premium} />
              </p>
              <p
                className={`mt-1 font-medium text-xs ${
                  trend === "up"
                    ? "text-danger"
                    : trend === "down"
                      ? "text-success"
                      : "text-default-500"
                }`}
              >
                {changePercent}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CoeSectionSkeleton() {
  return (
    <div className="col-span-12 rounded-3xl bg-white p-6">
      <div className="mb-5 h-6 w-40 animate-pulse rounded bg-default-200" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton list */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-default-100 p-4">
            <div className="mb-2 h-4 w-12 animate-pulse rounded bg-default-200" />
            <div className="h-6 w-20 animate-pulse rounded bg-default-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoeSection() {
  return (
    <Suspense fallback={<CoeSectionSkeleton />}>
      <CoeSectionContent />
    </Suspense>
  );
}
