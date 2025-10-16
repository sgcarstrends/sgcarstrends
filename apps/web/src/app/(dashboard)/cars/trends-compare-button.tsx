"use client";

import { Button, useDisclosure } from "@heroui/react";
import { BetaChip } from "@web/components/shared/chips";
import { TrendsComparisonBottomSheet } from "@web/components/trends-comparison-bottom-sheet";
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

      <TrendsComparisonBottomSheet
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
