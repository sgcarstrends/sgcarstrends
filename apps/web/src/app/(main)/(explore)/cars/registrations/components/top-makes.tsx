import { Card, Label, ProgressBar } from "@heroui/react";
import { slugify } from "@sgcarstrends/utils";
import Typography from "@web/components/typography";
import type { FuelType } from "@web/types/cars";
import Link from "next/link";

// interface Category {
//   title: string;
//   description?: string;
//   icon: LucideIcon;
//   colour: string;
//   url: string;
// }

interface TopMakesProps {
  data: FuelType[];
}

// TODO: Keeping this for now
// const CATEGORIES: Category[] = [
//   {
//     title: "Overall",
//     description: "Combination of all fuel types",
//     icon: Trophy,
//     colour: "text-yellow-600",
//   },
//   {
//     title: "Petrol",
//     description: "Internal Combustion Engine (ICE) vehicles",
//     icon: Fuel,
//     colour: "text-red-600",
//     url: "/cars/fuel-types/petrol",
//   },
//   {
//     title: "Hybrid",
//     description: "Includes Petrol, Diesel and Plug-In types",
//     icon: Zap,
//     colour: "text-blue-600",
//     url: "/cars/fuel-types/hybrid",
//   },
//   {
//     title: "Electric",
//     description: "Battery Electric Vehicles (BEV)",
//     icon: Battery,
//     colour: "text-green-600",
//     url: "/cars/fuel-types/electric",
//   },
//   {
//     title: "Diesel",
//     description: "Compression-ignition engine vehicles",
//     icon: Droplet,
//     colour: "text-gray-600",
//     url: "/cars/fuel-types/diesel",
//   },
// ];

export function TopMakes({ data }: TopMakesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
      {data.map(({ fuelType, total, makes }) => {
        const href = `/cars/fuel-types/${slugify(fuelType)}`;

        return (
          <Card key={fuelType} className="p-3">
            <Card.Header>
              <Typography.H4>{fuelType}</Typography.H4>
            </Card.Header>
            <Card.Content>
              {makes.map(({ make, count }) => (
                <div key={make} className="py-2">
                  <ProgressBar
                    color="accent"
                    formatOptions={{
                      style: "decimal",
                      maximumFractionDigits: 0,
                    }}
                    maxValue={total}
                    size="sm"
                    value={count}
                  >
                    <Label className="max-w-md text-xs">
                      {make.toUpperCase()}
                    </Label>
                    <ProgressBar.Output />
                    <ProgressBar.Track className="max-w-md">
                      <ProgressBar.Fill />
                    </ProgressBar.Track>
                  </ProgressBar>
                </div>
              ))}
            </Card.Content>
            <Card.Footer>
              <Link href={href} className="underline">
                View More
              </Link>
            </Card.Footer>
          </Card>
        );
      })}
    </div>
  );
}
