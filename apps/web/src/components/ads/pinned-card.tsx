import { Card, CardBody } from "@heroui/card";
import { getActiveCampaign } from "@web/app/(partners)/queries/campaigns";
import Image from "next/image";

export async function PinnedCard() {
  const campaign = await getActiveCampaign("pinned-card");

  if (!campaign) {
    return null;
  }

  return (
    <Card className="overflow-hidden rounded-2xl">
      <a href={`/api/ads/click/${campaign.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={campaign.imageUrl}
            alt={campaign.altText || campaign.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <span className="absolute top-2 left-2 rounded bg-black/60 px-2 py-1 text-white text-xs">
            Sponsored
          </span>
        </div>
        <CardBody className="p-3">
          <span className="font-medium text-sm">{campaign.name}</span>
        </CardBody>
      </a>
    </Card>
  );
}
