import { createPost, createPostSchema } from "@web/app/admin/lib/create-post";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== process.env.SG_CARS_TRENDS_API_TOKEN) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await request.json();
  const result = createPostSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 400 },
    );
  }

  try {
    const post = await createPost(result.data);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[API] Failed to create post:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create post",
      },
      { status: 500 },
    );
  }
};
