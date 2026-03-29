"use client";

import { Button, useOverlayState } from "@heroui/react";
import { TrendsComparison } from "@web/components/trends-comparison";
import type { ComparisonData } from "@web/queries/cars/compare";
import type { Month } from "@web/types";
import { TrendingUp } from "lucide-react";

interface TrendsCompareButtonProps {
  currentMonth: string;
  months: Month[];
  comparisonData: ComparisonData | false;
}

export function TrendsCompareButton({
  currentMonth,
  months,
  comparisonData,
}: TrendsCompareButtonProps) {
  const state = useOverlayState();

  return (
    <>
      <div className="flex justify-end">
        <Button variant="primary" onPress={state.open}>
          <TrendingUp className="size-4" />
          Compare Trends
        </Button>
      </div>

      <TrendsComparison
        isOpen={state.isOpen}
        onOpenChange={state.setOpen}
        currentMonth={currentMonth}
        months={months}
        comparisonData={comparisonData}
      />
    </>
  );
}
