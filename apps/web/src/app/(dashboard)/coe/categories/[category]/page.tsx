import { redis } from "@sgcarstrends/utils";
import {
  getDefaultEndDate,
  getDefaultStartDate,
  loadSearchParams,
} from "@web/app/(dashboard)/coe/search-params";
import { COEPremiumChart } from "@web/components/coe/premium-chart";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { LAST_UPDATED_COE_KEY } from "@web/config";
import {
  calculateCategoryStats,
  groupCOEResultsByBidding,
} from "@web/lib/coe/calculations";
import { getCOEMonths, getCOEResultsFiltered } from "@web/lib/coe/queries";
import { createPageMetadata } from "@web/lib/metadata";
import { createWebPageStructuredData } from "@web/lib/metadata/structured-data";
import type { COECategory } from "@web/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

const COE_CATEGORIES: Record<string, COECategory> = {
  "category-a": "Category A",
  "category-b": "Category B",
  "category-c": "Category C",
  "category-d": "Category D",
  "category-e": "Category E",
};

const getCategoryFromSlug = (slug: string): COECategory | null => {
  return COE_CATEGORIES[slug] || null;
};

const _getSlugFromCategory = (category: COECategory): string => {
  return (
    Object.keys(COE_CATEGORIES).find(
      (key) => COE_CATEGORIES[key] === category,
    ) || ""
  );
};

export const generateStaticParams = async () => {
  return Object.keys(COE_CATEGORIES).map((category) => ({
    category,
  }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { category: categorySlug } = await params;
  const category = getCategoryFromSlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested COE category was not found.",
    };
  }

  const title = `COE ${category} Analysis`;
  const description = `Detailed analysis of Certificate of Entitlement (COE) prices and trends for ${category} vehicles in Singapore.`;

  return createPageMetadata({
    title,
    description,
    canonical: `/coe/categories/${categorySlug}`,
  });
};

const COECategoryPage = async ({ params, searchParams }: Props) => {
  const { category: categorySlug } = await params;
  const category = getCategoryFromSlug(categorySlug);

  if (!category) {
    notFound();
  }

  const { start, end } = await loadSearchParams(searchParams);
  const defaultStart = await getDefaultStartDate();
  const defaultEnd = await getDefaultEndDate();
  const startDate = start || defaultStart;
  const endDate = end || defaultEnd;

  const [coeResults, monthsResult, lastUpdated] = await Promise.all([
    getCOEResultsFiltered(undefined, startDate, endDate),
    getCOEMonths(),
    redis.get<number>(LAST_UPDATED_COE_KEY),
  ]);

  const months = monthsResult.map(({ month }) => month);

  // Filter data for the specific category
  const categoryResults = coeResults.filter(
    (result) => result.vehicle_class === category,
  );

  const data = groupCOEResultsByBidding(categoryResults);

  const title = `COE ${category} Analysis`;
  const description = `Detailed analysis of Certificate of Entitlement (COE) prices and trends for ${category} vehicles in Singapore.`;

  const structuredData = createWebPageStructuredData(
    title,
    description,
    `/coe/categories/${categorySlug}`,
  );

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-4">
        <PageHeader title={`${category} Analysis`} lastUpdated={lastUpdated} />
        <div className="grid grid-cols-1 gap-4">
          <COEPremiumChart data={data} months={months} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{category} Statistics</CardTitle>
            <CardDescription>
              Detailed statistics for {category} vehicles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const stats = calculateCategoryStats(categoryResults);
              return (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <Typography.H3 className="font-bold text-2xl">
                      {stats.totalRounds}
                    </Typography.H3>
                    <Typography.P className="text-muted-foreground text-sm">
                      Total Bidding Rounds
                    </Typography.P>
                  </div>
                  <div className="text-center">
                    <Typography.H3 className="font-bold text-2xl">
                      ${stats.averagePremium.toLocaleString()}
                    </Typography.H3>
                    <Typography.P className="text-muted-foreground text-sm">
                      Average Premium
                    </Typography.P>
                  </div>
                  <div className="text-center">
                    <Typography.H3 className="font-bold text-2xl">
                      ${stats.highestPremium.toLocaleString()}
                    </Typography.H3>
                    <Typography.P className="text-muted-foreground text-sm">
                      Highest Premium
                    </Typography.P>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default COECategoryPage;
