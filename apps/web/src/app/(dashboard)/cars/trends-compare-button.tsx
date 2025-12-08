"use client";

import { Button, useDisclosure } from "@heroui/react";
import { BetaChip } from "@web/components/shared/chips";
import { TrendsComparison } from "@web/components/trends-comparison";
import { TrendingUp } from "lucide-react";

export const CarRegistration = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex justify-end">
        <Button
          color="primary"
          variant="shadow"
          startContent={<TrendingUp className="size-4" />}
          endContent={<BetaChip />}
          onPress={onOpen}
        >
          Compare Trends
        </Button>
      </div>

      <TrendsComparison isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};
