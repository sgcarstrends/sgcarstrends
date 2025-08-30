"use client";

import { Chip } from "@heroui/chip";
import useStore from "@web/app/store";
import type { COEResult } from "@web/types";

interface Props {
  data: COEResult[];
}

export const QuotaPremiumTicker = ({ data = [] }: Props) => {
  const setBannerContent = useStore(({ setBannerContent }) => setBannerContent);

  setBannerContent(
    <div className="flex items-center justify-center gap-4">
      {data.toSorted(sortByCategory).map(({ vehicle_class, premium }) => (
        <div key={vehicle_class} className="flex items-center gap-2">
          <span className="font-semibold text-small">{vehicle_class}</span>
          <Chip color="primary" variant="bordered">
            ${premium.toLocaleString()}
          </Chip>
        </div>
      ))}
    </div>,
  );

  return null;
};

// TODO: Move this to a common directory
const sortByCategory = (a: COEResult, b: COEResult) =>
  a.vehicle_class.localeCompare(b.vehicle_class);
