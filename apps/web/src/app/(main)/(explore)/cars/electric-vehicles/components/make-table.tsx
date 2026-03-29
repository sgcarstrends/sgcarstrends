"use client";

import { Button, Card, type SortDescriptor, Table } from "@heroui/react";
import { CARD_PADDING, RADIUS } from "@sgcarstrends/theme/spacing";
import { cn } from "@sgcarstrends/ui/lib/utils";
import Typography from "@web/components/typography";
import type { EvMakeDetail } from "@web/queries/cars";
import { sortByDescriptor } from "@web/utils/sort";
import { type Key, useCallback, useMemo, useState } from "react";

interface MakeTableProps {
  data: EvMakeDetail[];
  month: string;
}

const columns = [
  { key: "rank", label: "#" },
  { key: "make", label: "Make" },
  { key: "bev", label: "BEV" },
  { key: "phev", label: "PHEV" },
  { key: "hybrid", label: "Hybrid" },
  { key: "total", label: "Total" },
];

const ROWS_PER_PAGE = 20;

export function MakeTable({ data, month }: MakeTableProps) {
  const numberFormatter = new Intl.NumberFormat("en-SG");
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "total",
    direction: "descending",
  });

  const rankedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [data]);

  const sortedData = useMemo(() => {
    return sortByDescriptor(rankedData, sortDescriptor);
  }, [rankedData, sortDescriptor]);

  const pages = Math.ceil(sortedData.length / ROWS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return sortedData.slice(start, start + ROWS_PER_PAGE);
  }, [sortedData, page]);

  const renderCell = useCallback(
    (item: (typeof rankedData)[0], columnKey: Key) => {
      switch (columnKey) {
        case "rank":
          return item.rank;
        case "make":
          return item.make;
        case "bev":
          return numberFormatter.format(item.bev);
        case "phev":
          return numberFormatter.format(item.phev);
        case "hybrid":
          return numberFormatter.format(item.hybrid);
        case "total":
          return numberFormatter.format(item.total);
        default:
          return null;
      }
    },
    [numberFormatter],
  );

  return (
    <Card className={cn(RADIUS.card, CARD_PADDING.standard)}>
      <Card.Header className="flex flex-col items-start gap-2">
        <Typography.H4>EV Registrations by Make</Typography.H4>
        <Typography.TextSm className="text-default-500">
          {data.length} makes with EV registrations in {month}
        </Typography.TextSm>
      </Card.Header>
      <Card.Content>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="EV registrations by make"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column
                  key={column.key}
                  allowsSorting={column.key !== "rank"}
                >
                  {column.label}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body items={paginatedData}>
              {(item) => (
                <Table.Row key={item.make}>
                  {(columnKey) => (
                    <Table.Cell>
                      {renderCell(item, columnKey as unknown as Key)}
                    </Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
          {pages > 1 && (
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
          )}
        </Table.ScrollContainer>
      </Card.Content>
    </Card>
  );
}
