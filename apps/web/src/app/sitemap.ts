import { API_URL, SITE_LINKS, SITE_URL } from "@web/config";
import { fetchApi } from "@web/utils/fetch-api";
import slugify from "@sindresorhus/slugify";
import type { Make } from "@web/types";
import type { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const makes = await fetchApi<Make[]>(`${API_URL}/cars/makes`);

  return [
    // {
    //   url: SITE_URL,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly" as const,
    // },
    {
      url: `${SITE_URL}/visitors`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
    },
    {
      url: `${SITE_URL}/cars`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
    },
    ...SITE_LINKS.map((link) => ({
      url: `${SITE_URL}${link.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
    })),
    ...makes.map((make) => ({
      url: `${SITE_URL}/cars/makes/${slugify(make)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
    })),
    {
      url: `${SITE_URL}/legal/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
    },
    {
      url: `${SITE_URL}/legal/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
    },
  ];
};

export default sitemap;
