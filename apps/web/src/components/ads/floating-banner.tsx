import { getActiveCampaign } from "@web/app/(partners)/queries/campaigns";
import Image from "next/image";
import { FloatingBannerDismiss } from "./floating-banner-dismiss";

export async function FloatingBanner() {
  const campaign = await getActiveCampaign("floating-banner");

  if (!campaign) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-divider bg-content1 p-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a
          href={`/api/ads/click/${campaign.id}`}
          className="flex flex-1 items-center gap-4"
        >
          <div className="relative hidden size-16 overflow-hidden rounded-lg sm:block">
            <Image
              src={campaign.imageUrl}
              alt={campaign.altText || campaign.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-default-400 text-xs">Sponsored</span>
            <span className="font-medium text-sm">{campaign.name}</span>
          </div>
        </a>
        <FloatingBannerDismiss />
      </div>
    </div>
  );
}
