import { Chip } from "@heroui/chip";
import Typography from "@web/components/typography";
import type { Make } from "@web/types";
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
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Typography.H2>Popular Makes</Typography.H2>
        <Chip size="sm" variant="shadow" color="primary">
          {makes.length}
        </Chip>
      </div>
      <MakeGrid makes={makes} isPopular logoUrlMap={logoUrlMap} />
    </section>
  );
}
