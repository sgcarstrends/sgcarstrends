import { Button } from "@heroui/button";
import { updatePostTags } from "@web/actions/blog/tags";
import { ProgressBar } from "@web/components/blog/progress-bar";
import { RelatedPosts } from "@web/components/blog/related-posts";
import { ViewCounter } from "@web/components/blog/view-counter";
import { BetaChip } from "@web/components/chips";
import { StructuredData } from "@web/components/structured-data";
import { Separator } from "@web/components/ui/separator";
import { SITE_URL } from "@web/config";
import { getQueryClient, trpc } from "@web/trpc/server";
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

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const queryClient = getQueryClient();
  const post = await queryClient.fetchQuery(
    trpc.blog.getPostBySlug.queryOptions({ slug }),
  );

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

  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      type: "article",
      publishedTime: publishedDate.toISOString(),
      // authors: [author],
      tags: metadata?.tags ?? [],
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: excerpt,
    },
    alternates: {
      canonical,
    },
  };
};

export const generateStaticParams = async () => {
  const queryClient = getQueryClient();
  const posts = await queryClient.fetchQuery(
    trpc.blog.getAllPosts.queryOptions(),
  );
  return posts.map((post) => ({ slug: post.slug }));
};

const BlogPostPage = async ({ params }: Props) => {
  const { slug } = await params;
  const queryClient = getQueryClient();
  const post = await queryClient.fetchQuery(
    trpc.blog.getPostBySlug.queryOptions({ slug }),
  );

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
          <ViewCounter postId={post.id} />
        </div>

        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote
            source={post.content}
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
