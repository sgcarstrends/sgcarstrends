"use client";

import { Button, Link } from "@heroui/react";
import { fadeInUpVariants } from "@web/config/animations";
import { Home, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedEmptyStateWrapperProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedEmptyStateWrapper({
  children,
  className,
}: AnimatedEmptyStateWrapperProps) {
  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col items-center justify-center gap-6 rounded-3xl bg-default-50/50 px-8 py-12 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

export function DefaultActions() {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-default-300 bg-default-100 px-4 py-2 font-medium text-foreground text-sm"
      >
        <Home className="size-4" />
        Go Home
      </Link>
      <Button
        className="rounded-full"
        variant="secondary"
        onPress={() => history.back()}
      >
        <RotateCcw className="size-4" />
        Go Back
      </Button>
    </div>
  );
}
