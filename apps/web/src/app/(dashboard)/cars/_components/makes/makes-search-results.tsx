import { slugify } from "@sgcarstrends/utils";
import type { Make } from "@web/types";
import { MakeCard } from "./make-card";

interface MakesSearchResultsProps {
  makes: Make[];
  searchTerm: string;
  logoUrlMap?: Record<string, string>;
}

export const MakesSearchResults = ({
  makes,
  logoUrlMap = {},
}: MakesSearchResultsProps) => {
  if (makes.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
        {makes.map((make) => {
          return (
            <MakeCard
              key={make}
              make={make}
              logoUrl={logoUrlMap[slugify(make)]}
            />
          );
        })}
      </div>
    </section>
  );
};
