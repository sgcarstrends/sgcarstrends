import type { ReactNode } from "react";
import { FEATURE_FLAG_UNRELEASED } from "@/config";

export const UnreleasedFeature = ({ children }: { children: ReactNode }) =>
  FEATURE_FLAG_UNRELEASED && (
    <div className="border border-dashed border-red-500 p-1">{children}</div>
  );
