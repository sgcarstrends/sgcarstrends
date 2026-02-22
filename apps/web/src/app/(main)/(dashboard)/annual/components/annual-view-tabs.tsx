"use client";

import { Tab, Tabs } from "@heroui/tabs";
import {
  VIEWS,
  type View,
} from "@web/app/(main)/(dashboard)/annual/search-params";
import { parseAsStringLiteral, useQueryState } from "nuqs";

export function AnnualViewTabs() {
  const [view, setView] = useQueryState(
    "view",
    parseAsStringLiteral(VIEWS).withDefault("fuel-type"),
  );

  return (
    <Tabs
      selectedKey={view}
      onSelectionChange={(key) => setView(key as View)}
      variant="underlined"
      aria-label="Annual data view"
    >
      <Tab key="fuel-type" title="By Fuel Type" />
      <Tab key="make" title="By Make" />
    </Tabs>
  );
}
