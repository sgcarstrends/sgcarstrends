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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sgcarstrends/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sgcarstrends/ui/components/table";
import {
  deleteBlogPost,
  getAllPosts,
  type PostWithMetadata,
  regeneratePost,
} from "@web/app/admin/actions/blog";
import {
  Loader2,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface BlogPostsTableProps {
  initialPosts: PostWithMetadata[];
}

export function BlogPostsTable({ initialPosts }: BlogPostsTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "regenerate" | "delete";
    post: PostWithMetadata | null;
  }>({ open: false, type: "regenerate", post: null });

  const handleRegenerate = async (post: PostWithMetadata) => {
    setRegeneratingId(post.id);
    setConfirmDialog({ open: false, type: "regenerate", post: null });

    try {
      const result = await regeneratePost({
        month: post.month,
        dataType: post.dataType as "cars" | "coe",
      });

      if (result.success) {
        toast.success(
          `Blog post for ${post.month} (${post.dataType}) regenerated successfully!`,
        );

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

  const handleDelete = async (post: PostWithMetadata) => {
    setDeletingId(post.id);
    setConfirmDialog({ open: false, type: "delete", post: null });

    try {
      const result = await deleteBlogPost(post.id);

      if (result.success) {
        toast.success(`"${post.title}" deleted successfully.`);
        setPosts(posts.filter((p) => p.id !== post.id));
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete blog post.",
      );
    } finally {
      setDeletingId(null);
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
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => {
                    const isLoading =
                      regeneratingId === post.id || deletingId === post.id;

                    return (
                      <TableRow key={post.id}>
                        <TableCell className="max-w-md truncate font-medium">
                          <Link
                            href={`/admin/content/blog/${post.id}/edit`}
                            className="hover:underline"
                          >
                            {post.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {post.status ?? "draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.month ?? "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {post.dataType?.toUpperCase() ?? "N/A"}
                          </Badge>
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
                        <TableCell>
                          {isLoading ? (
                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0"
                                >
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/content/blog/${post.id}/edit`}
                                  >
                                    <Pencil className="mr-2 size-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                {post.month && post.dataType && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setConfirmDialog({
                                        open: true,
                                        type: "regenerate",
                                        post,
                                      })
                                    }
                                  >
                                    <RefreshCw className="mr-2 size-4" />
                                    Regenerate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() =>
                                    setConfirmDialog({
                                      open: true,
                                      type: "delete",
                                      post,
                                    })
                                  }
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "delete"
                ? "Delete Blog Post?"
                : "Regenerate Blog Post?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "delete" ? (
                <>
                  This will permanently delete{" "}
                  <strong>"{confirmDialog.post?.title}"</strong>. This action
                  cannot be undone.
                </>
              ) : (
                <>
                  This will generate a new blog post for{" "}
                  <strong>
                    {confirmDialog.post?.month} ({confirmDialog.post?.dataType})
                  </strong>{" "}
                  using the latest data and AI model. The existing post will be
                  updated.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmDialog.type === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
              onClick={() => {
                if (!confirmDialog.post) return;
                if (confirmDialog.type === "delete") {
                  handleDelete(confirmDialog.post);
                } else {
                  handleRegenerate(confirmDialog.post);
                }
              }}
            >
              {confirmDialog.type === "delete" ? "Delete" : "Regenerate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
