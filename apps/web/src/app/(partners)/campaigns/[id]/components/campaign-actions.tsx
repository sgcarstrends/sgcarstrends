"use client";

import { Button } from "@heroui/button";
import {
  pauseCampaign,
  resumeCampaign,
} from "@web/app/(partners)/actions/campaigns";
import { Pause, Play } from "lucide-react";
import { useTransition } from "react";

interface CampaignActionsProps {
  campaignId: string;
  status: string;
}

export function CampaignActions({ campaignId, status }: CampaignActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handlePause() {
    startTransition(() => {
      pauseCampaign(campaignId);
    });
  }

  function handleResume() {
    startTransition(() => {
      resumeCampaign(campaignId);
    });
  }

  if (status === "ended") {
    return null;
  }

  if (status === "active") {
    return (
      <Button
        color="warning"
        variant="flat"
        startContent={<Pause className="size-4" />}
        isLoading={isPending}
        onPress={handlePause}
      >
        Pause Campaign
      </Button>
    );
  }

  if (status === "paused") {
    return (
      <Button
        color="success"
        variant="flat"
        startContent={<Play className="size-4" />}
        isLoading={isPending}
        onPress={handleResume}
      >
        Resume Campaign
      </Button>
    );
  }

  return null;
}
