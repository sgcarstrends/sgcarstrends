import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { slugify } from "@sgcarstrends/utils";
import type { Make } from "@web/types";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs/server";
import type { Key } from "react";

interface MakeSearchProps {
  makes: Make[];
}

export function MakeSearch({ makes }: MakeSearchProps) {
  const [make, setMake] = useQueryState(
    "make",
    parseAsString.withOptions({ shallow: false }),
  );

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) {
      setMake(null);
    } else {
      setMake(slugify(key as string));
    }
  };

  return (
    <Autocomplete
      aria-label="Search make..."
      placeholder="Search make..."
      startContent={<Search className="size-4" />}
      selectedKey={make}
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
