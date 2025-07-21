"use client";

import { formatCurrency } from "@/utils/format-currency";
import type { PQP } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

const createCategoryColumn = (category: string): ColumnDef<PQP> => ({
  accessorKey: category,
  header: category,
  cell: ({ row }) => `S${formatCurrency(row.getValue<number>(category))}`,
});

export const columns: ColumnDef<PQP>[] = [
  {
    accessorKey: "month",
    header: "Month",
  },
  ...["Category A", "Category B", "Category C", "Category D"].map(
    createCategoryColumn,
  ),
];
