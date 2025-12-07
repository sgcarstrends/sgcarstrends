import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  loadSearchParams,
  type Period,
} from "@web/app/(dashboard)/coe/search-params";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import { TrendTable } from "@web/components/tables/coe-results-table";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { fetchCOEPageData } from "@web/lib/coe/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import type { COEResult } from "@web/types";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
  searchParams: Promise<SearchParams>;
}

const title = "COE Bidding Results";
const description =
  "Latest Certificate of Entitlement (COE) bidding results and analysis for Singapore vehicle registration.";

export const generateMetadata = (): Metadata => {
  return createPageMetadata({
    title,
    description,
    canonical: "/coe/bidding",
  });
};

const Page = async ({ searchParams }: Props) => {
  const { period } = await loadSearchParams(searchParams);

  return <COEBiddingPageContent period={period} />;
};

export default Page;

const COEBiddingPageContent = async ({ period }: { period: Period }) => {
  const { coeResults, lastUpdated } = await fetchCOEPageData(period);

  // Group results by bidding round
  const biddingRounds = coeResults.reduce<Record<string, COEResult[]>>(
    (acc, result) => {
      const key = `${result.month}-${result.biddingNo}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result);
      return acc;
    },
    {},
  );

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/coe/bidding`,
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
        <PageHeader title="Bidding Results" lastUpdated={lastUpdated}>
          <ShareButtons
            url={`${SITE_URL}/coe/bidding`}
            title={`COE Bidding Results - ${SITE_TITLE}`}
          />
        </PageHeader>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="flex flex-col items-start gap-2">
              <h3 className="font-medium text-foreground text-xl">
                Bidding Analysis
              </h3>
              <p className="text-default-600 text-sm">
                Certificate of Entitlement (COE) bidding results and statistics
              </p>
            </CardHeader>
            <CardBody>
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <Typography.H3>
                    {Object.keys(biddingRounds).length}
                  </Typography.H3>
                  <Typography.TextSm>Total Bidding Rounds</Typography.TextSm>
                </div>
                <div className="text-center">
                  <Typography.H3>{coeResults.length}</Typography.H3>
                  <Typography.TextSm>Total Results</Typography.TextSm>
                </div>
                <div className="text-center">
                  <Typography.H3>
                    {coeResults
                      .reduce((sum, result) => sum + result.bidsReceived, 0)
                      .toLocaleString()}
                  </Typography.H3>
                  <Typography.TextSm>Total Bids Received</Typography.TextSm>
                </div>
              </div>
              <TrendTable coeResults={coeResults} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
