import { Card, CardBody } from "@heroui/card";
import type { SelectDeregistration } from "@sgcarstrends/database";
import { CategoryBreakdown } from "@web/app/(dashboard)/cars/deregistrations/_components/category-breakdown";
import { CategoryChart } from "@web/app/(dashboard)/cars/deregistrations/_components/category-chart";
import { CategoryTrendsTable } from "@web/app/(dashboard)/cars/deregistrations/_components/category-trends-table";
import { TrendsChart } from "@web/app/(dashboard)/cars/deregistrations/_components/trends-chart";
import { loadSearchParams } from "@web/app/(dashboard)/cars/deregistrations/search-params";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import {
  getDeregistrations,
  getDeregistrationsByCategory,
  getDeregistrationsTotalByMonth,
} from "@web/queries/deregistrations";
import { chartColourPalette, formatNumber } from "@web/utils/charts";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import {
  fetchMonthsForDeregistrations,
  getMonthOrLatest,
} from "@web/utils/months";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

// Category constants and colours
const DEREGISTRATION_CATEGORIES = [
  "Category A",
  "Category B",
  "Category C",
  "Category D",
  "Vehicles Exempted From VQS",
  "Taxis",
] as const;

type DeregistrationCategory = (typeof DEREGISTRATION_CATEGORIES)[number];

const DEREGISTRATION_CATEGORY_COLOURS: Record<DeregistrationCategory, string> =
  {
    "Category A": chartColourPalette[0],
    "Category B": chartColourPalette[1],
    "Category C": chartColourPalette[2],
    "Category D": chartColourPalette[3],
    "Vehicles Exempted From VQS": chartColourPalette[4],
    Taxis: chartColourPalette[5],
  };

const getCategoryColour = (category: string): string => {
  if (category in DEREGISTRATION_CATEGORY_COLOURS) {
    return DEREGISTRATION_CATEGORY_COLOURS[category as DeregistrationCategory];
  }
  return chartColourPalette[0];
};

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

  return currentMonthCategories.map(({ category, total }) => {
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
      colour: getCategoryColour(category),
    };
  });
};

interface CategoryWithPercentage {
  category: string;
  total: number;
  percentage: number;
  colour: string;
}

const toPercentageDistribution = (
  data: { category: string; total: number }[],
): CategoryWithPercentage[] => {
  const grandTotal = data.reduce((sum, item) => sum + item.total, 0);

  return data.map((item) => ({
    ...item,
    percentage: grandTotal > 0 ? (item.total / grandTotal) * 100 : 0,
    colour: getCategoryColour(item.category),
  }));
};

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
    currentMonthIndex < months.length - 1
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
        <PageHeader title="Vehicle Deregistrations" />

        {/* Interactive Category Chart */}
        <CategoryChart data={allDeregistrations} months={months} />

        {/* Metrics Bar - All in one row */}
        <section>
          <Card className="bg-default-50">
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
            <CategoryBreakdown data={categoryBreakdownData} />
          </div>
        </section>

        {/* Sparklines Table */}
        <CategoryTrendsTable data={categoryCardsData} />
      </div>
    </>
  );
};

export default DeregistrationsPage;
