"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { cn } from "@heroui/theme";
import Typography from "@web/components/typography";
import {
  CARD_VARIANTS,
  type CardVariant,
  CHART_HEIGHTS,
  type ChartHeight,
} from "@web/config/design-system";
import { motion, useReducedMotion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {cardContent}
    </motion.div>
  );
}
