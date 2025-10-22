"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Progress,
} from "@heroui/react";
import slugify from "@sindresorhus/slugify";
import type { FuelType } from "@web/types/cars";
import Link from "next/link";

// interface Category {
//   title: string;
//   description?: string;
//   icon: LucideIcon;
//   colour: string;
//   url: string;
// }

interface Props {
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

export const TopMakes = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
      {data.map(({ fuelType, total, makes }) => {
        const href = `/cars/fuel-types/${slugify(fuelType)}`;

        return (
          <Card key={fuelType}>
            <CardHeader>
              <h4 className="font-bold text-large">{fuelType}</h4>
            </CardHeader>
            <CardBody>
              {makes.map(({ make, count }) => (
                <div key={make} className="py-2">
                  <Progress
                    className="max-w-md"
                    color="primary"
                    formatOptions={{
                      style: "decimal",
                      maximumFractionDigits: 0,
                    }}
                    label={make.toUpperCase()}
                    maxValue={total}
                    showValueLabel={true}
                    size="sm"
                    value={count}
                  />
                </div>
              ))}
            </CardBody>
            <CardFooter>
              <Link href={href} className="underline">
                View More
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
