import { SITE_TITLE, SITE_URL } from "@web/config";
import type { WebPage, WithContext } from "schema-dts";

export const createWebPageStructuredData = (
  title: string,
  description: string,
  url: string,
): WithContext<WebPage> => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  url,
  publisher: {
    "@type": "Organization",
    name: SITE_TITLE,
    url: SITE_URL,
  },
});

export const createWebPageStructuredDataWithPartOf = (
  title: string,
  description: string,
  url: string,
): WithContext<WebPage> => ({
  ...createWebPageStructuredData(title, description, url),
  isPartOf: {
    "@type": "WebSite",
    name: SITE_TITLE,
    url: SITE_URL,
  },
});
