import { revalidateTag } from "next/cache";
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

  const body = await req.json();

  const tag = body.tag;
  if (tag) {
    revalidateTag(tag);
    return Response.json({ revalidated: true, tag, now: Date.now() });
  }
};
