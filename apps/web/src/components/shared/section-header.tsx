import Typography from "@web/components/typography";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  selector?: ReactNode;
  lastUpdated?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Section header component combining title, selector, and metadata
 *
 * Provides consistent layout for section headings across the app with
 * optional selector control and last updated timestamp.
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Car Makes"
 *   selector={<MakeSelector />}
 *   lastUpdated="2024-01-15"
 * />
 * ```
 */
export const SectionHeader = ({
  title,
  selector,
  lastUpdated,
  children,
  className = "",
}: SectionHeaderProps) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`.trim()}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Typography.H2>{title}</Typography.H2>
          {lastUpdated && (
            <Typography.TextSm className="text-default-600">
              Last updated: {lastUpdated}
            </Typography.TextSm>
          )}
        </div>
        {selector && <div>{selector}</div>}
      </div>
      {children}
    </div>
  );
};
