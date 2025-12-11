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
    <section
      className="-mx-6 -mt-8 relative overflow-hidden px-6 py-32 lg:py-40"
      style={{
        background:
          "linear-gradient(135deg, hsl(222.2 84% 4.9%) 0%, hsl(222.2 84% 8%) 50%, hsl(222.2 84% 4.9%) 100%)",
        backgroundSize: "200% 200%",
        animation: shouldReduceMotion
          ? undefined
          : "gradient-flow 15s ease infinite",
      }}
    >
      {/* Animated gradient orbs - smoother, slower animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="-left-1/4 -top-1/4 absolute h-[700px] w-[700px] rounded-full bg-primary/8 blur-[120px]"
          style={{
            animation: shouldReduceMotion
              ? undefined
              : "float-gentle 20s ease-in-out infinite",
          }}
        />
        <div
          className="-bottom-1/4 -right-1/4 absolute h-[600px] w-[600px] rounded-full bg-primary/12 blur-[100px]"
          style={{
            animation: shouldReduceMotion
              ? undefined
              : "float-gentle 25s ease-in-out infinite reverse",
          }}
        />
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[80px]"
          style={{
            animation: shouldReduceMotion
              ? undefined
              : "pulse-soft 10s ease-in-out infinite",
          }}
        />

        {/* Noise texture overlay */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        {/* Refined grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative mx-auto">
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
                base: "border-primary/20 bg-primary/5 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.15)]",
                content:
                  "font-medium text-primary-foreground/90 tracking-wide text-sm",
                dot: "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]",
              }}
            >
              Singapore Car Market Data
            </Chip>
          </motion.div>

          {/* Main headline with glow effect */}
          <div className="relative">
            {/* Glow behind text */}
            <motion.div
              className="absolute inset-0 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)",
              }}
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={entranceTransition(0.2)}
            />
            <motion.h1
              className="relative font-bold text-5xl text-primary-foreground tracking-tighter lg:text-7xl"
              style={{
                textShadow: "0 4px 30px rgba(0,0,0,0.3)",
              }}
              initial={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, y: 32, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={entranceTransition(0.15)}
            >
              Making Sense of{" "}
              <span
                className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                style={{
                  filter: "drop-shadow(0 0 30px rgba(59,130,246,0.3))",
                }}
              >
                Singapore&apos;s Car Market
              </span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            className="max-w-2xl text-lg text-primary-foreground/60 leading-relaxed lg:text-xl lg:leading-relaxed"
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
