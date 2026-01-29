import { Card, CardBody } from "@heroui/card";
import type { SelectDeregistration } from "@sgcarstrends/database";
import { CategoryBreakdown } from "@web/app/(main)/(dashboard)/cars/deregistrations/components/category-breakdown";
import { CategoryChart } from "@web/app/(main)/(dashboard)/cars/deregistrations/components/category-chart";
import { CategoryTrendsTable } from "@web/app/(main)/(dashboard)/cars/deregistrations/components/category-trends-table";
import { toPercentageDistribution } from "@web/app/(main)/(dashboard)/cars/deregistrations/components/constants";
import { TrendsChart } from "@web/app/(main)/(dashboard)/cars/deregistrations/components/trends-chart";
import {
  deregistrationsSearchParams,
  loadSearchParams,
} from "@web/app/(main)/(dashboard)/cars/deregistrations/search-params";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { MonthSelector } from "@web/components/shared/month-selector";
import { PageContext } from "@web/components/shared/page-context";
import { PAGE_CONTEXTS } from "@web/components/shared/page-contexts";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import {
  getDeregistrations,
  getDeregistrationsByCategory,
  getDeregistrationsTotalByMonth,
} from "@web/queries/deregistrations";
import { formatNumber } from "@web/utils/charts";
import {
  fetchMonthsForDeregistrations,
  getMonthOrLatest,
} from "@web/utils/dates/months";
import { formatDateToMonthYear } from "@web/utils/formatting/format-date-to-month-year";
import type { Metadata } from "next";
import { createSerializer, type SearchParams } from "nuqs/server";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";

const serialize = createSerializer(deregistrationsSearchParams);

// Data transformation functions
const SPARKLINE_MONTH_COUNT = 12;

interface MonthlyTotal {
  month: string;
  total: number;
}

const toMonthlyTotals = (data: SelectDeregistration[]): MonthlyTotal[] => {
  const grouped = data.reduce<Record<string, number>>((acc, record) => {
    acc[record.month] = (acc[record.month] ?? 0) + (record.number ?? 0);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

interface CategorySparklineData {
  category: string;
  total: number;
  trend: { value: number }[];
  colour: string;
}

const toCategorySparklines = (
  data: SelectDeregistration[],
  currentMonthCategories: { category: string; total: number }[],
  monthCount = SPARKLINE_MONTH_COUNT,
): CategorySparklineData[] => {
  const sortedMonths = [...new Set(data.map((record) => record.month))].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  const recentMonths = sortedMonths.slice(-monthCount);

  return currentMonthCategories.map(({ category, total }, index) => {
    const trend = recentMonths.map((month) => {
      const monthRecords = data.filter(
        (record) => record.month === month && record.category === category,
      );
      const value = monthRecords.reduce(
        (sum, record) => sum + (record.number ?? 0),
        0,
      );
      return { value };
    });

    return {
      category,
      total,
      trend,
      colour: `var(--chart-${index + 1})`,
    };
  });
};

const title = "Vehicle Deregistrations";
const description =
  "Monthly vehicle deregistration statistics in Singapore under the Vehicle Quota System (VQS). Track deregistration trends by category.";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async ({
  searchParams,
}: PageProps): Promise<Metadata> => {
  const { month: parsedMonth } = await loadSearchParams(searchParams);

  try {
    const { month } = await getMonthOrLatest(parsedMonth, "deregistrations");
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

const DeregistrationsPage = async ({ searchParams }: PageProps) => {
  const { month: parsedMonth } = await loadSearchParams(searchParams);

  let months: string[] = [];
  let month: string;
  let wasAdjusted = false;

  try {
    months = await fetchMonthsForDeregistrations();
    const result = await getMonthOrLatest(parsedMonth, "deregistrations");
    month = result.month;
    wasAdjusted = result.wasAdjusted;
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Vehicle Deregistrations" />
        <Typography.Text>No deregistration data available.</Typography.Text>
      </div>
    );
  }

  const latestMonth = months[0];

  const [categories, allDeregistrations] = await Promise.all([
    getDeregistrationsByCategory(month),
    getDeregistrations(),
  ]);

  const totalDeregistrations = categories.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  const trendsData = toMonthlyTotals(allDeregistrations);
  const categoryCardsData = toCategorySparklines(
    allDeregistrations,
    categories,
  );
  const categoryBreakdownData = toPercentageDistribution(categories);

  // Get previous month total for comparison
  const currentMonthIndex = months.indexOf(month);
  const previousMonth =
    currentMonthIndex >= 0 && currentMonthIndex < months.length - 1
      ? months[currentMonthIndex + 1]
      : null;
  const previousMonthResult = previousMonth
    ? await getDeregistrationsTotalByMonth(previousMonth)
    : null;
  const previousMonthTotal = previousMonthResult?.[0]?.total;

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
        <AnimatedSection order={0}>
          <PageHeader
            title="Vehicle Deregistrations"
            subtitle="Monthly vehicle deregistrations and scrapping trends in Singapore."
          >
            <Suspense fallback={null}>
              <MonthSelector
                months={months}
                latestMonth={latestMonth}
                wasAdjusted={wasAdjusted}
              />
            </Suspense>
            <ShareButtons
              url={`${SITE_URL}${serialize("/cars/deregistrations", { month })}`}
              title={`Vehicle Deregistrations - ${SITE_TITLE}`}
            />
          </PageHeader>
        </AnimatedSection>

        <AnimatedSection order={1}>
          <PageContext {...PAGE_CONTEXTS.deregistrations} />
        </AnimatedSection>

        {/* Interactive Category Chart */}
        <AnimatedSection order={2}>
          <CategoryChart data={allDeregistrations} months={months} />
        </AnimatedSection>

        {/* Metrics Bar - All in one row */}
        <AnimatedSection order={3}>
          <section>
            <Card className="bg-default-50 p-3">
              <CardBody className="p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
                  {/* Total */}
                  <div className="col-span-2 border-default-200 sm:col-span-1 sm:border-r sm:pr-4">
                    <div className="flex flex-col gap-2">
                      <span className="font-medium text-default-500 text-xs uppercase tracking-wider">
                        Total
                      </span>
                      <div className="font-bold text-3xl text-foreground">
                        {formatNumber(totalDeregistrations)}
                      </div>
                      {previousMonthTotal !== undefined && (
                        <span
                          className={`text-xs ${totalDeregistrations > previousTotal ? "text-danger" : "text-success"}`}
                        >
                          {totalDeregistrations > previousTotal ? "▲" : "▼"}{" "}
                          {formatNumber(
                            Math.abs(totalDeregistrations - previousTotal),
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category metrics */}
                  {categoryCardsData.map((cat) => (
                    <div key={cat.category} className="flex flex-col gap-2">
                      <span className="truncate font-medium text-default-500 text-xs uppercase tracking-wider">
                        {cat.category
                          .replace("Category ", "Cat ")
                          .replace("Vehicles Exempted From VQS", "VQS")}
                      </span>
                      <div className="font-bold text-foreground text-xl">
                        {formatNumber(cat.total)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 w-8 rounded-full"
                          style={{ backgroundColor: cat.colour }}
                        />
                        <span className="text-default-400 text-xs">
                          {((cat.total / totalDeregistrations) * 100).toFixed(
                            0,
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </section>
        </AnimatedSection>

        {/* Charts - Side by side on desktop */}
        <AnimatedSection order={4}>
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Trends Chart - Larger */}
            <div className="lg:col-span-2">
              <TrendsChart data={trendsData} />
            </div>

            {/* Category Breakdown - Compact */}
            <div className="lg:col-span-1">
              <CategoryBreakdown data={categoryBreakdownData} />
            </div>
          </section>
        </AnimatedSection>

        {/* Sparklines Table */}
        <AnimatedSection order={5}>
          <CategoryTrendsTable data={categoryCardsData} />
        </AnimatedSection>
      </div>
    </>
  );
};

export default DeregistrationsPage;
