import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import { redis } from "@sgcarstrends/utils";
import {
  getDefaultEndDate,
  getDefaultStartDate,
  loadSearchParams,
} from "@web/app/(dashboard)/coe/search-params";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import { TrendTable } from "@web/components/tables/coe-results-table";
import Typography from "@web/components/typography";
import { LAST_UPDATED_COE_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import { getCOEResultsFiltered } from "@web/lib/coe/queries";
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

const COEBiddingPage = async ({ searchParams }: Props) => {
  const { start, end } = await loadSearchParams(searchParams);
  const defaultStart = await getDefaultStartDate();
  const defaultEnd = await getDefaultEndDate();
  const startDate = start || defaultStart;
  const endDate = end || defaultEnd;

  const [coeResults, lastUpdated] = await Promise.all([
    getCOEResultsFiltered(undefined, startDate, endDate),
    redis.get<number>(LAST_UPDATED_COE_KEY),
  ]);

  // Group results by bidding round
  const biddingRounds = coeResults.reduce<Record<string, COEResult[]>>(
    (acc, result) => {
      const key = `${result.month}-${result.bidding_no}`;
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
        <PageHeader title="Bidding Results" lastUpdated={lastUpdated} />

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Bidding Analysis</CardTitle>
              <CardDescription>
                Certificate of Entitlement (COE) bidding results and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      .reduce((sum, result) => sum + result.bids_received, 0)
                      .toLocaleString()}
                  </Typography.H3>
                  <Typography.TextSm>Total Bids Received</Typography.TextSm>
                </div>
              </div>
              <TrendTable coeResults={coeResults} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default COEBiddingPage;
