"use client";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  // DrawerHeader,
} from "@heroui/drawer";
import type { CarLogo } from "@logos/types";
import type { SelectCar } from "@sgcarstrends/database";
import { useIsMobile } from "@sgcarstrends/ui/hooks/use-mobile";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
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
      size="3xl"
      onClose={() => setMake(null)}
      onOpenChange={setIsOpen}
    >
      <DrawerContent>
        {/*<DrawerHeader>{selectedMakeData.cars.make}</DrawerHeader>*/}
        <DrawerBody className="overflow-y-auto py-6 lg:hidden">
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
