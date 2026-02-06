import { LastUpdated } from "@web/components/shared/last-updated";
import type { ReactNode } from "react";

interface DashboardPageMetaProps {
  children?: ReactNode;
  lastUpdated?: number | null;
}

export function DashboardPageMeta({
  children,
  lastUpdated,
}: DashboardPageMetaProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      {lastUpdated ? <LastUpdated lastUpdated={lastUpdated} /> : null}
      {children}
    </div>
  );
}
