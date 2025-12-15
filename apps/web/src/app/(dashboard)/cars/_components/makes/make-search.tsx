import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { slugify } from "@sgcarstrends/utils";
import type { Make } from "@web/types";
import { Search } from "lucide-react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs/server";
import type { Key } from "react";

interface MakeSearchProps {
  makes: Make[];
  logoUrlMap?: Record<string, string>;
}

export function MakeSearch({ makes, logoUrlMap = {} }: MakeSearchProps) {
  const [make, setMake] = useQueryState(
    "make",
    parseAsString.withOptions({ shallow: false }),
  );

  const handleSelectionChange = (key: Key | null) => {
    setMake(slugify(key as string));
  };

  return (
    <Autocomplete
      aria-label="Search car makes"
      placeholder="Search makes..."
      startContent={<Search className="size-4" />}
      selectedKey={make}
      onSelectionChange={handleSelectionChange}
      variant="bordered"
      className="w-full"
    >
      {makes.map((make) => {
        const makeSlug = slugify(make);
        const logoUrl = logoUrlMap[makeSlug];

        return (
          <AutocompleteItem key={make} textValue={make}>
            <div className="flex items-center gap-2">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={`${make} logo`}
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
              )}
              <span>{make}</span>
            </div>
          </AutocompleteItem>
        );
      })}
    </Autocomplete>
  );
}
