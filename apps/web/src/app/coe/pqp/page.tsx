import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StructuredData } from "@/components/structured-data";
import Typography from "@/components/typography";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { API_URL, LAST_UPDATED_COE_KEY, SITE_TITLE, SITE_URL } from "@/config";
import redis from "@/config/redis";
import { fetchApi } from "@/utils/fetch-api";
import { columns } from "./columns";
import type { PQP } from "@/types";
import type { WebPage, WithContext } from "schema-dts";

const title = "COE PQP Rates";
const description =
  "Latest Prevailing Quota Premium (PQP) rates for COE renewal in Singapore. These rates show the average COE prices over the last 3 months.";

export const generateMetadata = () => {
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
  const pqpRates = await fetchApi<Record<string, PQP>>(`${API_URL}/coe/pqp`);

  const lastUpdated = await redis.get<number>(LAST_UPDATED_COE_KEY);

  const data = Object.entries(pqpRates).map(([month, pqpRates]) => ({
    month,
    ...pqpRates,
  }));

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
        <PageHeader
          title="PQP RATES"
          lastUpdated={lastUpdated}
        />
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle>Understanding PQP Rates</AlertTitle>
          <AlertDescription>
            <Typography.P>
              Certificate of Entitlement (COE) Prevailing Quota Premium (PQP)
              rates are specific to Singapore&apos;s vehicle ownership system.
              They represent the average COE prices over the last 3 months,
              which car owners must pay to renew their existing vehicle&apos;s
              COE.
            </Typography.P>
            <Typography.P>
              The PQP system allows car owners to extend their COE for another 5
              or 10 years by paying the prevailing market rate rather than
              bidding in the open market. This is particularly relevant for
              owners who wish to keep their vehicles beyond the initial 10-year
              COE period.
            </Typography.P>
            <Typography.P>
              The Land Transport Authority (LTA) calculates and updates these
              rates monthly based on the moving average of COE prices in the
              preceding three months.
            </Typography.P>
          </AlertDescription>
        </Alert>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default PQPRatesPage;
