"use server";

import type { LanguageModelUsage } from "@sgcarstrends/ai";
import type { SelectPost } from "@sgcarstrends/database";
import { db, desc, eq, posts } from "@sgcarstrends/database";
import { auth } from "@web/app/admin/lib/auth";
import {
  type CreatePostInput,
  createPost,
} from "@web/app/admin/lib/create-post";
import { deletePost } from "@web/app/admin/lib/delete-post";
import {
  type UpdatePostInput,
  updatePost,
} from "@web/app/admin/lib/update-post";
import { regeneratePostWorkflow } from "@web/workflows/regenerate-post";
import { headers } from "next/headers";
import { start } from "workflow/api";

export interface PostWithMetadata {
  id: string;
  title: string;
  slug: string;
  month: string;
  dataType: string;
  status: string;
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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getPostById = async (id: string): Promise<SelectPost | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorised");
  }

  if (!UUID_REGEX.test(id)) {
    return null;
  }

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  return post ?? null;
};

export const regeneratePost = async (params: {
  month: string;
  dataType: "cars" | "coe";
}): Promise<{ success: boolean; error?: string; runId?: string }> => {
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
    const run = await start(regeneratePostWorkflow, [params]);

    return {
      success: true,
      runId: run.runId,
    };
  } catch (error) {
    console.error("Error triggering regeneration workflow:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const createBlogPost = async (
  input: CreatePostInput,
): Promise<{ success: boolean; error?: string; postId?: string }> => {
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
    const post = await createPost(input);

    return {
      success: true,
      postId: post.id,
    };
  } catch (error) {
    console.error("Error creating blog post:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const updateBlogPost = async (
  input: UpdatePostInput,
): Promise<{ success: boolean; error?: string; postId?: string }> => {
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
    const post = await updatePost(input);

    return {
      success: true,
      postId: post.id,
    };
  } catch (error) {
    console.error("Error updating blog post:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const deleteBlogPost = async (
  id: string,
): Promise<{ success: boolean; error?: string }> => {
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
    await deletePost(id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting blog post:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
