"use client";

import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { COE_CHART_COLOURS } from "@web/lib/coe/calculations";
import type { COECategory } from "@web/types";
import { HelpCircle } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

const categories: COECategory[] = [
  "Category A",
  "Category B",
  "Category C",
  "Category D",
  "Category E",
];

const coreCategories: COECategory[] = [
  "Category A",
  "Category B",
  "Category E",
];

const defaultCategories = ["Category A", "Category B", "Category E"];

const categoryColours: Record<COECategory, string> = {
  "Category A": COE_CHART_COLOURS[0],
  "Category B": COE_CHART_COLOURS[1],
  "Category C": COE_CHART_COLOURS[2],
  "Category D": COE_CHART_COLOURS[3],
  "Category E": COE_CHART_COLOURS[4],
};

const categoryShortLabels: Record<COECategory, string> = {
  "Category A": "A",
  "Category B": "B",
  "Category C": "C",
  "Category D": "D",
  "Category E": "E",
};

export const CategoryChips = () => {
  const [selectedCategories, setSelectedCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault(defaultCategories),
  );

  const activeCategories = useMemo(() => {
    return [...new Set([...coreCategories, ...selectedCategories])];
  }, [selectedCategories]);

  const toggleCategory = useCallback(
    (category: COECategory) => {
      setSelectedCategories((prev) => {
        if (prev.includes(category)) {
          if (coreCategories.includes(category)) {
            return prev;
          }
          return prev.filter((cat) => cat !== category);
        }
        return [...prev, category];
      });
    },
    [setSelectedCategories],
  );

  const isCore = (category: COECategory) => coreCategories.includes(category);

  return (
    <div className="flex items-center gap-2">
      <span className="text-default-600 text-sm">Categories:</span>
      <div className="flex items-center gap-1">
        {categories.map((category) => {
          const isSelected = activeCategories.includes(category);
          const isLocked = isCore(category);

          return (
            <Chip
              key={category}
              variant={isSelected ? "solid" : "bordered"}
              className="cursor-pointer transition-opacity"
              style={{
                backgroundColor: isSelected
                  ? categoryColours[category]
                  : "transparent",
                borderColor: categoryColours[category],
                color: isSelected ? "white" : categoryColours[category],
                opacity: isLocked && !isSelected ? 0.5 : 1,
              }}
              onClick={() => !isLocked && toggleCategory(category)}
            >
              {categoryShortLabels[category]}
            </Chip>
          );
        })}
      </div>
      <Tooltip content="Categories A, B, E are always shown. Toggle C & D.">
        <span className="cursor-help text-default-400">
          <HelpCircle className="size-4" />
        </span>
      </Tooltip>
    </div>
  );
};
