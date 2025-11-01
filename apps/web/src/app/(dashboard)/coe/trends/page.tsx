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
              <div className="flex flex-col gap-4">
                {trendInsights.map((insight) => (
                  <div
                    key={insight?.category}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <Typography.Text>{insight?.category}</Typography.Text>
                      <Typography.TextSm>
                        Latest: ${insight?.latest.toLocaleString()}
                      </Typography.TextSm>
                    </div>
                    <div className="text-right">
                      <Typography.Text
                        className={`font-medium ${
                          (insight?.change || 0) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {(insight?.change || 0) >= 0 ? "+" : ""}
                        {insight?.change.toFixed(1)}%
                      </Typography.Text>
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
              <div className="flex flex-col gap-4">
                {trendInsights.map((insight) => (
                  <div key={insight?.category} className="border-b pb-2">
                    <Typography.Text>{insight?.category}</Typography.Text>
                    <div className="flex flex-col gap-2">
                      <Typography.TextSm>
                        <span>Average:</span>
                        <span>${insight?.average.toLocaleString()}</span>
                      </Typography.TextSm>
                      <Typography.TextSm>
                        <span>Highest:</span>
                        <span>${insight?.highest.toLocaleString()}</span>
                      </Typography.TextSm>
                      <Typography.TextSm>
                        <span>Lowest:</span>
                        <span>${insight?.lowest.toLocaleString()}</span>
                      </Typography.TextSm>
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
