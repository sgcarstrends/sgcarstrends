import { Card, CardBody, CardHeader } from "@heroui/card";
import { BiddingRoundCards } from "@web/app/(main)/(dashboard)/coe/components/bidding-round-cards";
import { COEPremiumChart } from "@web/app/(main)/(dashboard)/coe/components/premium-chart";
import { loadSearchParams } from "@web/app/(main)/(dashboard)/coe/search-params";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import { TrendTable } from "@web/components/tables/coe-results-table";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { loadResultsPageData } from "@web/lib/coe/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import { getLatestCoeResults } from "@web/queries/coe";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const title = "COE Results";
const description =
  "Complete historical COE bidding results for Singapore. Explore trends, analyze price movements, and view detailed data for all vehicle categories.";

export const generateMetadata = async (): Promise<Metadata> => {
  const results = await getLatestCoeResults();
  const categories = results.reduce<Record<string, number>>(
    (category, current) => {
      category[current.vehicleClass] = current.premium;
      return category;
    },
    {},
  );

  const images = `/api/og/coe?title=COE Results&subtitle=Historical Data&biddingNo=2&categoryA=${categories["Category A"]}&categoryB=${categories["Category B"]}&categoryC=${categories["Category C"]}&categoryD=${categories["Category D"]}&categoryE=${categories["Category E"]}`;

  return createPageMetadata({
    title,
    description,
    canonical: "/coe/results",
    images,
    includeAuthors: true,
  });
};

const COEResultsPage = async ({ searchParams }: PageProps) => {
  const { period, month } = await loadSearchParams(searchParams);
  const {
    coeResults,
    chartData,
    lastUpdated,
    months,
    biddingMonth,
    firstRound,
    secondRound,
  } = await loadResultsPageData(period, month ?? undefined);

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/coe/results`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-6">
        <AnimatedSection order={0}>
          <PageHeader
            title="COE Results"
            subtitle="Historical COE bidding results by category and month."
            lastUpdated={lastUpdated}
            months={months}
            latestMonth={months[0]}
            showMonthSelector
          >
            <ShareButtons
              url={`${SITE_URL}/coe/results`}
              title={`COE Results - ${SITE_TITLE}`}
            />
          </PageHeader>
        </AnimatedSection>

        {/* Bidding Rounds for Current Month */}
        {firstRound.length > 0 && (
          <AnimatedSection order={1}>
            <BiddingRoundCards
              month={biddingMonth}
              firstRound={firstRound}
              secondRound={secondRound}
            />
          </AnimatedSection>
        )}

        {/* Premium Chart - Full Width */}
        <AnimatedSection order={2}>
          <COEPremiumChart data={chartData} />
        </AnimatedSection>

        {/* Historical Data Table - Full Width */}
        <AnimatedSection order={3}>
          <Card className="rounded-2xl p-3">
            <CardHeader className="flex flex-col items-start gap-2">
              <Typography.H4>Historical Data</Typography.H4>
              <Typography.TextSm>
                Complete list of historical COE prices
              </Typography.TextSm>
            </CardHeader>
            <CardBody>
              <TrendTable coeResults={coeResults} />
            </CardBody>
          </Card>
        </AnimatedSection>
      </div>
    </>
  );
};

export default COEResultsPage;
