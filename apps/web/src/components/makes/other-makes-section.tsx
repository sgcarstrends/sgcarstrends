"use client";

import { Chip } from "@heroui/react";
import { type Make } from "@web/types";
import { MakeCard } from "./make-card";

interface OtherMakesSectionProps {
  makes: Make[];
  onMakeClick?: (make: Make) => void;
}

export const OtherMakesSection = ({
  makes,
  onMakeClick,
}: OtherMakesSectionProps) => {
  if (makes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Other Makes</h2>
        <Chip size="sm" variant="flat" color="default">
          {makes.length}
        </Chip>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {makes.map((make) => (
          <MakeCard
            key={make}
            make={make}
            isPopular={false}
            onMakePress={onMakeClick}
          />
        ))}
      </div>
    </section>
  );
};
