import type { Make } from "@web/types";
import { MakeCard } from "./make-card";

interface MakesSearchResultsProps {
  makes: Make[];
  popular: Make[];
  searchTerm: string;
  onMakeClick?: (make: Make) => void;
}

export const MakesSearchResults = ({
  makes,
  popular,
  onMakeClick,
}: MakesSearchResultsProps) => {
  if (makes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {makes.map((make) => {
          const isPopular = popular.includes(make);
          return (
            <MakeCard
              key={make}
              make={make}
              isPopular={isPopular}
              onMakePress={onMakeClick}
            />
          );
        })}
      </div>
    </section>
  );
};
