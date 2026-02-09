"use client";

import type { CarLogo } from "@logos/types";
import { slugify } from "@sgcarstrends/utils";
import {
  AllMakes,
  MakeSearch,
  PopularMakes,
} from "@web/app/(main)/(dashboard)/cars/components/makes";
import type { Make } from "@web/types";
import { useMemo } from "react";

interface MakesDashboardProps {
  sortedMakes: Make[];
  groupedMakes: Record<string, Make[]>;
  letters: string[];
  popularMakes: Make[];
  logos?: CarLogo[] | null;
}

export function MakesDashboard({
  sortedMakes,
  groupedMakes,
  letters,
  popularMakes,
  logos = [],
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
      <PopularMakes makes={popularMakes} logoUrlMap={logoUrlMap} />
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
