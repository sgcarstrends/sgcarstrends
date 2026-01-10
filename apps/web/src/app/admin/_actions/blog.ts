"use server";

import crypto from "node:crypto";
import { db, posts } from "@sgcarstrends/database";
import { auth } from "@web/app/admin/_lib/auth";
import { client } from "@web/app/admin/_lib/qstash";
import type { LanguageModelUsage } from "ai";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";

export interface PostWithMetadata {
  id: string;
  title: string;
  slug: string;
  month: string;
  dataType: string;
  createdAt: Date;
  metadata: {
    modelId?: string;
    usage?: LanguageModelUsage;
  } | null;
}

export const getAllPosts = async (): Promise<PostWithMetadata[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorised");
  }

  const allPosts = await db.query.posts.findMany({
    orderBy: desc(posts.createdAt),
  });

  return allPosts as PostWithMetadata[];
};

export const regeneratePost = async (params: {
  month: string;
  dataType: "cars" | "coe";
}): Promise<{ success: boolean; error?: string; workflowRunId?: string }> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "Unauthorised",
    };
  }

  try {
    const workflowRunId = crypto.randomUUID();
    const baseUrl = process.env.WORKFLOWS_BASE_URL;

    await client.trigger({
      url: `${baseUrl}/regenerate`,
      body: params,
      headers: { "Upstash-Workflow-RunId": workflowRunId },
      workflowRunId,
    });

    return {
      success: true,
      workflowRunId,
    };
  } catch (error) {
    console.error("Error triggering regeneration workflow:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
