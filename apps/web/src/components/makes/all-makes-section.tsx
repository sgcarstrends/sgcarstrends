"use client";

import { Chip } from "@heroui/chip";
import { Tab, Tabs } from "@heroui/tabs";
import type { Make } from "@web/types";
import type { Key } from "react";
import { useCallback, useMemo, useState } from "react";
import { MakeCard } from "./make-card";

interface AllMakesSectionProps {
  makes: Make[];
}

const getLetterFromMake = (make: Make) => {
  const firstChar = make.trim().charAt(0).toUpperCase();
  return firstChar >= "A" && firstChar <= "Z" ? firstChar : "#";
};

export const AllMakesSection = ({ makes }: AllMakesSectionProps) => {
  const sortedMakes = useMemo(
    () => [...makes].sort((a, b) => a.localeCompare(b)),
    [makes],
  );

  const { groupedMakes, letters } = useMemo(() => {
    const grouped = sortedMakes.reduce<Record<string, Make[]>>((acc, make) => {
      const letter = getLetterFromMake(make);
      acc[letter] = acc[letter] ? [...acc[letter], make] : [make];
      return acc;
    }, {});

    const sortedLetters = Object.keys(grouped).sort((a, b) => {
      if (a === "#") return 1;
      if (b === "#") return -1;
      return a.localeCompare(b);
    });

    return {
      groupedMakes: grouped,
      letters: ["ALL", ...sortedLetters],
    };
  }, [sortedMakes]);

  const [selectedLetter, setSelectedLetter] = useState(letters[0]);

  const handleSelectionChange = useCallback((key: Key) => {
    setSelectedLetter(String(key));
  }, []);

  const activeMakes =
    selectedLetter === "ALL"
      ? sortedMakes
      : (groupedMakes[selectedLetter] ?? []);

  if (makes.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-xl">All Makes</h2>
        <Chip size="sm" variant="shadow" color="primary">
          {makes.length}
        </Chip>
      </div>

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

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            data-testid="makes-letter-badge"
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-default-100 px-2 font-semibold text-default-600 text-sm uppercase"
          >
            {selectedLetter === "#" ? "Other" : selectedLetter}
          </span>
          <span className="text-default-400 text-sm">
            {activeMakes.length} {activeMakes.length === 1 ? "make" : "makes"}
          </span>
        </div>
        <div
          data-testid="makes-letter-grid"
          className="grid grid-cols-2 gap-4 md:grid-cols-8"
        >
          {activeMakes.map((make) => (
            <MakeCard key={make} make={make} />
          ))}
        </div>
      </div>
    </section>
  );
};
