"use client";

import { Button, useDisclosure } from "@heroui/react";
import { TrendingUp } from "lucide-react";
import { TrendsComparisonBottomSheet } from "@web/components/trends-comparison-bottom-sheet";
import { BetaChip } from "@web/components/chips";

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
