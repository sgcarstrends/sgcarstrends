import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { AIBadge } from "@web/components/ai-badge";
import { StructuredData } from "@web/components/structured-data";
import { Separator } from "@web/components/ui/separator";
import { SITE_URL } from "@web/config";
import { calculateReadingTime } from "@web/utils/markdown";
import { getAllPosts, getPostBySlug } from "@web/utils/post-actions";
import { Undo2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
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

  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      type: "article",
      publishedTime:
        post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
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
  const readingTime =
    metadata?.readingTime || calculateReadingTime(post.content);

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
    timeRequired: `PT${readingTime}M`,
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
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          {metadata?.modelVersion && (
            <Tooltip
              color="primary"
              content={`Generated using ${metadata.modelVersion}`}
              placement="bottom"
            >
              <AIBadge />
            </Tooltip>
          )}
          <span>&middot;</span>
          <span>
            {new Date(publishedDate).toLocaleDateString("en-SG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>&middot;</span>
          <span>{readingTime} min read</span>
        </div>

        <article className="prose dark:prose-invert max-w-4xl">
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
