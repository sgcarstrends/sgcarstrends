import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
    return NextResponse.json({ message: "Invalid token!" }, { status: 401 });
  }

  const tags = req.nextUrl.searchParams.get("tags");
  if (tags) {
    revalidateTag(tags);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }
};
