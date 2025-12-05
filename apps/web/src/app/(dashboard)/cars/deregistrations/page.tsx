import { Card, CardBody } from "@heroui/card";
import { CategoryBreakdown } from "@web/app/(dashboard)/cars/deregistrations/_components/category-breakdown";
import { DeregistrationsCategoryChart } from "@web/app/(dashboard)/cars/deregistrations/_components/deregistrations-category-chart";
import { TrendsChart } from "@web/app/(dashboard)/cars/deregistrations/_components/trends-chart";
import { loadSearchParams } from "@web/app/(dashboard)/cars/deregistrations/search-params";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import {
  toCategorySparklines,
  toMonthlyTotals,
  toPercentageDistribution,
} from "@web/lib/deregistrations/transforms";
import { createPageMetadata } from "@web/lib/metadata";
import {
  getAllDeregistrations,
  getDeregistrationsByCategory,
} from "@web/queries/deregistrations";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import {
  fetchMonthsForDeregistrations,
  getMonthOrLatest,
} from "@web/utils/months";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

const title = "Vehicle Deregistrations";
const description =
  "Monthly vehicle deregistration statistics in Singapore under the Vehicle Quota System (VQS). Track deregistration trends by category.";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  let { month } = await loadSearchParams(searchParams);

  try {
    month = await getMonthOrLatest(month, "deregistrations");
    const formattedMonth = formatDateToMonthYear(month);

    return createPageMetadata({
      title: `${formattedMonth} ${title}`,
      description,
      canonical: `/cars/deregistrations?month=${month}`,
      includeAuthors: true,
    });
  } catch {
    return createPageMetadata({
      title,
      description,
      canonical: "/cars/deregistrations",
      includeAuthors: true,
    });
  }
};

const DeregistrationsPage = async ({ searchParams }: Props) => {
  let { month } = await loadSearchParams(searchParams);

  let months: string[] = [];

  try {
    months = await fetchMonthsForDeregistrations();
    month = await getMonthOrLatest(month, "deregistrations");
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Vehicle Deregistrations" />
        <Typography.Text>No deregistration data available.</Typography.Text>
      </div>
    );
  }

  const [categories, allDeregistrations] = await Promise.all([
    getDeregistrationsByCategory(month),
    getAllDeregistrations(),
  ]);

  const totalDeregistrations = categories.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  const formattedMonth = formatDateToMonthYear(month);

  const trendsData = toMonthlyTotals(allDeregistrations);
  const categoryCardsData = toCategorySparklines(
    allDeregistrations,
    categories,
  );
  const categoryBreakdownData = toPercentageDistribution(categories);

  // Calculate previous month total for comparison
  const sortedMonths = [
    ...new Set(allDeregistrations.map((r) => r.month)),
  ].sort();
  const currentMonthIndex = sortedMonths.indexOf(month);
  const previousMonth =
    currentMonthIndex > 0 ? sortedMonths[currentMonthIndex - 1] : null;
  const previousMonthTotal = previousMonth
    ? allDeregistrations
        .filter((r) => r.month === previousMonth)
        .reduce((sum, r) => sum + (r.number ?? 0), 0)
    : undefined;

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars/deregistrations`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  const previousTotal = previousMonthTotal ?? totalDeregistrations;

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-8">
        {/* Header */}
        <PageHeader title="Vehicle Deregistrations" />

        {/* Interactive Category Chart */}
        <DeregistrationsCategoryChart
          data={allDeregistrations}
          months={months}
        />

        {/* Metrics Bar - All in one row */}
        <section>
          <Card className="bg-default-50">
            <CardBody className="p-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
                {/* Total */}
                <div className="col-span-2 border-default-200 sm:col-span-1 sm:border-r sm:pr-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-default-500 text-xs uppercase tracking-wider">
                      Total
                    </span>
                    <div className="font-bold text-3xl text-foreground">
                      {totalDeregistrations.toLocaleString()}
                    </div>
                    {previousMonthTotal !== undefined && (
                      <span
                        className={`text-xs ${totalDeregistrations > previousTotal ? "text-danger" : "text-success"}`}
                      >
                        {totalDeregistrations > previousTotal ? "▲" : "▼"}{" "}
                        {Math.abs(
                          totalDeregistrations - previousTotal,
                        ).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category metrics */}
                {categoryCardsData.map((cat) => (
                  <div key={cat.category} className="flex flex-col gap-0.5">
                    <span className="truncate font-medium text-default-500 text-xs uppercase tracking-wider">
                      {cat.category
                        .replace("Category ", "Cat ")
                        .replace("Vehicles Exempted From VQS", "VQS")}
                    </span>
                    <div className="font-bold text-foreground text-xl">
                      {cat.total.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="h-1.5 w-8 rounded-full"
                        style={{ backgroundColor: cat.colour }}
                      />
                      <span className="text-default-400 text-xs">
                        {((cat.total / totalDeregistrations) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Charts - Side by side on desktop */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Trends Chart - Larger */}
          <div className="lg:col-span-2">
            <TrendsChart data={trendsData} />
          </div>

          {/* Category Breakdown - Compact */}
          <div className="lg:col-span-1">
            <CategoryBreakdown
              data={categoryBreakdownData}
              month={formattedMonth}
            />
          </div>
        </section>

        {/* Sparklines Table */}
        <section>
          <Card>
            <CardBody className="p-4">
              <h3 className="mb-3 font-medium text-default-500 text-xs uppercase tracking-wider">
                Category Trends (12 months)
              </h3>
              <div className="flex flex-col gap-2">
                {categoryCardsData.map((cat) => {
                  const firstValue = cat.trend[0]?.value ?? 0;
                  const lastValue = cat.trend[cat.trend.length - 1]?.value ?? 0;
                  const change = lastValue - firstValue;
                  const isUp = change > 0;

                  return (
                    <div
                      key={cat.category}
                      className="grid grid-cols-12 items-center gap-2 rounded-lg bg-default-50 px-3 py-2"
                    >
                      <div className="col-span-3 flex items-center gap-2">
                        <div
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: cat.colour }}
                        />
                        <span className="truncate text-sm">
                          {cat.category.replace(
                            "Vehicles Exempted From VQS",
                            "VQS Exempted",
                          )}
                        </span>
                      </div>
                      <div className="col-span-6">
                        <div className="flex h-6 items-end gap-px">
                          {cat.trend.map((point, i) => {
                            const max = Math.max(
                              ...cat.trend.map((p) => p.value),
                            );
                            const height =
                              max > 0 ? (point.value / max) * 100 : 0;
                            return (
                              <div
                                key={`${cat.category}-${i}`}
                                className="flex-1 rounded-t-sm transition-all"
                                style={{
                                  height: `${Math.max(height, 4)}%`,
                                  backgroundColor: cat.colour,
                                  opacity: 0.3 + (i / cat.trend.length) * 0.7,
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="col-span-2 text-right font-medium text-sm">
                        {cat.total.toLocaleString()}
                      </div>
                      <div
                        className={`col-span-1 text-right text-xs ${isUp ? "text-danger" : "text-success"}`}
                      >
                        {isUp ? "▲" : "▼"} {Math.abs(change)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </>
  );
};

export default DeregistrationsPage;
