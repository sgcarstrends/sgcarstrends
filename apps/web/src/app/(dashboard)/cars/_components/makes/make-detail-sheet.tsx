"use client";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/drawer";
import type { CarLogo } from "@logos/types";
import type { SelectCar } from "@sgcarstrends/database";
import { useIsMobile } from "@sgcarstrends/ui/hooks/use-mobile";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
import { X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { MakeDetail } from "./make-detail";

interface SelectedMakeData {
  make: string;
  cars: { make: string; total: number; data: Partial<SelectCar>[] };
  logo?: CarLogo | null;
  coeComparison: MakeCoeComparisonData[];
}

interface MakeDetailSheetProps {
  selectedMakeData?: SelectedMakeData | null;
}

export function MakeDetailSheet({ selectedMakeData }: MakeDetailSheetProps) {
  const [make, setMake] = useQueryState(
    "make",
    parseAsString.withOptions({ shallow: false }),
  );
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (make && isMobile) {
      setIsOpen(true);
    }
  }, [make, isMobile]);

  if (!selectedMakeData) {
    return null;
  }

  return (
    <Drawer
      hideCloseButton
      isOpen={isOpen}
      placement="bottom"
      size="4xl"
      onClose={() => setMake(null)}
      onOpenChange={setIsOpen}
      classNames={{
        base: "rounded-t-3xl",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between border-default-100 border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-10 rounded-full bg-default-200" />
          </div>
          <button
            type="button"
            onClick={() => setMake(null)}
            className="flex size-8 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
            aria-label="Close drawer"
          >
            <X className="size-4" />
          </button>
        </DrawerHeader>
        <DrawerBody className="overflow-y-auto p-6 lg:hidden">
          <MakeDetail
            cars={selectedMakeData.cars}
            coeComparison={selectedMakeData.coeComparison}
            logo={selectedMakeData.logo}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
