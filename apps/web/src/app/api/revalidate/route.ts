import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

export const GET = (req: NextRequest) => {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
    return Response.json({ message: "Invalid token!" }, { status: 401 });
  }

  const tag = req.nextUrl.searchParams.get("tag");
  if (tag) {
    revalidateTag(tag);
    return Response.json({ revalidated: true, now: Date.now() });
  }
};
