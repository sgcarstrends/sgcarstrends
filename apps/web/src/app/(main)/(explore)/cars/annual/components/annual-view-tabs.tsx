"use client";

import { Tabs } from "@heroui/react";
import {
  VIEWS,
  type View,
} from "@web/app/(main)/(explore)/cars/annual/search-params";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { type ReactNode, useTransition } from "react";

interface AnnualViewTabsProps {
  fuelTypeContent: ReactNode;
  makeContent: ReactNode;
}

export function AnnualViewTabs({
  fuelTypeContent,
  makeContent,
}: AnnualViewTabsProps) {
  const [, startTransition] = useTransition();
  const [view, setView] = useQueryState(
    "view",
    parseAsStringLiteral(VIEWS)
      .withDefault("fuel-type")
      .withOptions({ shallow: false, startTransition }),
  );

  return (
    <Tabs
      selectedKey={view}
      onSelectionChange={(key) => setView(key as View)}
      variant="primary"
      aria-label="Annual data view"
    >
      <Tabs.ListContainer>
        <Tabs.List>
          <Tabs.Tab id="fuel-type">By Fuel Type</Tabs.Tab>
          <Tabs.Tab id="make">By Make</Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel id="fuel-type">
        <div className="flex flex-col gap-10 pt-4">{fuelTypeContent}</div>
      </Tabs.Panel>
      <Tabs.Panel id="make">
        <div className="flex flex-col gap-10 pt-4">{makeContent}</div>
      </Tabs.Panel>
    </Tabs>
  );
}
