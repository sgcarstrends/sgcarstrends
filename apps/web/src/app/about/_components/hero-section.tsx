"use client";

import { Chip } from "@heroui/chip";
import { cn } from "@heroui/theme";
import { useEffect, useRef, useState } from "react";

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="-mx-6 -mt-8 relative overflow-hidden bg-gradient-to-br from-foreground via-foreground/95 to-foreground px-6 py-24 lg:py-32"
    >
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="-left-1/4 -top-1/4 absolute h-[600px] w-[600px] animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="-bottom-1/4 -right-1/4 absolute h-[500px] w-[500px] animate-pulse rounded-full bg-primary/20 blur-3xl [animation-delay:1s]" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[400px] w-[400px] animate-pulse rounded-full bg-primary/5 blur-3xl [animation-delay:2s]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container relative mx-auto">
        <div className="flex max-w-4xl flex-col gap-8">
          {/* Eyebrow */}
          <div
            className={cn(
              "transition-all duration-700",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            <Chip
              color="primary"
              variant="dot"
              classNames={{
                base: "border-primary/30 bg-primary/10",
                content: "font-medium text-primary-foreground/80",
                dot: "bg-primary",
              }}
            >
              Singapore&apos;s Car Market Intelligence
            </Chip>
          </div>

          {/* Main headline */}
          <h1
            className={cn(
              "font-semibold text-5xl text-primary-foreground tracking-tight transition-all duration-700 [animation-delay:100ms] lg:text-7xl",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: "100ms" }}
          >
            Making Sense of{" "}
            <span className="bg-gradient-to-r from-primary/70 via-primary to-primary/70 bg-clip-text text-transparent">
              Singapore&apos;s Car Market
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              "max-w-2xl text-lg text-primary-foreground/70 leading-relaxed transition-all duration-700 lg:text-xl",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: "200ms" }}
          >
            We transform complex vehicle registration data and COE bidding
            results into clear, actionable insights. Because understanding the
            market shouldn&apos;t require a spreadsheet.
          </p>
        </div>
      </div>
    </section>
  );
};
