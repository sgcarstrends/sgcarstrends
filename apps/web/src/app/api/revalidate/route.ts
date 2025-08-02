import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Resource } from "sst";

export const GET = (req: NextRequest) => {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== Resource.NEXT_PUBLIC_REVALIDATE_TOKEN.value) {
    return NextResponse.json({ message: "Invalid token!" }, { status: 401 });
  }

  const tags = req.nextUrl.searchParams.get("tags");
  if (tags) {
    revalidateTag(tags);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }
};
