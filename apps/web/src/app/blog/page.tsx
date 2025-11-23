import { BlogList } from "@web/app/blog/_components/blog-list";
import { StructuredData } from "@web/components/structured-data";
import { SubscribeForm } from "@web/components/subscribe-form";
import Typography from "@web/components/typography";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { CACHE_TAG } from "@web/lib/cache";
import { getAllPosts } from "@web/lib/data/posts";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import type { Blog, WithContext } from "schema-dts";

const title = "Blog";
const description =
  "Articles from the insights and analysis on Singapore's car and COE trends.";
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

const Page = async () => {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAG.POSTS);

  const posts = await getAllPosts();

  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Typography.H1>Blog</Typography.H1>
          <Typography.TextLg>{description}</Typography.TextLg>
        </div>
        <UnreleasedFeature>
          <SubscribeForm />
        </UnreleasedFeature>
        <BlogList posts={posts} />
      </section>
    </>
  );
};

export default Page;
