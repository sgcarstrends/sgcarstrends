import slugify from "@sindresorhus/slugify";
import type { Make } from "@web/types";
import { MakeCard } from "./make-card";

interface MakeGridProps {
  makes: Make[];
  isPopular?: boolean;
  logoUrlMap?: Record<string, string>;
}

export const MakeGrid = ({
  makes,
  isPopular = false,
  logoUrlMap = {},
}: MakeGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-8">
      {makes.map((make) => (
        <MakeCard
          key={make}
          make={make}
          isPopular={isPopular}
          logoUrl={logoUrlMap[slugify(make)]}
        />
      ))}
    </div>
  );
};
