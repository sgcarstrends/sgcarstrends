"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/drawer";
import type { CarLogo } from "@logos/types";
import type { SelectCar } from "@sgcarstrends/database";
import Typography from "@web/components/typography";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
import { X } from "lucide-react";
import Image from "next/image";
import { MakeDetail } from "./make-detail";

interface SelectedMakeData {
  make: string;
  cars: { make: string; total: number; data: Partial<SelectCar>[] };
  logo?: CarLogo | null;
  coeComparison: MakeCoeComparisonData[];
}

interface MakeDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMakeData?: SelectedMakeData | null;
}

export function MakeDetailSheet({
  open,
  onOpenChange,
  selectedMakeData,
}: MakeDetailSheetProps) {
  if (!selectedMakeData) return null;

  return (
    <Drawer
      isOpen={open}
      onOpenChange={onOpenChange}
      placement="bottom"
      size="5xl"
      radius="lg"
      hideCloseButton
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex items-center justify-between gap-4 border-default-200 border-b">
              <div className="flex items-center gap-3">
                {selectedMakeData.logo?.url ? (
                  <div className="relative size-10 overflow-hidden rounded-xl bg-default-100">
                    <Image
                      src={selectedMakeData.logo.url}
                      alt={`${selectedMakeData.make} logo`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <Avatar
                    name={selectedMakeData.make.charAt(0)}
                    size="md"
                    color="primary"
                  />
                )}
                <Typography.H3>{selectedMakeData.make}</Typography.H3>
              </div>
              <Button
                isIconOnly
                variant="light"
                radius="full"
                onPress={onClose}
                aria-label="Close"
              >
                <X className="size-5" />
              </Button>
            </DrawerHeader>
            <DrawerBody className="overflow-y-auto p-4 lg:hidden">
              <MakeDetail
                cars={selectedMakeData.cars}
                coeComparison={selectedMakeData.coeComparison}
              />
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
