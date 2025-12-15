import { slugify } from "@sgcarstrends/utils";
import type { Make } from "@web/types";
import { MakeCard } from "./make-card";

interface MakeGridProps {
  makes: Make[];
  logoUrlMap?: Record<string, string>;
}

export function MakeGrid({ makes, logoUrlMap = {} }: MakeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
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
  );
}
