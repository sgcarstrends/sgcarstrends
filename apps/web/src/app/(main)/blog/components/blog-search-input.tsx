"use client";

import { Input } from "@heroui/input";
import { Search, X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export function BlogSearchInput() {
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, throttleMs: 300 }),
  );

  return (
    <Input
      type="search"
      placeholder="Search blog posts..."
      value={query}
      onValueChange={setQuery}
      startContent={<Search className="size-4 text-default-400" />}
      endContent={
        query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <X className="size-4 text-default-400" />
          </button>
        ) : null
      }
      classNames={{ inputWrapper: "rounded-full" }}
      isClearable={false}
      aria-label="Search blog posts"
    />
  );
}
