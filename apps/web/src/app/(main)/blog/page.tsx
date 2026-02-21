import { BlogListSection } from "@web/app/(main)/blog/components/blog-list-section";
import { BlogPageHeader } from "@web/app/(main)/blog/components/blog-page-header";
import { BlogSearchInput } from "@web/app/(main)/blog/components/blog-search-input";
import { PopularPostsSection } from "@web/app/(main)/blog/components/popular-posts-section";
import { loadSearchParams } from "@web/app/(main)/blog/search-params";
import { StructuredData } from "@web/components/structured-data";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
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

interface BlogPageProps {
  searchParams: Promise<SearchParams>;
}

async function BlogListWithSearch({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q: query } = await loadSearchParams(searchParams);

  return <BlogListSection query={query} />;
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <BlogPageHeader title={title} description={description} />
        <Suspense>
          <BlogSearchInput />
        </Suspense>
        <PopularPostsSection />
        <Suspense>
          <BlogListWithSearch searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
