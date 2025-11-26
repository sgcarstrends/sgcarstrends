"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@sgcarstrends/ui/components/tooltip";
import { CategoryInfo } from "@web/app/(dashboard)/cars/_components/category-info";
import type { COECategory } from "@web/types";
import {
  Bike,
  Car,
  CircleDollarSign,
  HelpCircleIcon,
  Truck,
} from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";

const defaultCategories = ["Category A", "Category B", "Category E"];

export const COECategories = () => {
  const [categories, setCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault(defaultCategories),
  );

  const toggleCategory = useCallback(
    (category: COECategory) => {
      setCategories((prev) => {
        if (prev.includes(category)) {
          return prev.filter((c) => c !== category);
        }
        return [...prev, category];
      });
    },
    [setCategories],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>COE Categories</CardTitle>
        <CardDescription>
          <TooltipProvider>
            <Tooltip>
              <span>Filter based on Category </span>
              <TooltipTrigger>
                <HelpCircleIcon className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>You can only filter Categories C & D</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <CategoryInfo
            icon={Car}
            category="Category A"
            description="Cars up to 1600cc & 97kW"
            canFilter={false}
            isSelected={categories.includes("Category A")}
            onToggle={toggleCategory}
          />
          <CategoryInfo
            icon={Car}
            category="Category B"
            description="Cars above 1600cc or 97kW"
            canFilter={false}
            isSelected={categories.includes("Category B")}
            onToggle={toggleCategory}
          />
          <CategoryInfo
            icon={Truck}
            category="Category C"
            description="Goods vehicles & buses"
            isSelected={categories.includes("Category C")}
            onToggle={toggleCategory}
          />
          <CategoryInfo
            icon={Bike}
            category="Category D"
            description="Motorcycles"
            isSelected={categories.includes("Category D")}
            onToggle={toggleCategory}
          />
          <CategoryInfo
            icon={CircleDollarSign}
            category="Category E"
            description="Open Category"
            canFilter={false}
            isSelected={categories.includes("Category E")}
            onToggle={toggleCategory}
          />
        </div>
      </CardContent>
    </Card>
  );
};
