"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import Typography from "@web/components/typography";
import { motion } from "framer-motion";
import { FileQuestion, Home, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  showDefaultActions?: boolean;
  className?: string;
}

export function EmptyState({
  icon,
  title = "No Data Available",
  description = "The requested data could not be found. Please try a different selection.",
  actions,
  showDefaultActions = true,
  className,
}: EmptyStateProps) {
  const defaultIcon = (
    <div className="flex size-16 items-center justify-center rounded-2xl bg-default-100">
      <FileQuestion className="size-8 text-default-400" />
    </div>
  );

  const defaultActions = (
    <div className="flex items-center gap-4">
      <Button
        as={Link}
        href="/"
        className="rounded-full"
        variant="bordered"
        startContent={<Home className="size-4" />}
      >
        Go Home
      </Button>
      <Button
        className="rounded-full"
        variant="bordered"
        onPress={() => history.back()}
        startContent={<RotateCcw className="size-4" />}
      >
        Go Back
      </Button>
    </div>
  );

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col items-center justify-center gap-6 rounded-3xl bg-default-50/50 px-8 py-12 ${className ?? ""}`}
    >
      {icon ?? defaultIcon}

      <div className="flex flex-col items-center gap-2 text-center">
        <Typography.H3>{title}</Typography.H3>
        <Typography.TextSm className="max-w-sm text-default-500">
          {description}
        </Typography.TextSm>
      </div>

      {actions ?? (showDefaultActions && defaultActions)}
    </motion.div>
  );
}
