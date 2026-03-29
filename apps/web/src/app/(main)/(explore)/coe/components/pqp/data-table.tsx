"use client";

import { Button, type SortDescriptor, Table } from "@heroui/react";
import { Currency } from "@web/components/shared/currency";
import type { Pqp } from "@web/types/coe";
import { type Key, useCallback, useMemo, useState } from "react";

interface DataTableProps {
  rows: Pqp.TableRow[];
  columns: Pqp.TableColumn[];
  rowsPerPage?: number;
}

export function DataTable({ rows, columns, rowsPerPage = 10 }: DataTableProps) {
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

  const renderCell = useCallback((row: Pqp.TableRow, columnKey: Key) => {
    const cellValue = row[columnKey as keyof Pqp.TableRow];

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
    <Table.ScrollContainer>
      <Table.Content
        aria-label="PQP rates table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column key={column.key} allowsSorting={column.sortable}>
              {column.label}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={sortedItems}>
          {(item) => (
            <Table.Row key={item.key}>
              {(columnKey) => (
                <Table.Cell>
                  {renderCell(item, columnKey as unknown as Key)}
                </Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table.Content>
      <Table.Footer>
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="tertiary"
            isDisabled={page === 1}
            onPress={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-default-500 text-sm">
            Page {page} of {pages}
          </span>
          <Button
            size="sm"
            variant="tertiary"
            isDisabled={page === pages}
            onPress={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </Table.Footer>
    </Table.ScrollContainer>
  );
}
