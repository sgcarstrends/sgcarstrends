"use client";

import { Button } from "@sgcarstrends/ui/components/button";
import type { ColumnDef } from "@tanstack/react-table";
import type { COEResult } from "@web/types";
import { formatCurrency } from "@web/utils/format-currency";
import { formatOrdinal } from "@web/utils/format-ordinal";
import { ArrowUpDown } from "lucide-react";

// const formatPercent = (value: any) =>
//   Intl.NumberFormat("en-SG", { style: "percent" }).format(value);

export const columns: ColumnDef<COEResult>[] = [
  {
    accessorKey: "month",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Month
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
  },
  {
    accessorKey: "vehicleClass",
    header: "Category",
    cell: ({ row }) => row.getValue<string>("vehicleClass"),
  },
  {
    accessorKey: "premium",
    header: "Quota Premium (S$)",
    cell: ({ row }) => `S${formatCurrency(row.getValue<number>("premium"))}`,
  },
  {
    accessorKey: "biddingNo",
    header: "Bidding Round",
    cell: ({ row }) =>
      `${formatOrdinal(row.getValue<number>("biddingNo"))} Round`,
  },
  // { accessorKey: "quota", header: "Quota" },
  // { accessorKey: "bidsReceived", header: "Bids Received" },
  // {
  //   accessorKey: "bidsSuccess",
  //   header: "Bids Success",
  //   cell: ({ row }) =>
  //     `${row.getValue("bidsSuccess") as number} (${formatPercent((row.getValue("bidsSuccess") as number) / (row.getValue("bidsReceived") as number))})`,
  // },
  // {
  //   accessorKey: "oversubscribed",
  //   header: "Oversubscribed (%)",
  //   cell: ({ row }) =>
  //     formatPercent(
  //       (row.getValue("bidsReceived") as number) /
  //         (row.getValue("quota") as number) -
  //         1,
  //     ),
  // },
];
