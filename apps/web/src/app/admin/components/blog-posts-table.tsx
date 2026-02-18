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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sgcarstrends/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sgcarstrends/ui/components/dropdown-menu";
import { Input } from "@sgcarstrends/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sgcarstrends/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sgcarstrends/ui/components/table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  deleteBlogPost,
  getAllPosts,
  getPostById,
  type PostWithMetadata,
  regeneratePost,
} from "@web/app/admin/actions/blog";
import { estimateTokenCost } from "@web/app/admin/lib/token-cost";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffectEvent, useMemo, useState } from "react";
import { toast } from "sonner";

interface BlogPostsTableProps {
  initialPosts: PostWithMetadata[];
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-SG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTokens(post: PostWithMetadata): string {
  const totalTokens = post.metadata?.usage?.totalTokens;
  if (!totalTokens) return "N/A";
  const input = post.metadata?.usage?.inputTokens ?? 0;
  const output = post.metadata?.usage?.outputTokens ?? 0;
  return `${totalTokens.toLocaleString()} (${input.toLocaleString()} + ${output.toLocaleString()})`;
}

function SortableHeader({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={onClick}>
      {label}
      <ArrowUpDown className="ml-2 size-4" />
    </Button>
  );
}

export function BlogPostsTable({ initialPosts }: BlogPostsTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "regenerate" | "delete";
    post: PostWithMetadata | null;
  }>({ open: false, type: "regenerate", post: null });
  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    post: PostWithMetadata | null;
    content: string | null;
    loading: boolean;
  }>({ open: false, post: null, content: null, loading: false });

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
        throw new Error(result.error ?? "Unknown error");
      }
    } catch (error) {
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
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      } else {
        throw new Error(result.error ?? "Unknown error");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete blog post.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handlePreview = useEffectEvent(async (post: PostWithMetadata) => {
    setPreviewDialog({ open: true, post, content: null, loading: true });
    try {
      const fullPost = await getPostById(post.id);
      setPreviewDialog({
        open: true,
        post,
        content: fullPost?.content ?? null,
        loading: false,
      });
    } catch {
      toast.error("Failed to load post content.");
      setPreviewDialog({
        open: false,
        post: null,
        content: null,
        loading: false,
      });
    }
  });

  const columns = useMemo<ColumnDef<PostWithMetadata>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <SortableHeader
            label="Title"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <Link
            href={`/admin/content/blog/${row.original.id}/edit`}
            className="line-clamp-1 font-medium hover:underline"
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === "published" ? "default" : "secondary"
            }
          >
            {row.original.status ?? "draft"}
          </Badge>
        ),
      },
      {
        accessorKey: "month",
        header: ({ column }) => (
          <SortableHeader
            label="Month"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => row.original.month ?? "N/A",
      },
      {
        accessorKey: "dataType",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.dataType?.toUpperCase() ?? "N/A"}
          </Badge>
        ),
      },
      {
        id: "model",
        header: "Model",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.metadata?.modelId || "N/A"}
          </span>
        ),
      },
      {
        id: "tokens",
        // biome-ignore lint/style/noNonNullAssertion: safe — totalTokens is a number or 0
        accessorFn: (row) => row.metadata?.usage?.totalTokens ?? 0,
        header: ({ column }) => (
          <SortableHeader
            label="Tokens"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatTokens(row.original)}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <SortableHeader
            label="Created"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const post = row.original;
          const isLoading =
            regeneratingId === post.id || deletingId === post.id;

          if (isLoading) {
            return (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            );
          }

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="size-8 p-0">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 size-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/content/blog/${post.id}/edit`}>
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePreview(post)}>
                  <Eye className="mr-2 size-4" />
                  Preview
                </DropdownMenuItem>
                {post.month && post.dataType && (
                  <>
                    <DropdownMenuSeparator />
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
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    setConfirmDialog({ open: true, type: "delete", post })
                  }
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    // biome-ignore lint/correctness/useExhaustiveDependencies: regeneratingId/deletingId drive loading state in cell renderers; handlePreview is stable within this closure
    [regeneratingId, deletingId],
  );

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      const title = row.original.title?.toLowerCase() ?? "";
      const month = row.original.month?.toLowerCase() ?? "";
      const dataType = row.original.dataType?.toLowerCase() ?? "";
      return (
        title.includes(search) ||
        month.includes(search) ||
        dataType.includes(search)
      );
    },
    state: { sorting, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>
            {table.getFilteredRowModel().rows.length} of {posts.length} post
            {posts.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, month, or type..."
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                table.setPageIndex(0);
              }}
              className="pl-9"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No blog posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center gap-2 lg:flex-row lg:justify-between">
            <p className="text-muted-foreground text-sm">
              {table.getFilteredRowModel().rows.length} row
              {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Rows per page</span>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="font-medium text-sm">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden size-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">First page</span>
                  <ChevronsLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="size-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Previous page</span>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="size-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Next page</span>
                  <ChevronRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden size-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Last page</span>
                  <ChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
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
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-3">
                {confirmDialog.type === "delete" ? (
                  <p>
                    This will permanently delete{" "}
                    <strong>"{confirmDialog.post?.title}"</strong>. This action
                    cannot be undone.
                  </p>
                ) : (
                  <>
                    <p>
                      This will generate a new blog post for{" "}
                      <strong>
                        {confirmDialog.post?.month} (
                        {confirmDialog.post?.dataType})
                      </strong>{" "}
                      using the latest data and AI model. The existing post will
                      be updated.
                    </p>
                    {confirmDialog.post?.metadata?.usage && (
                      <div className="flex flex-col gap-1 rounded-md bg-muted p-3 text-sm">
                        <span className="font-medium">
                          Estimated regeneration cost:
                        </span>
                        <span>
                          Previous usage:{" "}
                          {confirmDialog.post.metadata.usage.totalTokens?.toLocaleString()}{" "}
                          tokens
                        </span>
                        <span>
                          Estimated cost: ~
                          {estimateTokenCost(confirmDialog.post.metadata.usage)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          Based on Gemini Flash pricing. Actual cost may vary.
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
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

      {/* Content Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewDialog({
              open: false,
              post: null,
              content: null,
              loading: false,
            });
          }
        }}
      >
        <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle className="line-clamp-2 pr-6">
              {previewDialog.post?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {previewDialog.loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {previewDialog.content ?? "No content available."}
              </pre>
            )}
          </div>
          <DialogFooter>
            {previewDialog.post?.slug && (
              <Button asChild variant="outline">
                <Link
                  href={`/blog/${previewDialog.post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 size-4" />
                  View Live
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
