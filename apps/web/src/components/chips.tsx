"use client";

import { Chip, cn } from "@heroui/react";

interface ChipProps {
  className?: string;
}

export const BetaChip = ({ className }: ChipProps) => (
  <Chip color="warning" size="sm" variant="flat" className={cn(className)}>
    Beta
  </Chip>
);

export const NewChip = ({ className }: ChipProps) => (
  <Chip color="success" size="sm" variant="flat" className={cn(className)}>
    New
  </Chip>
);
