import { AnimatedNumber } from "@web/components/animated-number";
import { getLatestCoeResults } from "@web/queries/coe";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type Trend = "up" | "down" | "neutral";

async function CoeSectionContent() {
  const latestCoe = await getLatestCoeResults();

  return (
    <div className="col-span-12 rounded-3xl bg-white p-6 lg:col-span-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Latest COE Results</h2>
        <div className="flex items-center gap-3">
          <Link
            href="/coe"
            className="flex size-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
          >
            <ArrowUpRight className="size-6" />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {latestCoe.map((result, index) => {
          // For demo, alternate trend indicators
          const trend: Trend =
            index % 3 === 0 ? "down" : index % 3 === 1 ? "up" : "neutral";
          const changePercent =
            trend === "up" ? "+2.5%" : trend === "down" ? "-1.8%" : "0.0%";

          return (
            <div
              key={result.vehicleClass}
              className={`rounded-2xl p-4 ${
                trend === "up"
                  ? "bg-danger-50"
                  : trend === "down"
                    ? "bg-success-50"
                    : "bg-default-100"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-default-500 text-xs">
                  Cat {result.vehicleClass}
                </span>
                {trend === "up" && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] text-white">
                    ↑
                  </span>
                )}
                {trend === "down" && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] text-white">
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
                      ? "text-secondary"
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
    <div className="col-span-12 rounded-3xl bg-white p-6 lg:col-span-8">
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
