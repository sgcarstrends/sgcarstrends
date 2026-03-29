"use client";

import { Button, InputGroup } from "@heroui/react";
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
    <InputGroup className="rounded-full">
      <InputGroup.Prefix>
        <Search className="size-4 text-default-400" />
      </InputGroup.Prefix>
      <InputGroup.Input
        type="search"
        placeholder="Search blog posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search blog posts"
      />
      {query ? (
        <InputGroup.Suffix>
          <Button
            isIconOnly
            variant="tertiary"
            size="sm"
            onPress={() => setQuery("")}
            aria-label="Clear search"
          >
            <X className="size-4 text-default-400" />
          </Button>
        </InputGroup.Suffix>
      ) : null}
    </InputGroup>
  );
}
