"use client";

import useStore from "@web/app/store";
import { cn } from "@web/lib/utils";
import type { COECategory } from "@web/types";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  category: COECategory;
  description: string;
  canFilter?: boolean;
}

export const CategoryInfo = ({
  icon: Icon,
  category,
  description,
  canFilter = true,
}: Props) => {
  const categories = useStore((state) => state.categories);
  const updateCategories = useStore((state) => state.updateCategories);

  const handleFilterCategories = () => {
    if (canFilter) {
      updateCategories(category);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleFilterCategories();
    }
  };

  return (
    <div
      className={cn(
        "pointer-events-none flex cursor-not-allowed items-center gap-2 rounded-xl border-2 border-transparent p-2 hover:bg-gray-100",
        {
          "pointer-events-auto cursor-pointer": canFilter,
          "border-primary": categories[category],
        },
      )}
      onClick={handleFilterCategories}
      onKeyDown={handleKeyDown}
      tabIndex={canFilter ? 0 : -1}
      role="button"
      aria-pressed={categories[category]}
    >
      <Icon className="size-6" />
      <div>
        <h4 className="font-semibold">{category}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};
