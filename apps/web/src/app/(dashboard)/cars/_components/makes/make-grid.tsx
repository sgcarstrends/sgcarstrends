import { slugify } from "@sgcarstrends/utils";
import type { Make } from "@web/types";
import { MakeCard } from "./make-card";

interface MakeGridProps {
  makes: Make[];
  isPopular?: boolean;
  logoUrlMap?: Record<string, string>;
}

export function MakeGrid({
  makes,
  isPopular = false,
  logoUrlMap = {},
}: MakeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {makes.map((make) => {
        return (
          <MakeCard
            key={make}
            make={make}
            isPopular={isPopular}
            logoUrl={logoUrlMap[slugify(make)]}
          />
        );
      })}
    </div>
  );
}
