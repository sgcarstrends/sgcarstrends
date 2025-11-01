"use client";

import { Chip } from "@heroui/chip";
import { Tab, Tabs } from "@heroui/tabs";
import Typography from "@web/components/typography";
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
    <section
      className={
        showLetterFilter ? "flex flex-col gap-6" : "flex flex-col gap-4"
      }
    >
      <div className="flex items-center gap-2">
        <Typography.H2>{title}</Typography.H2>
        <Chip size="sm" variant="shadow" color="primary">
          {makes.length}
        </Chip>
      </div>

      {showLetterFilter && (
        <Tabs
          disableAnimation
          aria-label="Makes A to Z filter"
          selectedKey={selectedLetter}
          onSelectionChange={handleSelectionChange}
          className="max-w-full overflow-x-auto"
          classNames={{
            tabList:
              "w-full rounded-full border border-default-200 bg-default-100/70 p-1",
            tab: "px-3 py-1 text-sm font-medium text-default-600 data-[selected=true]:bg-primary-600 data-[selected=true]:text-primary-foreground",
          }}
          variant="bordered"
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Typography.Label>
              {selectedLetter === "#" ? "Other" : selectedLetter}
            </Typography.Label>
            <Typography.TextSm>
              {activeMakes.length} {activeMakes.length === 1 ? "make" : "makes"}
            </Typography.TextSm>
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
