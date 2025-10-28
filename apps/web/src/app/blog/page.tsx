import { BlogList } from "@web/components/blog/blog-list";
import { StructuredData } from "@web/components/structured-data";
import { SubscribeForm } from "@web/components/subscribe-form";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { getAllPosts } from "@web/utils/blog-queries";
import type { Metadata } from "next";
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
  const posts = await getAllPosts();

  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-bold text-4xl">Blog</h1>
          <h2 className="text-muted-foreground">{description}</h2>
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
