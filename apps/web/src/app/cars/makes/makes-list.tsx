"use client";

import { useMemo, useState } from "react";
import { Chip, Input } from "@heroui/react";
import { Search } from "lucide-react";
import {
  PopularMakesSection,
  OtherMakesSection,
  MakesSearchResults,
} from "@/components/makes";
import { type Make } from "@/types";

interface PopularMakesProps {
  makes: Make[];
}

// TODO: Popular makes to pin at the top. This will come from an API later
const POPULAR_MAKES = [
  "AUDI",
  "BMW",
  "HONDA",
  "HYUNDAI",
  "KIA",
  "MERCEDES BENZ",
  "TOYOTA",
  "VOLKSWAGEN",
];

export const MakesList = ({ makes }: PopularMakesProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { popular, others } = useMemo(() => {
    const popular = POPULAR_MAKES.filter((make) => makes.includes(make));
    const others = makes.filter((make) => !POPULAR_MAKES.includes(make));

    return { popular, others };
  }, [makes]);

  const filteredMakes = useMemo(() => {
    if (!searchTerm) {
      return [...popular, ...others];
    }

    const filtered = makes.filter((make) =>
      make.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Maintain popular makes order even in search
    const filteredPopular = popular.filter((make) =>
      make.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const filteredOthers = filtered.filter((make) => !popular.includes(make));

    return [...filteredPopular, ...filteredOthers];
  }, [makes, searchTerm, popular, others]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="size-4" />}
            variant="bordered"
          />
          <Chip variant="flat" color="primary">
            {filteredMakes.length} of {makes.length} makes
          </Chip>
        </div>
      </div>

      {/* Popular Makes Section */}
      {!searchTerm && <PopularMakesSection makes={popular} />}

      {/* Other Makes Section */}
      {!searchTerm && <OtherMakesSection makes={others} />}

      {/* Search Results */}
      {searchTerm && (
        <MakesSearchResults
          makes={filteredMakes}
          popular={popular}
          searchTerm={searchTerm}
        />
      )}

      {filteredMakes.length === 0 && (
        <div className="py-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-default-100 rounded-full p-4">
              <Search className="text-default-400 size-8" />
            </div>
            <div className="text-default-500">
              No makes found matching &quot;{searchTerm}&quot;
            </div>
            <p className="text-default-400">
              Try adjusting your search term or browse all available makes
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
