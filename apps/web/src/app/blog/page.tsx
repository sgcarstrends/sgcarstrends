import { BlogList } from "@web/app/blog/_components/blog-list";
import { getAllPostsWithMocks as getAllPosts } from "@web/app/blog/_data/mock-posts-helper"; // TODO: Remove and import from "@web/queries/posts" instead
import { StructuredData } from "@web/components/structured-data";
import { SubscribeForm } from "@web/components/subscribe-form";
import Typography from "@web/components/typography";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
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

const Page = async () => {
  const posts = await getAllPosts();

  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Typography.H1>{title}</Typography.H1>
          <Typography.TextLg className="text-default-600">
            {description}
          </Typography.TextLg>
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
