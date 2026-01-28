import { BlogList } from "@web/app/(main)/blog/components/blog-list";
import { BlogPageHeader } from "@web/app/(main)/blog/components/blog-page-header";
import { PopularPosts } from "@web/app/(main)/blog/components/popular-posts";
import { StructuredData } from "@web/components/structured-data";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { getPopularPostsWithData } from "@web/lib/data/posts";
import { getAllPosts } from "@web/queries/posts";
import type { Metadata } from "next";
import type { Blog, WithContext } from "schema-dts";

const title = "Blog";
const description =
  "Articles from the insights & analysis on Singapore's car and COE trends.";
const url = "/blog";

const structuredData: WithContext<Blog> = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: title,
  url,
  description,
};

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: url,
  },
};

export default async function BlogPage() {
  const [posts, popularPosts] = await Promise.all([
    getAllPosts(),
    getPopularPostsWithData(5),
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <BlogPageHeader title={title} description={description} />
        <UnreleasedFeature>
          <PopularPosts posts={popularPosts} />
        </UnreleasedFeature>
        <BlogList posts={posts} />
      </section>
    </>
  );
}
