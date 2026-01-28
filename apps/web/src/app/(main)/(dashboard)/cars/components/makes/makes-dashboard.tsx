"use client";

import type { CarLogo } from "@logos/types";
import type { SelectCar } from "@sgcarstrends/database";
import { slugify } from "@sgcarstrends/utils";
import {
  AllMakes,
  MakeDetailPanel,
  MakeDetailSheet,
  MakeSearch,
  PopularMakes,
} from "@web/app/(main)/(dashboard)/cars/components/makes";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
import type { Make } from "@web/types";
import { useMemo } from "react";

interface SelectedMakeData {
  make: string;
  cars: { make: string; total: number; data: Partial<SelectCar>[] };
  lastUpdated?: number | null;
  logo?: CarLogo | null;
  coeComparison: MakeCoeComparisonData[];
}

interface MakesDashboardProps {
  makes: Make[];
  popularMakes: Make[];
  logos?: CarLogo[] | null;
  selectedMakeData?: SelectedMakeData | null;
}

export function MakesDashboard({
  makes,
  popularMakes,
  logos = [],
  selectedMakeData,
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
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <main className="flex flex-col gap-4 lg:col-span-2">
          <MakeSearch makes={makes} />
          <PopularMakes makes={popularMakes} logoUrlMap={logoUrlMap} />
          <AllMakes
            title="All Makes"
            makes={makes}
            showLetterFilter
            logoUrlMap={logoUrlMap}
          />
        </main>

        <aside className="lg:col-span-3">
          <MakeDetailPanel selectedMakeData={selectedMakeData} />
        </aside>
      </div>

      <MakeDetailSheet selectedMakeData={selectedMakeData} />
    </>
  );
}
