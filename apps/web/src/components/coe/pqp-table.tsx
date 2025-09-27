"use client";

import { Pagination } from "@heroui/pagination";
import {
  type SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import type { PqpRate } from "@web/app/coe/pqp/page";
import { Currency } from "@web/components/currency";
import { ArrowUpDown } from "lucide-react";
import { type Key, useCallback, useMemo, useState } from "react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface Props {
  rows: PqpRate[];
  columns: Column[];
  rowsPerPage?: number;
}

export const PQPTable = ({ rows, columns, rowsPerPage = 10 }: Props) => {
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "month",
    direction: "descending",
  });

  const pages = Math.ceil(rows.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];

      let cmp: number;

      // Special handling for month column (YYYY-MM format)
      if (sortDescriptor.column === "month") {
        cmp = String(first).localeCompare(String(second));
      } else {
        // For other columns, try numeric comparison first, then string
        const firstNum = parseFloat(String(first));
        const secondNum = parseFloat(String(second));

        if (!Number.isNaN(firstNum) && !Number.isNaN(secondNum)) {
          cmp = firstNum - secondNum;
        } else {
          cmp = String(first).localeCompare(String(second));
        }
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((row: PqpRate, columnKey: Key) => {
    const cellValue = row[columnKey as keyof PqpRate];

    switch (columnKey) {
      case "Category A":
      case "Category B":
      case "Category C":
      case "Category D":
        return <Currency value={cellValue as number} />;
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      sortDescriptor={sortDescriptor}
      sortIcon={<ArrowUpDown size={16} />}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={setPage}
          />
        </div>
      }
      bottomContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} allowsSorting={column.sortable}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
