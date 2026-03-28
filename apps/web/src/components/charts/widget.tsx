"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { CHART_HEIGHTS, type ChartHeight } from "@sgcarstrends/theme/charts";
import { CARD_VARIANTS, type CardVariant } from "@sgcarstrends/theme/spacing";
import { cn } from "@sgcarstrends/ui/lib/utils";
import Typography from "@web/components/typography";
import { fadeInUpVariants } from "@web/config/animations";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface ChartWidgetProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  /** Card styling variant */
  variant?: CardVariant;
  /** Chart height preset (only affects empty state) */
  height?: ChartHeight;
  /** Additional className for the card */
  className?: string;
}

export function ChartWidget({
  title,
  subtitle,
  children,
  isEmpty = false,
  emptyMessage = "No data available",
  variant = "default",
  height = "standard",
  className,
}: ChartWidgetProps) {
  const prefersReducedMotion = useReducedMotion();

  const cardContent = (
    <Card className={cn(CARD_VARIANTS[variant], "p-3", className)}>
      <CardHeader>
        <div className="flex flex-col gap-1">
          <Typography.H4>{title}</Typography.H4>
          {subtitle && (
            <Typography.TextSm className="text-default-500">
              {subtitle}
            </Typography.TextSm>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {isEmpty ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-xl bg-default-100",
              CHART_HEIGHTS[height],
            )}
          >
            <Typography.TextSm className="text-default-500">
              {emptyMessage}
            </Typography.TextSm>
          </div>
        ) : (
          children
        )}
      </CardBody>
    </Card>
  );

  // Respect reduced motion preference
  if (prefersReducedMotion) {
    return cardContent;
  }

  return (
    <motion.div variants={fadeInUpVariants} initial="hidden" animate="visible">
      {cardContent}
    </motion.div>
  );
}
