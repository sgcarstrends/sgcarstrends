import { campaigns, db, eq, sql } from "@sgcarstrends/database";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const paramsSchema = z.object({
  campaignId: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const result = paramsSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { campaignId } = result.data;

  const [campaign] = await db
    .update(campaigns)
    .set({
      clicks: sql`${campaigns.clicks} + 1`,
    })
    .where(eq(campaigns.id, campaignId))
    .returning({
      destinationUrl: campaigns.destinationUrl,
      advertiserId: campaigns.advertiserId,
    });

  if (!campaign) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  revalidateTag(`campaign:${campaignId}`, "max");
  revalidateTag(`campaigns:advertiser:${campaign.advertiserId}`, "max");
  revalidateTag(`partner:dashboard:${campaign.advertiserId}`, "max");

  return NextResponse.redirect(campaign.destinationUrl, 302);
}
