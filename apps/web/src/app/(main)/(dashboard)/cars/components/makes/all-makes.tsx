"use client";

import type { Make } from "@web/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Key } from "react";
import { useCallback, useRef, useState } from "react";
import { MakeGrid } from "./make-grid";

interface AllMakesProps {
  title: string;
  sortedMakes: Make[];
  groupedMakes: Record<string, Make[]>;
  letters: string[];
  logoUrlMap?: Record<string, string>;
}

export function AllMakes({
  title,
  sortedMakes,
  groupedMakes,
  letters,
  logoUrlMap = {},
}: AllMakesProps) {
  const [selectedLetter, setSelectedLetter] = useState(letters[0]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectionChange = useCallback((key: Key) => {
    setSelectedLetter(String(key));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const activeMakes =
    selectedLetter === "ALL"
      ? sortedMakes
      : (groupedMakes[selectedLetter] ?? []);

  if (sortedMakes.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-foreground text-lg">{title}</h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
            {sortedMakes.length}
          </span>
        </div>
      </div>

      {/* Letter filter tabs */}
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-default-200 bg-white text-default-500 shadow-sm transition-colors hover:bg-default-50"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex flex-1 gap-1 overflow-x-auto scroll-smooth"
        >
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => handleSelectionChange(letter)}
              className={`shrink-0 rounded-full px-3 py-1.5 font-medium text-sm transition-all ${
                selectedLetter === letter
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-default-600 hover:bg-default-100"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-default-200 bg-white text-default-500 shadow-sm transition-colors hover:bg-default-50"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Results info and grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            {selectedLetter === "#" ? "Other" : selectedLetter}
          </span>
          <span className="text-default-400">·</span>
          <span className="text-default-500 text-sm">
            {activeMakes.length} {activeMakes.length === 1 ? "make" : "makes"}
          </span>
        </div>
        <MakeGrid makes={activeMakes} logoUrlMap={logoUrlMap} />
      </div>
    </section>
  );
}
