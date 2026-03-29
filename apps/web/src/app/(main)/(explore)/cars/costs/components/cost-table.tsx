"use client";

import {
  Button,
  Chip,
  InputGroup,
  ListBox,
  Select,
  type SortDescriptor,
  Table,
} from "@heroui/react";
import type { SelectCarCost } from "@sgcarstrends/database";
import { cn } from "@sgcarstrends/ui/lib/utils";
import { formatCurrency } from "@sgcarstrends/utils";
import { CostLegend } from "@web/app/(main)/(explore)/cars/costs/components/cost-legend";
import { FUEL_TYPE_LABELS } from "@web/app/(main)/(explore)/cars/costs/constants";
import Typography from "@web/components/typography";
import { sortByDescriptor } from "@web/utils/sort";
import { Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { type Key, useCallback, useMemo, useState } from "react";

interface CostTableProps {
  data: SelectCarCost[];
}

const columns = [
  { key: "make", label: "Make" },
  { key: "model", label: "Model" },
  { key: "fuelType", label: "Fuel Type" },
  { key: "vesBanding", label: "VES Band" },
  { key: "omv", label: "OMV" },
  { key: "arf", label: "ARF" },
  { key: "vesSurchargeRebate", label: "VES" },
  { key: "coePremium", label: "COE" },
  { key: "totalBasicCostWithoutCoe", label: "Basic Cost (w/o COE)" },
  { key: "totalBasicCostWithCoe", label: "Basic Cost (w/ COE)" },
  { key: "sellingPriceWithoutCoe", label: "Selling Price (w/o COE)" },
  { key: "sellingPriceWithCoe", label: "Selling Price (w/ COE)" },
];

const ROWS_PER_PAGE = 20;

const FUEL_TYPE_COLORS: Record<
  string,
  "success" | "accent" | "warning" | "default"
> = {
  E: "success",
  H: "accent",
  R: "accent",
  P: "warning",
};

const VES_BAND_COLORS: Record<
  string,
  "success" | "accent" | "warning" | "danger" | "default"
> = {
  A: "success",
  B: "accent",
  C1: "warning",
  C2: "warning",
  C3: "danger",
};

export function CostTable({ data }: CostTableProps) {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: true, throttleMs: 300 }),
  );
  const [makeFilter, setMakeFilter] = useQueryState(
    "make",
    parseAsString.withDefault("").withOptions({ shallow: true }),
  );
  const [fuelFilter, setFuelFilter] = useQueryState(
    "fuel",
    parseAsString.withDefault("").withOptions({ shallow: true }),
  );
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "sellingPriceWithCoe",
    direction: "ascending",
  });

  const makes = useMemo(
    () => [...new Set(data.map((item) => item.make))].sort(),
    [data],
  );
  const fuelTypes = useMemo(
    () =>
      [...new Set(data.map((item) => item.fuelType).filter(Boolean))].sort(),
    [data],
  );

  const filteredData = useMemo(() => {
    let result = data;

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.make.toLowerCase().includes(query) ||
          item.model.toLowerCase().includes(query),
      );
    }

    if (makeFilter) {
      result = result.filter((item) => item.make === makeFilter);
    }

    if (fuelFilter) {
      result = result.filter((item) => item.fuelType === fuelFilter);
    }

    return result;
  }, [data, search, makeFilter, fuelFilter]);

  const sortedData = useMemo(
    () => sortByDescriptor(filteredData, sortDescriptor),
    [filteredData, sortDescriptor],
  );

  const pages = Math.ceil(sortedData.length / ROWS_PER_PAGE);
  const effectivePage = Math.min(page, Math.max(pages, 1));
  const paginatedData = useMemo(() => {
    const start = (effectivePage - 1) * ROWS_PER_PAGE;
    return sortedData.slice(start, start + ROWS_PER_PAGE);
  }, [sortedData, effectivePage]);

  const renderCell = useCallback((item: SelectCarCost, columnKey: Key) => {
    switch (columnKey) {
      case "make":
        return item.make;
      case "model":
        return item.model;
      case "fuelType":
        return (
          <Chip
            size="sm"
            variant="tertiary"
            color={FUEL_TYPE_COLORS[item.fuelType ?? ""] ?? "default"}
          >
            {FUEL_TYPE_LABELS[item.fuelType ?? ""] ?? item.fuelType}
          </Chip>
        );
      case "vesBanding":
        return (
          <Chip
            size="sm"
            variant="tertiary"
            color={VES_BAND_COLORS[item.vesBanding] ?? "default"}
          >
            {item.vesBanding}
          </Chip>
        );
      case "omv":
        return formatCurrency(item.omv);
      case "arf":
        return formatCurrency(item.arf);
      case "vesSurchargeRebate":
        return (
          <span
            className={cn(
              "font-medium",
              item.vesSurchargeRebate < 0 ? "text-success" : "text-danger",
            )}
          >
            {formatCurrency(item.vesSurchargeRebate)}
          </span>
        );
      case "coePremium":
        return formatCurrency(item.coePremium);
      case "totalBasicCostWithoutCoe":
        return formatCurrency(item.totalBasicCostWithoutCoe);
      case "totalBasicCostWithCoe":
        return (
          <span className="font-semibold">
            {formatCurrency(item.totalBasicCostWithCoe)}
          </span>
        );
      case "sellingPriceWithoutCoe":
        return item.sellingPriceWithoutCoe
          ? formatCurrency(item.sellingPriceWithoutCoe)
          : "-";
      case "sellingPriceWithCoe":
        return item.sellingPriceWithCoe ? (
          <span className="font-semibold">
            {formatCurrency(item.sellingPriceWithCoe)}
          </span>
        ) : (
          "-"
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Typography.H4>All Models</Typography.H4>
        <Typography.TextSm className="text-default-500">
          {filteredData.length} models found
        </Typography.TextSm>
      </div>
      <CostLegend />
      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <InputGroup className="sm:max-w-xs">
          <InputGroup.Prefix>
            <Search className="size-4 text-default-400" />
          </InputGroup.Prefix>
          <InputGroup.Input
            type="search"
            placeholder="Search make or model..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </InputGroup>
        <Select
          className="sm:max-w-[200px]"
          aria-label="Filter by make"
          selectedKey={makeFilter || null}
          onSelectionChange={(key) => {
            setMakeFilter(key ? String(key) : "");
            setPage(1);
          }}
        >
          <Select.Trigger>
            <Select.Value>{makeFilter || "All Makes"}</Select.Value>
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {makes.map((make) => (
                <ListBox.Item key={make} id={make}>
                  {make}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <Select
          className="sm:max-w-[240px]"
          aria-label="Filter by fuel type"
          selectedKey={fuelFilter || null}
          onSelectionChange={(key) => {
            setFuelFilter(key ? String(key) : "");
            setPage(1);
          }}
        >
          <Select.Trigger>
            <Select.Value>
              {fuelFilter
                ? (FUEL_TYPE_LABELS[fuelFilter] ?? fuelFilter)
                : "All Fuel Types"}
            </Select.Value>
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {fuelTypes.map((fuelType) => (
                <ListBox.Item key={fuelType} id={fuelType}>
                  {FUEL_TYPE_LABELS[fuelType] ?? fuelType}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Car cost breakdown table"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.key}
                allowsSorting={!["fuelType", "vesBanding"].includes(column.key)}
              >
                {column.label}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={paginatedData}>
            {(item) => (
              <Table.Row key={`${item.make}-${item.model}`}>
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
                isDisabled={effectivePage === 1}
                onPress={() => setPage(effectivePage - 1)}
              >
                Previous
              </Button>
              <span className="text-default-500 text-sm">
                Page {effectivePage} of {pages}
              </span>
              <Button
                size="sm"
                variant="tertiary"
                isDisabled={effectivePage === pages}
                onPress={() => setPage(effectivePage + 1)}
              >
                Next
              </Button>
            </div>
          </Table.Footer>
        )}
      </Table.ScrollContainer>
    </div>
  );
}
