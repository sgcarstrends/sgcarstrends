import { Button } from "@sgcarstrends/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import { Progress } from "@sgcarstrends/ui/components/progress";
import { redis } from "@sgcarstrends/utils";
import { LatestCOEPrices } from "@web/app/(dashboard)/coe/_components/latest-coe-prices";
import { AnimatedNumber } from "@web/components/animated-number";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { LAST_UPDATED_COE_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import { calculateOverviewStats } from "@web/lib/coe/calculations";
import {
  getCOEResults,
  getLatestCOEResults,
  getPQPData,
} from "@web/lib/coe/queries";
import { createPageMetadata } from "@web/lib/metadata";
import { formatPercent } from "@web/utils/charts";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import type { Metadata } from "next";
import Link from "next/link";
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
  const summaryStats = calculateOverviewStats(allCoeResults, categories);

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

        <div className="flex flex-col gap-4">
          <Typography.H2>Fun Facts</Typography.H2>
          <Card>
            <CardHeader>
              <CardTitle>Category A vs B</CardTitle>
              <CardDescription>
                Will the premium quota of Category A ever surpass Category B?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-muted-foreground">
                  <Progress value={categoryAPercentage * 100} className="h-4" />
                  <div className="text-center">
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
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-2 text-muted-foreground">
                      <div>
                        <div className="text-red-600">
                          Record High:{" "}
                          <span className="font-semibold">
                            ${stat?.highest.toLocaleString()}
                          </span>
                        </div>
                        <Typography.Caption>
                          {stat?.highestRecord.date &&
                            formatDateToMonthYear(stat.highestRecord.date)}
                        </Typography.Caption>
                      </div>
                      <div>
                        <div className="text-green-600">
                          Record Low:{" "}
                          <span className="font-semibold">
                            ${stat?.lowest.toLocaleString()}
                          </span>
                        </div>
                        <Typography.Caption>
                          {stat?.lowestRecord.date &&
                            formatDateToMonthYear(stat.lowestRecord.date)}
                        </Typography.Caption>
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
                    <Typography.H4>{category}</Typography.H4>
                    <Typography.Lead className="text-primary">
                      S$
                      <AnimatedNumber value={rate} />
                    </Typography.Lead>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full flex-col gap-2">
              <Typography.TextSm>
                Note: There is no PQP Premium for Category E
              </Typography.TextSm>
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
