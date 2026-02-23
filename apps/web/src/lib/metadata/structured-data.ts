import { SITE_TITLE, SITE_URL } from "@web/config";
import type { Dataset, WebPage, WithContext } from "schema-dts";

export const createWebPageStructuredData = (
  title: string,
  description: string,
  path: string,
): WithContext<WebPage> => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  url: `${SITE_URL}${path}`,
  publisher: {
    "@type": "Organization",
    name: SITE_TITLE,
    url: SITE_URL,
  },
});

/**
 * Generate Dataset schema for Singapore car registration data
 */
export const generateDatasetSchema = (): Dataset => ({
  "@type": "Dataset",
  name: "Singapore Car Registration Data",
  description:
    "Comprehensive monthly vehicle registration statistics for Singapore, including breakdowns by manufacturer, fuel type, and vehicle category. Data sourced from Singapore's Land Transport Authority (LTA).",
  url: `${SITE_URL}/cars`,
  creator: {
    "@type": "Organization",
    name: "SG Cars Trends",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "SG Cars Trends",
    url: SITE_URL,
  },
  provider: {
    "@type": "Organization",
    name: "Land Transport Authority",
    url: "https://www.lta.gov.sg",
    description: "Singapore's transport regulatory authority",
  },
  spatialCoverage: {
    "@type": "Place",
    name: "Singapore",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 1.3521,
      longitude: 103.8198,
    },
  },
  temporalCoverage: "2020-01/2024-12",
  license:
    "https://www.lta.gov.sg/content/ltagov/en/footer/data-gov-sg-terms-of-use.html",
  distribution: [
    {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: `${SITE_URL}/api/cars/registrations`,
    },
  ],
  measurementTechnique: "Official government vehicle registration records",
  variableMeasured: [
    "Vehicle registrations by month",
    "Market share by manufacturer",
    "Fuel type distribution",
    "Vehicle category breakdown",
  ],
});
