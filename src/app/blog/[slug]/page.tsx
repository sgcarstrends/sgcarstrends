import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AIBadge } from "@/components/ai-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllBlogPosts, getBlogPostBySlug } from "@/utils/blog";
import { parseMarkdownToHtml } from "@/utils/markdown";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedDate,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
};

// export const generateStaticParams = async () => {
//   const posts = getAllBlogPosts();
//   return posts.map((post) => ({ slug: post.slug }));
// };

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-4 px-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            {post.featured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            {post.modelName && <AIBadge modelName={post.modelName} />}
            <span className="text-muted-foreground text-sm">
              {new Date(post.publishedDate).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-muted-foreground text-sm">&bull;</span>
            <span className="text-muted-foreground text-sm">
              {post.readingTime} min read
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            {post.title}
          </h1>

          <p className="text-muted-foreground mb-6 text-xl">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">By {post.author}</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator className="mb-8" />
      </div>

      <article className="prose prose-lg max-w-none">
        <div
          className="space-y-6"
          dangerouslySetInnerHTML={{
            __html: parseMarkdownToHtml(post.content),
          }}
        />
      </article>

      <Separator className="my-8" />

      <div className="text-center">
        <Link href="/blog">
          <Button variant="outline">← Back to all posts</Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogPostPage;
