import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { PremiumRangeCard } from "@web/app/(dashboard)/coe/_components/premium-range-card";
import { AnimatedNumber } from "@web/components/animated-number";
import { LatestCoePremium } from "@web/components/coe/latest-coe-premium";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { calculatePremiumRangeStats } from "@web/lib/coe/calculations";
import { loadCOEOverviewPageData } from "@web/lib/coe/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import { getLatestCoeResults } from "@web/queries/coe";
import { formatPercent } from "@web/utils/charts";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import type { Metadata } from "next";
import Link from "next/link";
import type { WebPage, WithContext } from "schema-dts";

const title = "COE Overview";
const description =
  "Certificate of Entitlement (COE) analysis hub for Singapore vehicle registration. Explore historical results, trends, bidding data, and category-specific insights.";

export const generateMetadata = async (): Promise<Metadata> => {
  const results = await getLatestCoeResults();
  const categories = results.reduce<Record<string, number>>(
    (category, current) => {
      category[current.vehicleClass] = current.premium;
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
  const { coeTrends, latestResults, allCoeResults, pqpRates, lastUpdated } =
    await loadCOEOverviewPageData();

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

  const allCategories = [
    "Category A",
    "Category B",
    "Category C",
    "Category D",
    "Category E",
  ];
  const premiumRangeStats = calculatePremiumRangeStats(
    allCoeResults,
    allCategories,
  );

  // Get latest PQP rates
  const latestPqpData = Object.entries(pqpRates)[0];
  const latestPqpMonth = latestPqpData[0];
  const latestPqpRates = latestPqpData[1];

  // Calculate Category A premium as percentage of Category B
  const categoryA =
    latestResults.find((r) => r.vehicleClass === "Category A")?.premium || 0;
  const categoryB =
    latestResults.find((r) => r.vehicleClass === "Category B")?.premium || 0;
  const categoryAPercentage = categoryB > 0 ? categoryA / categoryB : 0;

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-6">
        <PageHeader title="COE Overview" lastUpdated={lastUpdated} />

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          <LatestCoePremium results={latestResults} trends={coeTrends} />
        </div>

        <div className="flex flex-col gap-4">
          <Typography.H2>Fun Facts</Typography.H2>
          <Card>
            <CardHeader className="flex flex-col items-start gap-2">
              <h3 className="font-medium text-foreground text-xl">
                Category A vs B
              </h3>
              <p className="text-default-600 text-sm">
                Will the premium quota of Category A ever surpass Category B?
              </p>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-muted-foreground">
                  <Progress value={categoryAPercentage * 100} size="md" />
                  <div className="text-center">
                    <span className="font-bold text-lg text-primary">
                      {formatPercent(categoryAPercentage, {
                        maximumFractionDigits: 1,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Typography.H2>Premium Ranges</Typography.H2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <PremiumRangeCard stats={premiumRangeStats} />
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col items-start gap-2">
            <h3 className="font-medium text-foreground text-xl">
              Latest PQP Rates
            </h3>
            <p className="text-default-600 text-sm">
              {latestPqpMonth &&
                `Prevailing Quota Premium rates for ${formatDateToMonthYear(latestPqpMonth)}`}
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              {Object.entries(latestPqpRates)
                .filter(([key]) =>
                  [
                    "Category A",
                    "Category B",
                    "Category C",
                    "Category D",
                  ].includes(key),
                )
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
          </CardBody>
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
