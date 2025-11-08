import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("x-revalidate-token");

  if (!token) {
    return Response.json(
      { message: "Missing revalidate token" },
      { status: 400 },
    );
  }

  if (token !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Support single tag or array of tags
    const tags = body.tags || (body.tag ? [body.tag] : []);
    const path = body.path;

    const revalidated: { tags?: string[]; path?: string } = {};

    // Revalidate tags
    if (tags.length > 0) {
      for (const tag of tags) {
        revalidateTag(tag, "max");
      }
      revalidated.tags = tags;
    }

    // Revalidate path
    if (path) {
      revalidatePath(path);
      revalidated.path = path;
    }

    if (!tags.length && !path) {
      return Response.json(
        { message: "No tags or path provided" },
        { status: 400 },
      );
    }

    return Response.json({
      revalidated: true,
      ...revalidated,
      now: Date.now(),
    });
  } catch (error) {
    return Response.json(
      {
        message: "Failed to revalidate",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
