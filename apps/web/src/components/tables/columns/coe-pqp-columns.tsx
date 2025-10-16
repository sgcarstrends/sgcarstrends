"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Pqp } from "@web/types/coe";
import { formatCurrency } from "@web/utils/format-currency";

const createCategoryColumn = (category: string): ColumnDef<Pqp.TableRow> => ({
  accessorKey: category,
  header: category,
  cell: ({ row }) => `S${formatCurrency(row.getValue<number>(category))}`,
});

export const columns: ColumnDef<Pqp.TableRow>[] = [
  {
    accessorKey: "month",
    header: "Month",
  },
  ...["Category A", "Category B", "Category C", "Category D"].map(
    createCategoryColumn,
  ),
];
