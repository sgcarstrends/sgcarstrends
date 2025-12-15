import { SITE_LINKS, SITE_URL } from "@web/config";
import { getAllPosts } from "@web/queries/posts";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    // {
    //   url: SITE_URL,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly" as const,
    // },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
    })),
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
}
