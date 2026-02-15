import { Button } from "@sgcarstrends/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import { getAllPosts } from "@web/app/admin/actions/blog";
import { BlogPostsTable } from "@web/app/admin/components/blog-posts-table";
import { ListSkeleton } from "@web/components/shared/skeleton";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function BlogManagementPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
            <FileText className="size-8" />
            Blog Management
          </h1>
          <p className="text-muted-foreground">
            View and regenerate blog posts generated from market data.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/content/blog/create">
            <Plus className="mr-2 size-4" />
            Create Post
          </Link>
        </Button>
      </div>

      {/* Posts Table */}
      <Suspense fallback={<ListSkeleton count={5} itemHeight="h-16" />}>
        <BlogPostsTable initialPosts={posts} />
      </Suspense>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-muted-foreground text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">🤖</span>
            <span>
              <strong>AI Generation:</strong> Posts are generated using Google
              Gemini 2.5 Flash with market data analysis.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">🔄</span>
            <span>
              <strong>Regeneration:</strong> Regenerating a post will fetch
              fresh data and create new content, replacing the existing version.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">💾</span>
            <span>
              <strong>Auto-save:</strong> Regenerated posts are automatically
              saved to the database and published.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">🚀</span>
            <span>
              <strong>Cache Revalidation:</strong> The web app cache is
              automatically revalidated after regeneration.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
