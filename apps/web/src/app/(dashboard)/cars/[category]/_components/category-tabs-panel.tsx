"use client";

import { Tab, Tabs } from "@heroui/tabs";
import Typography from "@web/components/typography";
import type { TypeItem } from "@web/types";
import type { FuelType } from "@web/types/cars";
import { formatVehicleType } from "@web/utils/format-vehicle-type";
import { useMemo } from "react";
import { CategoryHeroCard } from "./category-hero-card";
import { TopMakesChart } from "./top-makes-chart";

interface CategoryTabsPanelProps {
  types: TypeItem[];
  month: string;
  title: string;
  totalRegistrations: number;
  topMakesByFuelType?: FuelType[];
}

export function CategoryTabsPanel({
  types,
  month,
  title,
  totalRegistrations,
  topMakesByFuelType = [],
}: CategoryTabsPanelProps) {
  // Create a lookup map for quick access to top makes by fuel type
  const makesByFuelType = useMemo(
    () =>
      new Map(
        topMakesByFuelType.map((fuelType) => [fuelType.fuelType, fuelType]),
      ),
    [topMakesByFuelType],
  );

  // Calculate ranking for each type (sorted by count descending)
  const rankMap = useMemo(() => {
    const sortedTypes = [...types].sort((a, b) => b.count - a.count);
    return new Map(sortedTypes.map((type, index) => [type.name, index + 1]));
  }, [types]);

  return (
    <div className="col-span-12">
      <Tabs
        aria-label={`${title} Statistics`}
        variant="underlined"
        className="w-full"
      >
        {/*TODO: Reinstate later*/}
        {/*<Tab key="overview" title="Overview">*/}
        {/*  <div className="flex flex-col gap-6 py-4">*/}
        {/*    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">*/}
        {/*      <Suspense*/}
        {/*        fallback={*/}
        {/*          <div className="h-80 animate-pulse rounded-lg bg-default-100" />*/}
        {/*        }*/}
        {/*      >*/}
        {/*        <MarketShareDonut*/}
        {/*          data={marketShare.data}*/}
        {/*          title={`${title} Market Share`}*/}
        {/*          subtitle={`Distribution for ${formatDateToMonthYear(month)}`}*/}
        {/*        />*/}
        {/*      </Suspense>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</Tab>*/}

        {types.map((type) => {
          const fuelTypeData = makesByFuelType.get(type.name);
          const rank = rankMap.get(type.name) ?? types.length;

          return (
            <Tab key={type.name} title={formatVehicleType(type.name)}>
              <div className="flex flex-col gap-6 py-4">
                {/* Hero Statistics Row */}
                <CategoryHeroCard
                  typeName={formatVehicleType(type.name)}
                  count={type.count}
                  totalRegistrations={totalRegistrations}
                  month={month}
                  rank={rank}
                  totalCategories={types.length}
                />

                {/* Top Makes Chart */}
                {fuelTypeData && fuelTypeData.makes.length > 0 ? (
                  <TopMakesChart
                    makes={fuelTypeData.makes}
                    total={fuelTypeData.total}
                    title={formatVehicleType(type.name)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-default-50 p-8">
                    <Typography.H4>Top Makes</Typography.H4>
                    <Typography.TextSm>
                      No detailed make data available for{" "}
                      {formatVehicleType(type.name)}
                    </Typography.TextSm>
                  </div>
                )}
              </div>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
}
