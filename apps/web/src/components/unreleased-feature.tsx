import { FEATURE_FLAG_UNRELEASED } from "@web/config";
import type { ReactNode } from "react";

export const UnreleasedFeature = ({ children }: { children: ReactNode }) => {
  return (
    FEATURE_FLAG_UNRELEASED && (
      <div className="outline-dashed outline-2 outline-red-500">{children}</div>
    )
  );
};
