import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { KeyInsights } from "@web/app/(dashboard)/coe/_components/key-insights";
import { PremiumRangeCard } from "@web/app/(dashboard)/coe/_components/premium-range-card";
import { AnimatedNumber } from "@web/components/animated-number";
import { LatestCoePremium } from "@web/components/coe/latest-coe-premium";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
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
  "Certificate of Entitlement (COE) analysis hub for Singapore vehicle registration. View latest premiums, trends, and category-specific insights.";

export const generateMetadata = async (): Promise<Metadata> => {
  const results = await getLatestCoeResults();
  const categories = results.reduce<Record<string, number>>(
    (category, current) => {
      category[current.vehicleClass] = current.premium;
      return category;
    },
    {},
  );

  const images = `/api/og/coe?title=COE Overview&subtitle=Overview&biddingNo=2&categoryA=${categories["Category A"]}&categoryB=${categories["Category B"]}&categoryC=${categories["Category C"]}&categoryD=${categories["Category D"]}&categoryE=${categories["Category E"]}`;

  return createPageMetadata({
    title,
    description,
    canonical: "/coe",
    images,
    includeAuthors: true,
  });
};

const COEOverviewPage = async () => {
  const {
    coeTrends,
    latestResults,
    pqpRates,
    lastUpdated,
    premiumRangeStats,
    movers,
    keyInsights,
  } = await loadCOEOverviewPageData();

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

  // Get latest PQP rates
  const latestPqpData = Object.entries(pqpRates)[0];
  const latestPqpMonth = latestPqpData?.[0] ?? "";
  const latestPqpRates = latestPqpData?.[1] ?? {};

  // Calculate Category A premium as percentage of Category B
  const categoryA =
    latestResults.find((result) => result.vehicleClass === "Category A")
      ?.premium || 0;
  const categoryB =
    latestResults.find((result) => result.vehicleClass === "Category B")
      ?.premium || 0;
  const categoryAPercentage = categoryB > 0 ? categoryA / categoryB : 0;

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-8">
        <PageHeader
          title="COE Overview"
          subtitle="Latest Certificate of Entitlement bidding results and premium trends."
          lastUpdated={lastUpdated}
        >
          <ShareButtons
            url={`${SITE_URL}/coe`}
            title={`COE Overview - ${SITE_TITLE}`}
          />
        </PageHeader>

        <Typography.H2>Latest COE Results</Typography.H2>

        {/* ROW 1: Hero Metrics - 5 Category Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <LatestCoePremium results={latestResults} trends={coeTrends} />
        </div>

        {/* ROW 2: Key Insights */}
        {keyInsights.length > 0 && <KeyInsights insights={keyInsights} />}

        {/* ROW 3: Bento Grid - Fun Facts + PQP Rates side by side */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Fun Facts Card */}
          <Card className="p-3">
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
                <div className="flex flex-col gap-2">
                  <Progress value={categoryAPercentage * 100} size="lg" />
                  <div className="text-center">
                    <span className="font-bold text-2xl text-primary tabular-nums">
                      {formatPercent(categoryAPercentage, {
                        maximumFractionDigits: 1,
                      })}
                    </span>
                    <p className="text-default-500 text-sm">
                      Category A is{" "}
                      {formatPercent(categoryAPercentage, {
                        maximumFractionDigits: 0,
                      })}{" "}
                      of Category B
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Latest PQP Rates Card */}
          <Card className="p-3">
            <CardHeader className="flex flex-col items-start gap-2">
              <h3 className="font-medium text-foreground text-xl">
                Latest PQP Rates
              </h3>
              <p className="text-default-600 text-sm">
                {latestPqpMonth &&
                  `Prevailing Quota Premium for ${formatDateToMonthYear(latestPqpMonth)}`}
              </p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
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
                    <div key={category} className="flex flex-col gap-1">
                      <Typography.TextSm className="text-default-500">
                        {category}
                      </Typography.TextSm>
                      <span className="font-bold text-primary text-xl tabular-nums">
                        <AnimatedNumber value={rate} format="currency" />
                      </span>
                    </div>
                  ))}
              </div>
            </CardBody>
            <CardFooter className="flex-col items-start gap-2">
              <Typography.Caption>
                Note: There is no PQP for Category E
              </Typography.Caption>
              <Link href="/coe/pqp" className="w-full">
                <Button color="primary" className="w-full">
                  View All PQP Rates
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* ROW 4: Premium Ranges - 5 Column Grid */}
        <div className="flex flex-col gap-4">
          <Typography.H2>Premium Ranges</Typography.H2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <PremiumRangeCard stats={premiumRangeStats} />
          </div>
        </div>
      </div>
    </>
  );
};

export default COEOverviewPage;
