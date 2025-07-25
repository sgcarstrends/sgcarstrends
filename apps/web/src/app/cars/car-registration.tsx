"use client";

import { Button, useDisclosure } from "@heroui/react";
import { TrendingUp } from "lucide-react";
import { TrendsComparisonBottomSheet } from "@/components/trends-comparison-bottom-sheet";

export const CarRegistration = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex justify-end">
        <Button
          color="primary"
          variant="shadow"
          startContent={<TrendingUp className="size-4" />}
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
