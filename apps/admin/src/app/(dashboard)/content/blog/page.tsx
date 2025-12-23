"use client";

import {
  getAllPosts,
  type PostWithMetadata,
  regeneratePost,
} from "@admin/app/actions/blog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@sgcarstrends/ui/components/alert-dialog";
import { Badge } from "@sgcarstrends/ui/components/badge";
import { Button } from "@sgcarstrends/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sgcarstrends/ui/components/table";
import { FileText, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BlogManagementPage = () => {
  const [posts, setPosts] = useState<PostWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    post: PostWithMetadata | null;
  }>({ open: false, post: null });

  // Load posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Failed to load posts:", error);
        toast.error("Failed to load blog posts.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPosts();
  }, []);

  const handleRegenerate = async (post: PostWithMetadata) => {
    setRegeneratingId(post.id);
    setConfirmDialog({ open: false, post: null });

    try {
      const result = await regeneratePost({
        month: post.month,
        dataType: post.dataType as "cars" | "coe",
      });

      if (result.success) {
        toast.success(
          `Blog post for ${post.month} (${post.dataType}) regenerated successfully!`,
        );

        // Refresh posts list
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Failed to regenerate post:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to regenerate blog post.",
      );
    } finally {
      setRegeneratingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-SG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTokens = (post: PostWithMetadata) => {
    const totalTokens = post.metadata?.usage?.totalTokens;
    if (!totalTokens) return "N/A";

    const promptTokens = post.metadata?.usage?.inputTokens || 0;
    const completionTokens = post.metadata?.usage?.outputTokens || 0;

    return `${totalTokens.toLocaleString()} (${promptTokens.toLocaleString()} + ${completionTokens.toLocaleString()})`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
          <FileText className="size-8" />
          Blog Management
        </h1>
        <p className="text-muted-foreground">
          View and regenerate blog posts generated from market data.
        </p>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>
            {posts.length} post{posts.length !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No blog posts found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        {post.month}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {post.dataType.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {post.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {post.metadata?.modelId || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatTokens(post)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(post.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmDialog({ open: true, post })}
                          disabled={regeneratingId === post.id}
                        >
                          {regeneratingId === post.id ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Regenerating...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 size-4" />
                              Regenerate
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, post: confirmDialog.post })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate Blog Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a new blog post for{" "}
              <strong>
                {confirmDialog.post?.month} ({confirmDialog.post?.dataType})
              </strong>{" "}
              using the latest data and AI model. The existing post will be
              updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                confirmDialog.post && handleRegenerate(confirmDialog.post)
              }
            >
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
};

export default BlogManagementPage;
