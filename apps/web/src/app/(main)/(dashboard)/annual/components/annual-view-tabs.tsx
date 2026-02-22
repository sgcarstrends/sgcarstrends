"use client";

import { Tab, Tabs } from "@heroui/tabs";
import {
  searchParams,
  type View,
} from "@web/app/(main)/(dashboard)/annual/search-params";
import { useQueryStates } from "nuqs";

interface AnnualViewTabsProps {
  currentView: View;
}

export function AnnualViewTabs({ currentView }: AnnualViewTabsProps) {
  const [, setSearchParams] = useQueryStates(searchParams);

  return (
    <Tabs
      selectedKey={currentView}
      onSelectionChange={(key) => setSearchParams({ view: key as View })}
      variant="underlined"
      aria-label="Annual data view"
    >
      <Tab key="fuel-type" title="By Fuel Type" />
      <Tab key="make" title="By Make" />
    </Tabs>
  );
}
