import { Button } from "@heroui/button";
import { Separator } from "@sgcarstrends/ui/components/separator";
import { updatePostTags } from "@web/app/blog/_actions/tags";
import { mdxComponents } from "@web/app/blog/_components/mdx-components";
import { ProgressBar } from "@web/app/blog/_components/progress-bar";
import { RelatedPosts } from "@web/app/blog/_components/related-posts";
import { ViewCounter } from "@web/app/blog/_components/view-counter";
import { BetaChip } from "@web/components/shared/chips";
import { StructuredData } from "@web/components/structured-data";
import { SITE_URL } from "@web/config";
import {
  getAllPosts,
  getPostBySlug,
  getPostViewCount,
} from "@web/lib/data/posts";
import { Undo2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import type { BlogPosting, WithContext } from "schema-dts";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const canonical = `/blog/${post.slug}`;

  const metadata = post.metadata as {
    featured?: boolean;
    modelVersion?: string;
    excerpt?: string;
    tags?: string[];
    readingTime?: number;
  };
  const excerpt = metadata?.excerpt || "";

  const publishedDate = post.publishedAt ?? post.createdAt;
  const modifiedDate = post.modifiedAt;

  // Generate Open Graph image URL
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`;

  return {
    title: post.title,
    description: excerpt,
    keywords: metadata?.tags ?? [],
    authors: [{ name: "SG Cars Trends AI", url: SITE_URL }],
    creator: "SG Cars Trends",
    publisher: "SG Cars Trends",
    openGraph: {
      title: post.title,
      description: excerpt,
      type: "article",
      publishedTime: publishedDate.toISOString(),
      modifiedTime: modifiedDate.toISOString(),
      authors: ["SG Cars Trends"],
      tags: metadata?.tags ?? [],
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
      description: excerpt,
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

  const metadata = post.metadata as {
    featured?: boolean;
    modelVersion?: string;
    excerpt?: string;
    tags?: string[];
    readingTime?: number;
  };
  const publishedDate = post.publishedAt || post.createdAt;
  const initialViewCount = await getPostViewCount(post.id);

  // Update post tags in Redis for related posts functionality
  if (metadata?.tags && metadata.tags.length > 0) {
    updatePostTags(post.id, metadata.tags).catch(console.error);
  }

  const structuredData: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: metadata?.excerpt,
    datePublished: publishedDate.toISOString(),
    dateModified: post.modifiedAt.toISOString(),
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    wordCount: post.content.split(/\s+/).length,
    inLanguage: "en-SG",
    isPartOf: {
      "@type": "Blog",
      name: "SG Cars Trends Blog",
      url: `${SITE_URL}/blog`,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <ProgressBar />
      <div className="container mx-auto flex w-full flex-col gap-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <BetaChip />
          <span>&middot;</span>
          <span>
            {new Date(publishedDate).toLocaleDateString("en-SG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>&middot;</span>
          <span>{readingTime(post.content).text}</span>
          <span>&middot;</span>
          <Suspense fallback={null}>
            <ViewCounter postId={post.id} initialCount={initialViewCount} />
          </Suspense>
        </div>

        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
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

        <RelatedPosts currentPostId={post.id} />

        <Separator className="my-2" />
        <div className="flex justify-center">
          <Button color="primary" variant="ghost">
            <Link href="/blog" className="flex items-center gap-2">
              <Undo2 className="size-4" />
              <span>Back to blog</span>
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
