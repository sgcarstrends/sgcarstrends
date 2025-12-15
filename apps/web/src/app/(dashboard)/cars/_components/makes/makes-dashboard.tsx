"use client";

import type { CarLogo } from "@logos/types";
import type { SelectCar } from "@sgcarstrends/database";
import { useIsMobile } from "@sgcarstrends/ui/hooks/use-mobile";
import { slugify } from "@sgcarstrends/utils";
import {
  MakeDetailPanel,
  MakeDetailSheet,
  MakeSearch,
  Makes,
  PopularMakes,
} from "@web/app/(dashboard)/cars/_components/makes";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
import type { Make } from "@web/types";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs/server";
import { useEffect, useMemo, useState } from "react";

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
  const [make] = useQueryState(
    "make",
    parseAsString.withOptions({ shallow: false }),
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

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

  // Open sheet on mobile when make is selected via query string
  useEffect(() => {
    if (make && isMobile) {
      setSheetOpen(true);
    }
  }, [make, isMobile]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <main className="flex flex-col gap-6">
          <MakeSearch makes={makes} logoUrlMap={logoUrlMap} />
          <PopularMakes makes={popularMakes} logoUrlMap={logoUrlMap} />
          <Makes
            title="All Makes"
            makes={makes}
            showLetterFilter
            logoUrlMap={logoUrlMap}
          />
        </main>

        <MakeDetailPanel selectedMakeData={selectedMakeData} />
      </div>

      <MakeDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedMakeData={selectedMakeData}
      />
    </>
  );
}
