"use client";

import { Tab, Tabs } from "@heroui/react";
import {
  createInsightData,
  defaultIcons,
  InsightCards,
  MarketShareDonut,
  TopPerformersBar,
} from "@web/components/charts";
import type {
  CarMarketShareResponse,
  CarTopPerformersData,
} from "@web/lib/cars/queries";
import type { TypeItem } from "@web/types";
import { formatPercentage } from "@web/utils/charts";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { Suspense } from "react";

interface Props {
  types: TypeItem[];
  month: string;
  category: string;
  title: string;
  topPerformers: CarTopPerformersData;
  marketShare: CarMarketShareResponse;
  totalRegistrations: number;
}

export const CategoryTypesTabsView = ({
  types,
  month,
  title,
  topPerformers,
  marketShare,
  totalRegistrations,
}: Props) => {
  const overviewInsights = [
    createInsightData("Total Registrations", totalRegistrations, {
      icon: defaultIcons.barChart,
      colour: "blue",
      subtitle: `${formatDateToMonthYear(month)}`,
    }),
    createInsightData("Categories", types.length, {
      icon: defaultIcons.pieChart,
      colour: "emerald",
      subtitle: `Active ${title.toLowerCase()} categories`,
    }),
    createInsightData("Top Performer", marketShare.dominantType.count, {
      icon: defaultIcons.award,
      colour: "amber",
      subtitle: `${marketShare.dominantType.name} - ${formatPercentage(marketShare.dominantType.percentage)} market share`,
    }),
  ];

  return (
    <div className="w-full">
      <Tabs
        aria-label={`${title} Statistics`}
        variant="underlined"
        className="w-full"
      >
        <Tab key="overview" title="Overview">
          <div className="space-y-6 py-4">
            <InsightCards insights={overviewInsights} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Suspense
                fallback={
                  <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
                }
              >
                <MarketShareDonut
                  data={marketShare.data}
                  title={`${title} Market Share`}
                  subtitle={`Distribution for ${formatDateToMonthYear(month)}`}
                />
              </Suspense>

              <Suspense
                fallback={
                  <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
                }
              >
                <TopPerformersBar
                  data={
                    marketShare.category === "fuelType"
                      ? topPerformers.topFuelTypes
                      : topPerformers.topVehicleTypes
                  }
                  title={`Top ${title}s`}
                  subtitle="Most popular categories"
                  maxItems={5}
                />
              </Suspense>
            </div>
          </div>
        </Tab>

        {types.map((type) => {
          const typeInsights = [
            createInsightData("Registrations", type.count, {
              icon: defaultIcons.barChart,
              colour: "blue",
              subtitle: `${formatDateToMonthYear(month)}`,
            }),
            createInsightData(
              "Market Share",
              (type.count / totalRegistrations) * 100,
              {
                icon: defaultIcons.pieChart,
                colour: "emerald",
                subtitle: `${formatPercentage((type.count / totalRegistrations) * 100)} of total ${title.toLowerCase()} registrations`,
              },
            ),
            createInsightData(
              "Rank",
              types.findIndex((t) => t.name === type.name) + 1,
              {
                icon: defaultIcons.award,
                colour: "amber",
                subtitle: `Among ${types.length} ${title.toLowerCase()}s`,
              },
            ),
          ];

          return (
            <Tab key={type.name} title={type.name}>
              <div className="space-y-6 py-4">
                <InsightCards insights={typeInsights} />

                <div className="text-center text-gray-500 text-sm">
                  Detailed statistics for {type.name} {title.toLowerCase()} in{" "}
                  {formatDateToMonthYear(month)}
                </div>
              </div>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
};
