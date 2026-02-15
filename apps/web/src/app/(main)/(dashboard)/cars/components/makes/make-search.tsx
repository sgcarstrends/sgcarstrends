"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { slugify } from "@sgcarstrends/utils";
import type { Make } from "@web/types";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Key } from "react";

interface MakeSearchProps {
  makes: Make[];
}

export function MakeSearch({ makes }: MakeSearchProps) {
  const router = useRouter();

  const handleSelectionChange = (key: Key | null) => {
    if (key) {
      router.push(`/cars/makes/${slugify(key as string)}`);
    }
  };

  return (
    <Autocomplete
      aria-label="Search make..."
      placeholder="Search make..."
      startContent={<Search className="size-4" />}
      onSelectionChange={handleSelectionChange}
      variant="underlined"
    >
      {makes.map((make) => {
        return (
          <AutocompleteItem key={make} textValue={make}>
            {make}
          </AutocompleteItem>
        );
      })}
    </Autocomplete>
  );
}
