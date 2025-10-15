import { redis } from "@sgcarstrends/utils";
import {
  getDefaultEndDate,
  getDefaultStartDate,
  loadSearchParams,
} from "@web/app/(dashboard)/coe/search-params";
import { COEPremiumChart } from "@web/components/COE-premium-chart";
import { COECategories } from "@web/components/coe-categories";
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
import {
  API_URL,
  LAST_UPDATED_COE_KEY,
  SITE_TITLE,
  SITE_URL,
} from "@web/config";
import {
  type COEBiddingResult,
  type COEResult,
  type Month,
  RevalidateTags,
} from "@web/types";
import { fetchApi } from "@web/utils/fetch-api";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
  searchParams: Promise<SearchParams>;
}

const title = "COE Trends Analysis";
const description =
  "Comprehensive analysis of Certificate of Entitlement (COE) price trends, patterns, and market insights for Singapore vehicle registration.";

export const generateMetadata = (): Metadata => {
  const canonical = "/coe/trends";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

const COETrendsPage = async ({ searchParams }: Props) => {
  const { start, end } = await loadSearchParams(searchParams);
  const defaultStart = await getDefaultStartDate();
  const defaultEnd = await getDefaultEndDate();
  const params = new URLSearchParams({
    start: start || defaultStart,
    end: end || defaultEnd,
  });

  const [coeResults, months]: [COEResult[], Month[]] = await Promise.all([
    fetchApi<COEResult[]>(`${API_URL}/coe?${params.toString()}`, {
      next: { tags: [RevalidateTags.COE] },
    }),
    fetchApi<Month[]>(`${API_URL}/coe/months`),
  ]);

  const lastUpdated = await redis.get<number>(LAST_UPDATED_COE_KEY);

  const groupedData = coeResults.reduce<COEBiddingResult[]>(
    (acc: any, item) => {
      const key = `${item.month}-${item.bidding_no}`;

      if (!acc[key]) {
        acc[key] = {
          month: item.month,
          biddingNo: item.bidding_no,
        };
      }
      acc[key][item.vehicle_class] = item.premium;

      return acc;
    },
    [],
  );

  const data: COEBiddingResult[] = Object.values(groupedData);

  // Calculate trend insights
  const calculateTrendInsights = (data: COEBiddingResult[]) => {
    const categories = [
      "Category A",
      "Category B",
      "Category C",
      "Category D",
      "Category E",
    ];
    const insights = categories
      .map((category) => {
        const categoryData = data
          .filter((item) => item[category as keyof COEBiddingResult])
          .map((item) => ({
            month: item.month,
            premium: item[category as keyof COEBiddingResult] as number,
          }))
          .sort((a, b) => a.month.localeCompare(b.month));

        if (categoryData.length === 0) return null;

        const latest = categoryData[categoryData.length - 1];
        const previous = categoryData[categoryData.length - 2];
        const change = previous
          ? ((latest.premium - previous.premium) / previous.premium) * 100
          : 0;

        const highest = Math.max(...categoryData.map((d) => d.premium));
        const lowest = Math.min(...categoryData.map((d) => d.premium));
        const average =
          categoryData.reduce((sum, d) => sum + d.premium, 0) /
          categoryData.length;

        return {
          category,
          latest: latest.premium,
          change,
          highest,
          lowest,
          average,
        };
      })
      .filter(Boolean);

    return insights;
  };

  const trendInsights = calculateTrendInsights(data);

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/coe/trends`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-4">
        <PageHeader title="Trends Analysis" lastUpdated={lastUpdated} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-9">
            <COEPremiumChart data={data} months={months} />
          </div>
          <div className="xl:col-span-3">
            <COECategories />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>
                Latest price movements and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendInsights.map((insight) => (
                  <div
                    key={insight?.category}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <Typography.P className="font-medium">
                        {insight?.category}
                      </Typography.P>
                      <Typography.P className="text-muted-foreground text-sm">
                        Latest: ${insight?.latest.toLocaleString()}
                      </Typography.P>
                    </div>
                    <div className="text-right">
                      <Typography.P
                        className={`font-medium ${
                          (insight?.change || 0) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {(insight?.change || 0) >= 0 ? "+" : ""}
                        {insight?.change.toFixed(1)}%
                      </Typography.P>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price Statistics</CardTitle>
              <CardDescription>
                Historical price ranges and averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendInsights.map((insight) => (
                  <div key={insight?.category} className="border-b pb-2">
                    <Typography.P className="mb-1 font-medium">
                      {insight?.category}
                    </Typography.P>
                    <div className="space-y-1 text-muted-foreground text-sm">
                      <div className="flex justify-between">
                        <span>Average:</span>
                        <span>${insight?.average.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Highest:</span>
                        <span>${insight?.highest.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lowest:</span>
                        <span>${insight?.lowest.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default COETrendsPage;
