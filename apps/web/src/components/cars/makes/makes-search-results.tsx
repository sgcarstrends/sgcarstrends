import type { Make } from "@web/types";
import { MakeCard } from "./make-card";

interface MakesSearchResultsProps {
  makes: Make[];
  searchTerm: string;
}

export const MakesSearchResults = ({ makes }: MakesSearchResultsProps) => {
  if (makes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
        {makes.map((make) => {
          return <MakeCard key={make} make={make} />;
        })}
      </div>
    </section>
  );
};
