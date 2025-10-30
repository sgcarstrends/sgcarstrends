import { SITE_TITLE, SITE_URL } from "@web/config";
import type { WebPage, WithContext } from "schema-dts";

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
