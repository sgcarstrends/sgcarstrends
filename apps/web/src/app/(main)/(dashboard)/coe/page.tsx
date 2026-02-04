import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { KeyInsights } from "@web/app/(main)/(dashboard)/coe/components/key-insights";
import { PremiumRangeCard } from "@web/app/(main)/(dashboard)/coe/components/premium-range-card";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { AnimatedNumber } from "@web/components/animated-number";
import { LatestCoePremium } from "@web/components/coe/latest-coe-premium";
import { PageHeader } from "@web/components/page-header";
import { PageContext } from "@web/components/shared/page-context";
import { PAGE_CONTEXTS } from "@web/components/shared/page-contexts";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { loadCOEOverviewPageData } from "@web/lib/coe/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import { getLatestCoeResults } from "@web/queries/coe";
import { formatPercent } from "@web/utils/charts";
import { formatDateToMonthYear } from "@web/utils/formatting/format-date-to-month-year";
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
        <AnimatedSection order={0}>
          <PageHeader
            title="COE Overview"
            subtitle="Latest Certificate of Entitlement bidding results and premium trends."
            lastUpdated={lastUpdated}
          />
        </AnimatedSection>

        <AnimatedSection order={1}>
          <PageContext {...PAGE_CONTEXTS.coe} />
        </AnimatedSection>

        <AnimatedSection order={2}>
          <div className="flex flex-col gap-4">
            <Typography.H2>Latest COE Results</Typography.H2>

            {/* ROW 1: Hero Metrics - 5 Category Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <LatestCoePremium results={latestResults} trends={coeTrends} />
            </div>
          </div>
        </AnimatedSection>

        {/* ROW 2: Key Insights */}
        {keyInsights.length > 0 && (
          <AnimatedSection order={3}>
            <KeyInsights insights={keyInsights} />
          </AnimatedSection>
        )}

        {/* ROW 3: Bento Grid - Fun Facts + PQP Rates side by side */}
        <AnimatedSection order={4}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Fun Facts Card */}
            <Card className="rounded-2xl p-3">
              <CardHeader className="flex flex-col items-start gap-2">
                <Typography.H4>Category A vs B</Typography.H4>
                <Typography.TextSm>
                  Will the premium quota of Category A ever surpass Category B?
                </Typography.TextSm>
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
                      <Typography.TextSm className="text-default-500">
                        Category A is{" "}
                        {formatPercent(categoryAPercentage, {
                          maximumFractionDigits: 0,
                        })}{" "}
                        of Category B
                      </Typography.TextSm>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Latest PQP Rates Card */}
            <Card className="rounded-2xl p-3">
              <CardHeader className="flex flex-col items-start gap-2">
                <Typography.H4>Latest PQP Rates</Typography.H4>
                <Typography.TextSm>
                  {latestPqpMonth &&
                    `Prevailing Quota Premium for ${formatDateToMonthYear(latestPqpMonth)}`}
                </Typography.TextSm>
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
                  <Button color="primary" className="w-full rounded-full">
                    View All PQP Rates
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </AnimatedSection>

        {/* ROW 4: Premium Ranges - 5 Column Grid */}
        <AnimatedSection order={5}>
          <div className="flex flex-col gap-4">
            <Typography.H2>Premium Ranges</Typography.H2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <PremiumRangeCard stats={premiumRangeStats} />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
};

export default COEOverviewPage;
