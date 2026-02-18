"use client";

import type { CarLogo } from "@logos/types";
import { slugify } from "@sgcarstrends/utils";
import {
  AllMakes,
  MakeSearch,
  PopularMakes,
} from "@web/app/(main)/(dashboard)/cars/components/makes";
import type { Make, MakeStats } from "@web/types";
import { useMemo } from "react";

interface MakesDashboardProps {
  sortedMakes: Make[];
  groupedMakes: Record<string, Make[]>;
  letters: string[];
  popularMakes: Make[];
  logos?: CarLogo[] | null;
  makeStatsMap?: Record<string, MakeStats>;
}

export function MakesDashboard({
  sortedMakes,
  groupedMakes,
  letters,
  popularMakes,
  logos = [],
  makeStatsMap,
}: MakesDashboardProps) {
  const logoUrlMap = useMemo(() => {
    return (
      logos?.reduce<Record<string, string>>((acc, logo) => {
        if (logo.url) {
          acc[slugify(logo.make)] = logo.url;
        }
        return acc;
      }, {}) ?? {}
    );
  }, [logos]);

  return (
    <div className="flex flex-col gap-4">
      <MakeSearch makes={sortedMakes} />
      <PopularMakes
        makes={popularMakes}
        logoUrlMap={logoUrlMap}
        makeStatsMap={makeStatsMap}
      />
      <AllMakes
        title="All Makes"
        sortedMakes={sortedMakes}
        groupedMakes={groupedMakes}
        letters={letters}
        logoUrlMap={logoUrlMap}
      />
    </div>
  );
}
