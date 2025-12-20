import { Card, CardBody, CardHeader } from "@heroui/card";
import { BiddingRoundCards } from "@web/app/(dashboard)/coe/_components/bidding-round-cards";
import { COEPremiumChart } from "@web/app/(dashboard)/coe/_components/premium-chart";
import { loadSearchParams } from "@web/app/(dashboard)/coe/search-params";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import { TrendTable } from "@web/components/tables/coe-results-table";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { loadResultsPageData } from "@web/lib/coe/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import { getLatestCoeResults } from "@web/queries/coe";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
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

const COEResultsPage = async ({ searchParams }: Props) => {
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
        <PageHeader
          title="COE Results"
          lastUpdated={lastUpdated}
          months={months}
          showMonthSelector
        >
          <ShareButtons
            url={`${SITE_URL}/coe/results`}
            title={`COE Results - ${SITE_TITLE}`}
          />
        </PageHeader>

        {/* Bidding Rounds for Current Month */}
        {firstRound.length > 0 && (
          <BiddingRoundCards
            month={biddingMonth}
            firstRound={firstRound}
            secondRound={secondRound}
          />
        )}

        {/* Premium Chart - Full Width */}
        <COEPremiumChart data={chartData} />

        {/* Historical Data Table - Full Width */}
        <Card className="p-3">
          <CardHeader className="flex flex-col items-start gap-2">
            <h3 className="font-medium text-foreground text-xl">
              Historical Data
            </h3>
            <p className="text-default-600 text-sm">
              Complete list of historical COE prices
            </p>
          </CardHeader>
          <CardBody>
            <TrendTable coeResults={coeResults} />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default COEResultsPage;
