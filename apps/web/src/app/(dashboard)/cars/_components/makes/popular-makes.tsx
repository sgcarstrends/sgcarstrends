import type { Make } from "@web/types";
import { Flame } from "lucide-react";
import { MakeGrid } from "./make-grid";

interface PopularMakesProps {
  makes: Make[];
  logoUrlMap?: Record<string, string>;
}

export function PopularMakes({ makes, logoUrlMap = {} }: PopularMakesProps) {
  if (makes.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
            <Flame className="size-4 text-white" />
          </div>
          <h2 className="font-semibold text-foreground text-lg">
            Popular Makes
          </h2>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-medium text-amber-600 text-xs">
          Top {makes.length}
        </span>
      </div>
      <MakeGrid makes={makes} logoUrlMap={logoUrlMap} />
    </section>
  );
}
