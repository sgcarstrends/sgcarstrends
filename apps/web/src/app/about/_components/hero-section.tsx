"use client";

import { Chip } from "@heroui/chip";
import { motion, useReducedMotion } from "framer-motion";

export const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();

  // Staggered delays for hero entrance elements
  const entranceTransition = (delay: number) =>
    shouldReduceMotion
      ? undefined
      : {
          duration: 1,
          delay,
          ease: [0.16, 1, 0.3, 1] as const,
        };

  return (
    <section className="py-32 lg:py-40">
      <div className="container mx-auto">
        <div className="flex max-w-4xl flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          {/* Decorative line */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent lg:hidden"
            initial={shouldReduceMotion ? undefined : { width: 0, opacity: 0 }}
            animate={{ width: "6rem", opacity: 1 }}
            transition={entranceTransition(0)}
          />

          {/* Eyebrow chip */}
          <motion.div
            initial={
              shouldReduceMotion
                ? undefined
                : { opacity: 0, y: 24, scale: 0.95 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={entranceTransition(0.1)}
          >
            <Chip
              color="primary"
              variant="dot"
              classNames={{
                base: "border-primary/20 bg-primary/5 backdrop-blur-sm",
                content: "font-medium text-foreground/90 tracking-wide text-sm",
                dot: "bg-primary",
              }}
            >
              Singapore Car Market Data
            </Chip>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="font-bold text-5xl text-foreground tracking-tighter lg:text-7xl"
            initial={
              shouldReduceMotion
                ? undefined
                : { opacity: 0, y: 32, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={entranceTransition(0.15)}
          >
            Making Sense of{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Singapore&apos;s Car Market
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="max-w-2xl text-foreground/70 text-lg leading-relaxed lg:text-xl lg:leading-relaxed"
            initial={
              shouldReduceMotion
                ? undefined
                : { opacity: 0, y: 32, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={entranceTransition(0.3)}
          >
            Vehicle registration data and COE bidding results, presented in a
            way that&apos;s easier to understand. No spreadsheets required.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
