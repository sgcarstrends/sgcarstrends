"use client";

import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";

interface TrendsComparisonBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const TrendsComparisonBottomSheet = ({
  isOpen,
  onOpenChange,
}: TrendsComparisonBottomSheetProps) => {
  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      size="5xl"
      backdrop="blur"
      shouldBlockScroll={true}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col items-center pb-2">
          <div className="mb-4 h-1 w-12 rounded-full bg-gray-300" />
          <div className="flex w-full flex-col gap-4 text-center">
            <h2 className="font-bold text-xl">Trends Comparison</h2>
            <p className="text-gray-600 text-sm">
              Compare data across different periods
            </p>
          </div>
        </DrawerHeader>
        <DrawerBody>
          <div className="p-16 text-center text-7xl">Coming Soon!</div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
