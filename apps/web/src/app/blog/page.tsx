import { Spacer } from "@heroui/spacer";
import { getAllPosts } from "@web/actions/blog";
import { BlogList } from "@web/components/blog/blog-list";
import { BetaChip } from "@web/components/chips";
import { StructuredData } from "@web/components/structured-data";
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

  for (const post of posts) {
    console.log(post.title);
  }

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-2">
        <BetaChip />
        <h1 className="font-bold text-4xl">Blog</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Spacer y={8} />
      <BlogList posts={posts} />
    </>
  );
};

export default Page;
