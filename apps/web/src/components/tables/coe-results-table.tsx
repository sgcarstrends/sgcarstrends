"use client";

import useStore from "@web/app/store";
import { columns } from "@web/components/tables/columns/coe-results-columns";
import { DataTable } from "@web/components/ui/data-table";
import type { COEResult } from "@web/types";
import { useCallback, useMemo } from "react";

interface Props {
  coeResults: COEResult[];
}

export const TrendTable = ({ coeResults }: Props) => {
  const categories = useStore(({ categories }) => categories);

  const sortCOEResults = useCallback((a: COEResult, b: COEResult) => {
    if (a.month !== b.month) {
      return b.month.localeCompare(a.month);
    }

    if (a.bidding_no !== b.bidding_no) {
      return b.bidding_no - a.bidding_no;
    }

    return a.vehicle_class.localeCompare(b.vehicle_class);
  }, []);

  const sortedData = useMemo(
    () =>
      coeResults
        .filter(({ vehicle_class }) => categories[vehicle_class])
        .sort(sortCOEResults),
    [categories, coeResults, sortCOEResults],
  );

  return <DataTable columns={columns} data={sortedData} />;
};
