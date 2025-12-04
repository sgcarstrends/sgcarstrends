"use client";

import { Button } from "@heroui/button";
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
        variant="light"
        onPress={() => column.toggleSorting(column.getIsSorted() === "asc")}
        endContent={<ArrowUpDown className="size-4" />}
      >
        Month
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
