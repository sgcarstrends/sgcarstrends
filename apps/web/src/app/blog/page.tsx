import { AIBadge } from "@web/components/ai-badge";
import { StructuredData } from "@web/components/structured-data";
import { Badge } from "@web/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { getAllPosts } from "@web/utils/post-actions";
import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">Blog</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {posts.map((post) => {
              const metadata = post.metadata as any;
              const publishedDate = post.publishedAt || post.createdAt;

              return (
                <Card
                  key={post.slug}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {new Date(publishedDate).toLocaleDateString("en-SG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {metadata?.modelVersion && <AIBadge />}
                    </div>
                    <CardTitle className="text-xl">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <p className="text-muted-foreground">
                        {metadata?.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {metadata?.tags?.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-small"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-medium text-primary text-small hover:underline"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {posts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No blog posts available.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
