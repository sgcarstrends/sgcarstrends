import { BlogListSection } from "@web/app/(main)/blog/components/blog-list-section";
import { BlogPageHeader } from "@web/app/(main)/blog/components/blog-page-header";
import { PopularPostsSection } from "@web/app/(main)/blog/components/popular-posts-section";
import { StructuredData } from "@web/components/structured-data";
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

export default function BlogPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <BlogPageHeader title={title} description={description} />
        <PopularPostsSection />
        <BlogListSection />
      </section>
    </>
  );
}
