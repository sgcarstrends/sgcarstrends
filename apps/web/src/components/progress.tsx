import type { PropsWithChildren } from "react";
import { cn } from "@web/lib/utils";

interface ProgressProps extends PropsWithChildren {
  value: number;
}

export const Progress = ({ value, children }: ProgressProps) => {
  return (
    <div className="h-6 w-full rounded-full bg-gray-400">
      <div
        className={cn(
          "bg-primary text-primary-foreground flex h-6 items-center rounded-full p-2 text-center",
        )}
        style={{ width: `${value * 100}%` }}
      >
        {children}
      </div>
    </div>
  );
};
