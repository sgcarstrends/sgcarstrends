import { redis } from "@sgcarstrends/utils";
import { StructuredData } from "@web/components/structured-data";
import {
  API_URL,
  LAST_UPDATED_COE_KEY,
  SITE_TITLE,
  SITE_URL,
} from "@web/config";
import { type COEResult, RevalidateTags } from "@web/types";
import { fetchApi } from "@web/utils/fetch-api";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";
import { LatestCOEClient } from "./latest-coe-client";

const title = "Latest COE Prices";
const description =
  "Latest Certificate of Entitlement (COE) bidding results for all categories. View the most recent COE premiums and bidding information for Singapore vehicle registration.";

export const generateMetadata = async (): Promise<Metadata> => {
  const results = await fetchApi<COEResult[]>(`${API_URL}/coe/latest`);
  const categories = results.reduce<Record<string, number>>(
    (category, current) => {
      category[current.vehicle_class] = current.premium;
      return category;
    },
    {},
  );

  const canonical = "/coe/latest";
  const images = `/api/og/coe?title=Latest COE Prices&subtitle=Current Results&biddingNo=${results[0]?.bidding_no || 1}&categoryA=${categories["Category A"]}&categoryB=${categories["Category B"]}&categoryC=${categories["Category C"]}&categoryD=${categories["Category D"]}&categoryE=${categories["Category E"]}`;

  return {
    title,
    description,
    openGraph: {
      images,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      images,
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

const LatestCOEPage = async () => {
  const latestResults = await fetchApi<COEResult[]>(`${API_URL}/coe/latest`, {
    next: { tags: [RevalidateTags.COE] },
  });
  const lastUpdated = await redis.get<number>(LAST_UPDATED_COE_KEY);

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
