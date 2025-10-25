"use client";

import { Chip } from "@heroui/chip";
import { Tab, Tabs } from "@heroui/tabs";
import { useGroupedMakes } from "@web/hooks/use-grouped-makes";
import type { Make } from "@web/types";
import type { Key } from "react";
import { useCallback, useState } from "react";
import { MakeGrid } from "./make-grid";

interface MakesProps {
  title: string;
  makes: Make[];
  isPopular?: boolean;
  showLetterFilter?: boolean;
}

export const Makes = ({
  title,
  makes,
  isPopular = false,
  showLetterFilter = false,
}: MakesProps) => {
  const { sortedMakes, groupedMakes, letters } = useGroupedMakes(makes);
  const [selectedLetter, setSelectedLetter] = useState(letters[0]);

  const handleSelectionChange = useCallback((key: Key) => {
    setSelectedLetter(String(key));
  }, []);

  const activeMakes = showLetterFilter
    ? selectedLetter === "ALL"
      ? sortedMakes
      : (groupedMakes[selectedLetter] ?? [])
    : makes;

  if (makes.length === 0) return null;

  return (
    <section className={showLetterFilter ? "space-y-6" : "space-y-4"}>
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-xl">{title}</h2>
        <Chip size="sm" variant="shadow" color="primary">
          {makes.length}
        </Chip>
      </div>

      {showLetterFilter && (
        <Tabs
          aria-label="Makes A to Z filter"
          selectedKey={selectedLetter}
          onSelectionChange={handleSelectionChange}
          className="max-w-full overflow-x-auto"
          classNames={{
            tabList:
              "w-full rounded-full border border-default-200 bg-default-100/70 p-1",
            tab: "px-3 py-1 text-sm font-medium text-default-600 data-[selected=true]:bg-primary-600 data-[selected=true]:text-primary-foreground",
          }}
          variant="solid"
          color="primary"
          radius="full"
          size="sm"
        >
          {letters.map((letter) => (
            <Tab key={letter} title={letter} />
          ))}
        </Tabs>
      )}

      {showLetterFilter ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-default-100 px-2 font-semibold text-default-600 text-sm uppercase">
              {selectedLetter === "#" ? "Other" : selectedLetter}
            </span>
            <span className="text-default-400 text-sm">
              {activeMakes.length} {activeMakes.length === 1 ? "make" : "makes"}
            </span>
          </div>
          <div>
            <MakeGrid makes={activeMakes} isPopular={isPopular} />
          </div>
        </div>
      ) : (
        <MakeGrid makes={activeMakes} isPopular={isPopular} />
      )}
    </section>
  );
};
