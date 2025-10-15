"use client";

import slugify from "@sindresorhus/slugify";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@web/components/ui/button";
import type { Car } from "@web/types";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Car>[] = [
  {
    accessorKey: "month",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Month
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "fuelType",
    header: "Fuel Type",
    cell: ({ row }) => {
      const type: string = row.getValue("fuelType");
      return <Link href={`/cars/fuel-types/${slugify(type)}`}>{type}</Link>;
    },
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
    cell: ({ row }) => {
      const type: string = row.getValue("vehicleType");
      return <Link href={`/cars/vehicle-types/${slugify(type)}`}>{type}</Link>;
    },
  },
  {
    accessorKey: "count",
    header: "Count",
  },
];
