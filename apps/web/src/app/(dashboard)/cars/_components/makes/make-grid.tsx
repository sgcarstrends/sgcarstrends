import type { Make } from "@web/types";
import { MakeCard } from "./make-card";

interface MakeGridProps {
  makes: Make[];
  isPopular?: boolean;
}

export const MakeGrid = ({ makes, isPopular = false }: MakeGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-8">
      {makes.map((make) => (
        <MakeCard key={make} make={make} isPopular={isPopular} />
      ))}
    </div>
  );
};
