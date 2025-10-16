"use client";

import { CategoryInfo } from "@web/components/cars/category-info";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/components/ui/tooltip";
import {
  Bike,
  Car,
  CircleDollarSign,
  HelpCircleIcon,
  Truck,
} from "lucide-react";

export const COECategories = () => {
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
          />
          <CategoryInfo
            icon={Car}
            category="Category B"
            description="Cars above 1600cc or 97kW"
            canFilter={false}
          />
          <CategoryInfo
            icon={Truck}
            category="Category C"
            description="Goods vehicles & buses"
          />
          <CategoryInfo
            icon={Bike}
            category="Category D"
            description="Motorcycles"
          />
          <CategoryInfo
            icon={CircleDollarSign}
            category="Category E"
            description="Open Category"
            canFilter={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};
