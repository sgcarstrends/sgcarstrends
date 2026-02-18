import { slugify } from "@sgcarstrends/utils";
import type { Make, MakeStats } from "@web/types";
import { Flame } from "lucide-react";
import { MakeCard } from "./make-card";

interface PopularMakesProps {
  makes: Make[];
  logoUrlMap?: Record<string, string>;
  makeStatsMap?: Record<string, MakeStats>;
}

export function PopularMakes({
  makes,
  logoUrlMap = {},
  makeStatsMap,
}: PopularMakesProps) {
  if (makes.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
            <Flame className="size-4 text-white" />
          </div>
          <h2 className="font-semibold text-foreground text-lg">
            Popular Makes
          </h2>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-medium text-amber-600 text-xs">
          Top {makes.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {makes.map((make) => {
          const stats = makeStatsMap?.[make];
          return (
            <MakeCard
              key={make}
              make={make}
              logoUrl={logoUrlMap[slugify(make)]}
              count={stats?.count}
              share={stats?.share}
              trend={stats?.trend}
            />
          );
        })}
      </div>
    </section>
  );
}
