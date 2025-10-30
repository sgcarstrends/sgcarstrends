import Link from "next/link";

// Enable ISR with 1-hour revalidation
export const revalidate = 3600;

import { redis } from "@sgcarstrends/utils";
import { AnimatedNumber } from "@web/components/animated-number";
import { LatestCOEPrices } from "@web/components/coe/latest-coe-prices";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { Button } from "@web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { Progress } from "@web/components/ui/progress";
import { LAST_UPDATED_COE_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import {
  getCOEResults,
  getLatestCOEResults,
  getPQPData,
} from "@web/lib/data/coe";
import { createPageMetadata } from "@web/lib/metadata";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { formatPercent } from "@web/utils/format-percent";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

const title = "COE Overview";
const description =
  "Certificate of Entitlement (COE) analysis hub for Singapore vehicle registration. Explore historical results, trends, bidding data, and category-specific insights.";

export const generateMetadata = async (): Promise<Metadata> => {
  const results = await getLatestCOEResults();
  const categories = results.reduce<Record<string, number>>(
    (category, current) => {
      category[current.vehicle_class] = current.premium;
      return category;
    },
    {},
  );

  const images = `/api/og/coe?title=COE Results&subtitle=Overview&biddingNo=2&categoryA=${categories["Category A"]}&categoryB=${categories["Category B"]}&categoryC=${categories["Category C"]}&categoryD=${categories["Category D"]}&categoryE=${categories["Category E"]}`;

  return createPageMetadata({
    title,
    description,
    canonical: "/coe",
    images,
    keywords: [
      "COE bidding results",
      "Certificate of Entitlement Singapore",
      "COE prices",
      "vehicle quota premium",
      "COE trends",
      "COE categories",
      "Singapore COE analysis",
      "PQP rates",
    ],
    includeAuthors: true,
  });
};

const COEPricesPage = async () => {
  const [latestResults, allCoeResults, pqpRates] = await Promise.all([
    getLatestCOEResults(),
    getCOEResults(),
    getPQPData(),
  ]);
  const lastUpdated = await redis.get<number>(LAST_UPDATED_COE_KEY);

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/coe`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  const categories = ["Category A", "Category B", "Category E"];
  const summaryStats = categories
    .map((category) => {
      const categoryData = allCoeResults
        .filter((item) => item.vehicle_class === category)
        .sort(
          (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
        );

      if (categoryData.length === 0) return null;

      const premiums = categoryData.map(({ premium }) => premium);
      const highest = Math.max(...premiums);
      const lowest = Math.min(...premiums);

      // Find the records with dates
      const highestRecord = categoryData.find(
        ({ premium }) => premium === highest,
      );
      const lowestRecord = categoryData.find(
        ({ premium }) => premium === lowest,
      );

      return {
        category,
        highest,
        lowest,
        highestRecord: {
          date: highestRecord?.month,
          amount: highest,
        },
        lowestRecord: {
          date: lowestRecord?.month,
          amount: lowest,
        },
      };
    })
    .filter(Boolean);

  // Get latest PQP rates
  const latestPqpData = Object.entries(pqpRates)[0];
  const latestPqpMonth = latestPqpData[0];
  const latestPqpRates = latestPqpData[1];

  // Calculate Category A premium as percentage of Category B
  const categoryA =
    latestResults.find((r) => r.vehicle_class === "Category A")?.premium || 0;
  const categoryB =
    latestResults.find((r) => r.vehicle_class === "Category B")?.premium || 0;
  const categoryAPercentage = categoryB > 0 ? categoryA / categoryB : 0;

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-6">
        <PageHeader title="COE Overview" lastUpdated={lastUpdated} />

        <LatestCOEPrices results={latestResults} />

        <div className="space-y-4">
          <Typography.H2>Fun Facts</Typography.H2>
          <Card>
            <CardHeader>
              <CardTitle>Category A vs B</CardTitle>
              <CardDescription>
                Will the premium quota of Category A ever surpass Category B?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  <Progress value={categoryAPercentage * 100} className="h-4" />
                  <div className="mt-2 text-center">
                    <span className="font-bold text-lg text-primary">
                      {formatPercent(categoryAPercentage, {
                        maximumFractionDigits: 1,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {summaryStats.map((stat) => (
              <Card key={stat?.category}>
                <CardHeader>
                  <CardTitle>{stat?.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2 text-muted-foreground">
                      <div>
                        <div className="text-red-600">
                          Record High:{" "}
                          <span className="font-bold">
                            ${stat?.highest.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs">
                          {stat?.highestRecord.date &&
                            formatDateToMonthYear(stat.highestRecord.date)}
                        </div>
                      </div>
                      <div>
                        <div className="text-green-600">
                          Record Low:{" "}
                          <span className="font-bold">
                            ${stat?.lowest.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs">
                          {stat?.lowestRecord.date &&
                            formatDateToMonthYear(stat.lowestRecord.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Latest PQP Rates</CardTitle>
            <CardDescription>
              {latestPqpMonth &&
                `Prevailing Quota Premium rates for ${formatDateToMonthYear(latestPqpMonth)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {Object.entries(latestPqpRates)
                .filter(([key]) => categories.includes(key))
                .map(([category, rate]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between border-b pb-2 last-of-type:border-none"
                  >
                    <div className="font-bold">{category}</div>
                    <Typography.Lead className="font-bold text-primary">
                      S$
                      <AnimatedNumber value={rate} />
                    </Typography.Lead>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full flex-col gap-2">
              <div className="text-muted-foreground">
                Note: There is no PQP Premium for Category E
              </div>
              <Link href="/coe/pqp">
                <Button className="w-full">View All PQP Rates</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/*<COECategories />*/}
      </div>
    </>
  );
};

export default COEPricesPage;
