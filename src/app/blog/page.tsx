import Link from "next/link";
import { AIBadge } from "@/components/ai-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAllBlogPosts } from "@/utils/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Latest insights and analysis on Singapore's automotive market, COE trends, and car registration statistics.",
};

const BlogPage = () => {
  const blogPosts = getAllBlogPosts();

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">
          Latest insights and analysis on Singapore&apos;s automotive market
        </p>
      </div>

      <div className="space-y-6">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {post.featured && (
                    <Badge variant="secondary" className="text-xs">
                      Featured
                    </Badge>
                  )}
                  {post.modelName && <AIBadge modelName={post.modelName} />}
                  <span className="text-muted-foreground text-sm">
                    {new Date(post.publishedDate).toLocaleDateString("en-SG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {post.readingTime} min read
                </span>
              </div>
              <CardTitle className="text-xl">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {blogPosts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No blog posts available yet.</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
