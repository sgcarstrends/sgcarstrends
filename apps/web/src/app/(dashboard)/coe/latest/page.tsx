import { redis } from "@sgcarstrends/utils";
import { StructuredData } from "@web/components/structured-data";
import { LAST_UPDATED_COE_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import { getLatestCOEResults } from "@web/lib/coe/queries";
import { createPageMetadata } from "@web/lib/metadata";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";
import { LatestCOEClient } from "./latest-coe-content";

const title = "Latest COE Prices";
const description =
  "Latest Certificate of Entitlement (COE) bidding results for all categories. View the most recent COE premiums and bidding information for Singapore vehicle registration.";

export const generateMetadata = async (): Promise<Metadata> => {
  const results = await getLatestCOEResults();
  const categories = results.reduce<Record<string, number>>(
    (category, current) => {
      category[current.vehicle_class] = current.premium;
      return category;
    },
    {},
  );

  const images = `/api/og/coe?title=Latest COE Prices&subtitle=Current Results&biddingNo=${results[0]?.bidding_no || 1}&categoryA=${categories["Category A"]}&categoryB=${categories["Category B"]}&categoryC=${categories["Category C"]}&categoryD=${categories["Category D"]}&categoryE=${categories["Category E"]}`;

  return createPageMetadata({
    title,
    description,
    canonical: "/coe/latest",
    images,
  });
};

const LatestCOEPage = async () => {
  const [latestResults, lastUpdated] = await Promise.all([
    getLatestCOEResults(),
    redis.get<number>(LAST_UPDATED_COE_KEY),
  ]);

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/coe/latest`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <LatestCOEClient results={latestResults} lastUpdated={lastUpdated} />
    </>
  );
};

export default LatestCOEPage;
