"use client";

import { DataTable } from "@sgcarstrends/ui/components/data-table";
import useStore from "@web/app/store";
import { columns } from "@web/components/tables/columns/coe-results-columns";
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

    if (a.biddingNo !== b.biddingNo) {
      return b.biddingNo - a.biddingNo;
    }

    return a.vehicleClass.localeCompare(b.vehicleClass);
  }, []);

  const sortedData = useMemo(
    () =>
      coeResults
        .filter(({ vehicleClass }) => categories[vehicleClass])
        .sort(sortCOEResults),
    [categories, coeResults, sortCOEResults],
  );

  return <DataTable columns={columns} data={sortedData} />;
};
