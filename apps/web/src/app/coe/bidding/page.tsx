import { type SearchParams } from "nuqs/server";
import {
  loadSearchParams,
  getDefaultStartDate,
  getDefaultEndDate,
} from "@web/app/coe/search-params";
import { TrendTable } from "@web/app/coe/trend-table";
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
import {
  API_URL,
  LAST_UPDATED_COE_KEY,
  SITE_TITLE,
  SITE_URL,
} from "@web/config";
import redis from "@web/config/redis";
import { type COEResult, RevalidateTags } from "@web/types";
import { fetchApi } from "@web/utils/fetch-api";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
  searchParams: Promise<SearchParams>;
}

const title = "COE Bidding Results";
const description =
  "Latest Certificate of Entitlement (COE) bidding results and analysis for Singapore vehicle registration.";

export const generateMetadata = (): Metadata => {
  const canonical = "/coe/bidding";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

const COEBiddingPage = async ({ searchParams }: Props) => {
  const { start, end } = await loadSearchParams(searchParams);
  const defaultStart = await getDefaultStartDate();
  const defaultEnd = await getDefaultEndDate();
  const params = new URLSearchParams({
    start: start || defaultStart,
    end: end || defaultEnd,
  });

  const coeResults = await fetchApi<COEResult[]>(
    `${API_URL}/coe?${params.toString()}`,
    {
      next: { tags: [RevalidateTags.COE] },
    },
  );

  const lastUpdated = await redis.get<number>(LAST_UPDATED_COE_KEY);

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
                  <Typography.H3 className="text-2xl font-bold">
                    {Object.keys(biddingRounds).length}
                  </Typography.H3>
                  <Typography.P className="text-muted-foreground text-sm">
                    Total Bidding Rounds
                  </Typography.P>
                </div>
                <div className="text-center">
                  <Typography.H3 className="text-2xl font-bold">
                    {coeResults.length}
                  </Typography.H3>
                  <Typography.P className="text-muted-foreground text-sm">
                    Total Results
                  </Typography.P>
                </div>
                <div className="text-center">
                  <Typography.H3 className="text-2xl font-bold">
                    {coeResults
                      .reduce((sum, result) => sum + result.bids_received, 0)
                      .toLocaleString()}
                  </Typography.H3>
                  <Typography.P className="text-muted-foreground text-sm">
                    Total Bids Received
                  </Typography.P>
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
