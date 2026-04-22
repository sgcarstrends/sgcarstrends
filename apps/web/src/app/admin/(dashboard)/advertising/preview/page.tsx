import { Card, CardBody, CardHeader } from "@heroui/card";
import { getActiveCampaign } from "@web/app/partners/queries/campaigns";
import Typography from "@web/components/typography";
import Image from "next/image";

export default async function AdPreviewPage() {
  const [floatingBanner, pinnedCard, inFeed] = await Promise.all([
    getActiveCampaign("floating-banner"),
    getActiveCampaign("pinned-card"),
    getActiveCampaign("in-feed"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography.H1>Ad Preview</Typography.H1>
        <Typography.TextSm>
          Preview how ads appear on the public site
        </Typography.TextSm>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-col items-start gap-2">
            <Typography.H4>Floating Banner</Typography.H4>
            <Typography.TextSm>
              Appears at the bottom of all pages
            </Typography.TextSm>
          </CardHeader>
          <CardBody>
            {floatingBanner ? (
              <AdPreviewCard campaign={floatingBanner} />
            ) : (
              <EmptyPlacement />
            )}
          </CardBody>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-col items-start gap-2">
            <Typography.H4>Pinned Card</Typography.H4>
            <Typography.TextSm>
              Appears in sidebar on data pages
            </Typography.TextSm>
          </CardHeader>
          <CardBody>
            {pinnedCard ? (
              <AdPreviewCard campaign={pinnedCard} />
            ) : (
              <EmptyPlacement />
            )}
          </CardBody>
        </Card>

        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader className="flex flex-col items-start gap-2">
            <Typography.H4>In-Feed Card</Typography.H4>
            <Typography.TextSm>
              Appears in the home page bento grid
            </Typography.TextSm>
          </CardHeader>
          <CardBody>
            {inFeed ? (
              <AdPreviewCard campaign={inFeed} />
            ) : (
              <EmptyPlacement />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

interface AdPreviewCardProps {
  campaign: {
    name: string;
    imageUrl: string;
    destinationUrl: string;
    altText: string | null;
    impressions: number;
    clicks: number;
  };
}

function AdPreviewCard({ campaign }: AdPreviewCardProps) {
  const ctr =
    campaign.impressions > 0
      ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-default-100">
        <Image
          src={campaign.imageUrl}
          alt={campaign.altText || campaign.name}
          fill
          className="object-cover"
        />
        <span className="absolute top-2 left-2 rounded bg-black/60 px-2 py-1 text-white text-xs">
          Sponsored
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium">{campaign.name}</span>
        <a
          href={campaign.destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-primary text-sm hover:underline"
        >
          {campaign.destinationUrl}
        </a>
        <div className="flex gap-4 text-default-500 text-xs">
          <span>{campaign.impressions.toLocaleString()} impressions</span>
          <span>{campaign.clicks.toLocaleString()} clicks</span>
          <span>{ctr}% CTR</span>
        </div>
      </div>
    </div>
  );
}

function EmptyPlacement() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-default-200 py-12 text-center">
      <Typography.TextSm>No active campaign</Typography.TextSm>
      <Typography.Caption>
        This placement has no active campaign
      </Typography.Caption>
    </div>
  );
}
