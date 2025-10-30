import { COECategories } from "@web/app/(dashboard)/coe/_components/coe-categories";
import { COEPremiumChart } from "@web/app/(dashboard)/coe/_components/premium-chart";
import { loadSearchParams } from "@web/app/(dashboard)/coe/search-params";
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
import { calculateTrendInsights } from "@web/lib/coe/calculations";
import { fetchCOEPageData } from "@web/lib/coe/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import { createWebPageStructuredData } from "@web/lib/metadata/structured-data";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

const title = "COE Trends Analysis";
const description =
  "Comprehensive analysis of Certificate of Entitlement (COE) price trends, patterns, and market insights for Singapore vehicle registration.";

export const generateMetadata = (): Metadata => {
  return createPageMetadata({
    title,
    description,
    canonical: "/coe/trends",
  });
};

const COETrendsPage = async ({ searchParams }: Props) => {
  const { start, end } = await loadSearchParams(searchParams);
  const { months, lastUpdated, data } = await fetchCOEPageData(start, end);
  const trendInsights = calculateTrendInsights(data);

  const structuredData = createWebPageStructuredData(
    title,
    description,
    "/coe/trends",
  );

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
