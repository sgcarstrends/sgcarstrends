import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { BlogHero } from "@web/app/blog/_components/blog-hero";
import {
  type Highlight,
  KeyHighlights,
} from "@web/app/blog/_components/key-highlights";
import { mdxComponents } from "@web/app/blog/_components/mdx-components";
import { PostNavigation } from "@web/app/blog/_components/post-navigation";
import { ProgressBar } from "@web/app/blog/_components/progress-bar";
import { RelatedPosts } from "@web/app/blog/_components/related-posts";
import { TableOfContents } from "@web/app/blog/_components/table-of-contents";
import { StructuredData } from "@web/components/structured-data";
import { SITE_URL } from "@web/config";
import { getPostViewCount } from "@web/lib/data/posts";
import {
  getAllPosts,
  getNextPost,
  getPostBySlug,
  getPreviousPost,
} from "@web/queries/posts";
import { Undo2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import type { BlogPosting, WithContext } from "schema-dts";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const canonical = `/blog/${post.slug}`;

  const publishedDate = post.publishedAt ?? post.createdAt;
  const modifiedDate = post.modifiedAt;

  // Generate Open Graph image URL
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`;

  return {
    title: post.title,
    description: post.excerpt || "",
    keywords: post.tags ?? [],
    authors: [{ name: "SG Cars Trends AI", url: SITE_URL }],
    creator: "SG Cars Trends",
    publisher: "SG Cars Trends",
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      publishedTime: publishedDate.toISOString(),
      modifiedTime: modifiedDate.toISOString(),
      authors: ["SG Cars Trends"],
      tags: post.tags ?? [],
      url: `${SITE_URL}${canonical}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: [ogImageUrl],
      creator: "@sgcarstrends",
      site: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

export const generateStaticParams = async () => {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
};

const BlogPostPage = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.publishedAt || post.createdAt;
  const [initialViewCount, previousPost, nextPost] = await Promise.all([
    getPostViewCount(post.id),
    getPreviousPost(publishedDate),
    getNextPost(publishedDate),
  ]);

  // Fallback hero images based on data type
  const defaultHeroImages: Record<string, string> = {
    cars: "https://images.unsplash.com/photo-1519043916581-33ecfdba3b1c?w=1200&h=514&fit=crop",
    coe: "https://images.unsplash.com/photo-1519045550819-021aa92e9312?w=1200&h=514&fit=crop",
  };
  const heroImage =
    post.heroImage || defaultHeroImages[post.dataType ?? "cars"];

  const structuredData: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: publishedDate.toISOString(),
    dateModified: post.modifiedAt.toISOString(),
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    wordCount: post.content.split(/\s+/).length,
    inLanguage: "en-SG",
    author: {
      "@type": "Organization",
      name: "SG Cars Trends",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "SG Cars Trends",
      url: SITE_URL,
    },
    image: heroImage
      ? {
          "@type": "ImageObject",
          url: heroImage,
        }
      : undefined,
    keywords: post.tags?.join(", "),
    articleSection:
      post.dataType === "cars" ? "Market Analysis" : "COE Bidding",
    isPartOf: {
      "@type": "Blog",
      name: "SG Cars Trends Blog",
      url: `${SITE_URL}/blog`,
    },
  };

  const readingTimeText = readingTime(post.content).text;

  return (
    <>
      <StructuredData data={structuredData} />
      <ProgressBar />

      {/* Full-width content wrapper */}
      <div className="flex flex-col">
        {/* Bloomberg-style Hero with overlaid title */}
        <BlogHero
          title={post.title}
          slug={post.slug}
          heroImage={heroImage}
          publishedAt={publishedDate}
          readingTimeText={readingTimeText}
          tags={post.tags ?? undefined}
          postId={post.id}
          initialViewCount={initialViewCount}
        />

        {/* Main Content - Single column, centered */}
        <div className="container mx-auto flex flex-col gap-8">
          {/* Table of Contents */}
          <TableOfContents />

          {/* Excerpt / Executive Summary */}
          {post.excerpt && (
            <section>
              <h2 className="mb-4 font-bold text-foreground/60 text-xs uppercase tracking-[0.3em]">
                Executive Summary
              </h2>
              <Card
                shadow="none"
                radius="none"
                classNames={{
                  base: "bg-transparent border-l-4 border-primary",
                  body: "py-0 pl-4",
                }}
              >
                <CardBody>
                  <p className="text-foreground/90 text-lg leading-relaxed md:text-xl">
                    {post.excerpt}
                  </p>
                </CardBody>
              </Card>
            </section>
          )}

          {/* Key Highlights */}
          <KeyHighlights
            highlights={post.highlights as Highlight[] | undefined}
          />

          {/* Article Content */}
          <article className="prose dark:prose-invert max-w-none">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  format: "md",
                  remarkPlugins: [
                    remarkGfm,
                    [
                      remarkToc,
                      {
                        heading: "Table of Contents|Contents|TOC",
                        maxDepth: 3,
                        tight: true,
                      },
                    ],
                  ],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypeAutolinkHeadings,
                      {
                        behavior: "append",
                        properties: {
                          className: ["permalink"],
                        },
                      },
                    ],
                  ],
                },
              }}
            />
          </article>

          {/* Post Navigation */}
          <PostNavigation previous={previousPost} next={nextPost} />

          {/* Related Posts */}
          <RelatedPosts currentPostId={post.id} />

          <Divider className="my-6" />
          <div className="flex justify-center pb-8">
            <Button color="primary" variant="ghost">
              <Link href="/blog" className="flex items-center gap-2">
                <Undo2 className="size-4" />
                <span>Back to blog</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
