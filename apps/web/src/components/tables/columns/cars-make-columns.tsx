"use client";

import type { SelectCar } from "@sgcarstrends/database";
import { Button } from "@sgcarstrends/ui/components/button";
import slugify from "@sindresorhus/slugify";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Partial<SelectCar>>[] = [
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
      const fuelType: string = row.getValue("fuelType");
      return (
        <Link href={`/cars/fuel-types/${slugify(fuelType)}`}>{fuelType}</Link>
      );
    },
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
    cell: ({ row }) => {
      const vehicleType: string = row.getValue("vehicleType");
      return (
        <Link href={`/cars/vehicle-types/${slugify(vehicleType)}`}>
          {vehicleType}
        </Link>
      );
    },
  },
  {
    accessorKey: "count",
    header: "Count",
  },
];
