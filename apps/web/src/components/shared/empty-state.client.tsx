"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";
import { Home, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

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
}
