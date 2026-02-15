#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod";
import pkg from "../package.json" with { type: "json" };
import { type ApiResponse, request } from "./client.js";

function errorResult(response: ApiResponse<unknown>) {
  return {
    content: [
      {
        type: "text" as const,
        text: `Error ${response.status}: ${JSON.stringify(response.data, null, 2)}`,
      },
    ],
    isError: true,
  };
}

function jsonResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

const postBodySchema = {
  title: z.string().min(1).describe("Post title"),
  content: z.string().min(1).describe("Post content in MDX format"),
  excerpt: z.string().optional().describe("Short excerpt/summary"),
  heroImage: z.string().optional().describe("Hero image URL"),
  tags: z.array(z.string()).optional().describe("Post tags"),
  highlights: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        detail: z.string(),
      }),
    )
    .optional()
    .describe("Key highlights to display"),
  month: z
    .string()
    .optional()
    .describe("Data month (e.g. 2024-01) for deduplication"),
  dataType: z
    .string()
    .optional()
    .describe("Data type (e.g. cars, coe) for deduplication"),
  status: z
    .enum(["draft", "published"])
    .default("draft")
    .describe("Post status"),
};

const server = new McpServer({
  name: pkg.name,
  version: pkg.version,
});

server.tool(
  "list_posts",
  "List blog posts with optional status filter and limit",
  {
    status: z
      .enum(["draft", "published"])
      .optional()
      .describe("Filter by post status"),
    limit: z
      .number()
      .int()
      .positive()
      .max(100)
      .optional()
      .describe("Maximum number of posts to return (default 50)"),
  },
  async ({ status, limit }) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (limit) params.set("limit", String(limit));

    const query = params.toString();
    const path = `/api/v1/posts${query ? `?${query}` : ""}`;
    const response = await request<unknown[]>(path);

    if (!response.ok) return errorResult(response);
    return jsonResult(response.data);
  },
);

server.tool(
  "get_post",
  "Get a single blog post by its UUID",
  {
    id: z.string().uuid().describe("The UUID of the post"),
  },
  async ({ id }) => {
    const response = await request<unknown>(`/api/v1/posts/${id}`);

    if (!response.ok) return errorResult(response);
    return jsonResult(response.data);
  },
);

server.tool(
  "create_post",
  "Create a new blog post",
  postBodySchema,
  async (input) => {
    const response = await request<unknown>("/api/v1/posts", {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (!response.ok) return errorResult(response);
    return jsonResult(response.data);
  },
);

server.tool(
  "update_post",
  "Update an existing blog post",
  {
    id: z.string().uuid().describe("The UUID of the post to update"),
    ...postBodySchema,
  },
  async ({ id, ...body }) => {
    const response = await request<unknown>(`/api/v1/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (!response.ok) return errorResult(response);
    return jsonResult(response.data);
  },
);

server.tool(
  "delete_post",
  "Delete a blog post permanently",
  {
    id: z.string().uuid().describe("The UUID of the post to delete"),
  },
  async ({ id }) => {
    const response = await request<unknown>(`/api/v1/posts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return errorResult(response);

    return {
      content: [
        {
          type: "text" as const,
          text: `Post ${id} deleted successfully.`,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
