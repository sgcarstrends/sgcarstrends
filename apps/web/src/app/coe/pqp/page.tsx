import { Alert } from "@heroui/alert";
import { redis } from "@sgcarstrends/utils";
import { PQPCalculator } from "@web/components/coe/pqp-calculator";
import { PQPTable } from "@web/components/coe/pqp-table";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import {
  API_URL,
  LAST_UPDATED_COE_KEY,
  SITE_TITLE,
  SITE_URL,
} from "@web/config";
import type { PQP } from "@web/types";
import { getLatestCOEResults } from "@web/utils/api/coe";
import { fetchApi } from "@web/utils/fetch-api";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

const title = "COE PQP Rates";
const description =
  "Latest Prevailing Quota Premium (PQP) rates for COE renewal in Singapore. These rates show the average COE prices over the last 3 months.";

export const generateMetadata = (): Metadata => {
  const canonical = "/coe/pqp";

  return {
    title,
    description,
    openGraph: {
      images: `${SITE_URL}/opengraph-image.png`,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      images: `${SITE_URL}/twitter-image.png`,
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

const PQPRatesPage = async () => {
  const [pqpRates, latestCOEResults] = await Promise.all([
    fetchApi<Record<string, PQP>>(`${API_URL}/coe/pqp`),
    getLatestCOEResults(),
  ]);

  const lastUpdated = await redis.get<number>(LAST_UPDATED_COE_KEY);

  const rows = Object.entries(pqpRates).map(([month, pqpRates]) => ({
    key: month,
    month,
    ...pqpRates,
  }));

  const columns = [
    { key: "month", label: "Month", sortable: true },
    { key: "Category A", label: "Category A" },
    { key: "Category B", label: "Category B" },
    { key: "Category C", label: "Category C" },
    { key: "Category D", label: "Category D" },
  ];

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/coe/pqp`,
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-y-4">
        <PageHeader title="PQP RATES" lastUpdated={lastUpdated} />
        <Alert
          hideIconWrapper
          color="primary"
          variant="faded"
          title="Understanding PQP Rates"
          description={
            <div className="flex flex-col gap-2">
              <p>
                Certificate of Entitlement (COE) Prevailing Quota Premium (PQP)
                rates are specific to Singapore&apos;s vehicle ownership system.
                They represent the average COE prices over the last 3 months,
                which car owners must pay to renew their existing vehicle&apos;s
                COE.
              </p>
              <p>
                The PQP system allows car owners to extend their COE for another
                5 or 10 years by paying the prevailing market rate rather than
                bidding in the open market. This is particularly relevant for
                owners who wish to keep their vehicles beyond the initial
                10-year COE period.
              </p>
              <p>
                The Land Transport Authority (LTA) calculates and updates these
                rates monthly based on the moving average of COE prices in the
                preceding three months.
              </p>
            </div>
          }
        />
        <PQPTable rows={rows} columns={columns} />
        <UnreleasedFeature>
          <PQPCalculator
            pqpData={pqpRates}
            latestCOEResults={latestCOEResults}
          />
        </UnreleasedFeature>
      </div>
    </>
  );
};

export default PQPRatesPage;
