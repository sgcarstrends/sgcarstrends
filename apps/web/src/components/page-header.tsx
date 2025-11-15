import { cn } from "@sgcarstrends/ui/lib/utils";
import { LastUpdated } from "@web/components/shared/last-updated";
import { MonthSelector } from "@web/components/shared/month-selector";
import Typography from "@web/components/typography";
import type { Month } from "@web/types";
import { type ReactNode, Suspense } from "react";

interface Props {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  lastUpdated?: number | null;
  months?: Month[];
  showMonthSelector?: boolean;
}

export const PageHeader = ({
  title,
  subtitle,
  children,
  className,
  lastUpdated,
  months,
  showMonthSelector = false,
}: Props) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex flex-col">
          <Typography.H1>{title}</Typography.H1>
          {subtitle && <Typography.Lead>{subtitle}</Typography.Lead>}
        </div>
        <div className="flex flex-col items-start gap-2">
          {lastUpdated && <LastUpdated lastUpdated={lastUpdated} />}
          {showMonthSelector && months && (
            <Suspense fallback={null}>
              <MonthSelector months={months} />
            </Suspense>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
