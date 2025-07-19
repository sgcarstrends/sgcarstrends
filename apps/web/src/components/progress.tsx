import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends PropsWithChildren {
  value: number;
}

export const Progress = ({ value, children }: ProgressProps) => {
  return (
    <div className="h-6 w-full rounded-full bg-gray-400">
      <div
        className={cn(
          "flex h-6 items-center rounded-full bg-primary p-2 text-center text-primary-foreground",
        )}
        style={{ width: `${value * 100}%` }}
      >
        {children}
      </div>
    </div>
  );
};
