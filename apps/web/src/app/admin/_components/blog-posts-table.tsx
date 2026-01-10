"use client";

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
import {
  getAllPosts,
  type PostWithMetadata,
  regeneratePost,
} from "@web/app/admin/_actions/blog";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BlogPostsTableProps {
  initialPosts: PostWithMetadata[];
}

export function BlogPostsTable({ initialPosts }: BlogPostsTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    post: PostWithMetadata | null;
  }>({ open: false, post: null });

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

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-SG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatTokens(post: PostWithMetadata) {
    const totalTokens = post.metadata?.usage?.totalTokens;
    if (!totalTokens) return "N/A";

    const promptTokens = post.metadata?.usage?.inputTokens || 0;
    const completionTokens = post.metadata?.usage?.outputTokens || 0;

    return `${totalTokens.toLocaleString()} (${promptTokens.toLocaleString()} + ${completionTokens.toLocaleString()})`;
  }

  return (
    <>
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
    </>
  );
}
