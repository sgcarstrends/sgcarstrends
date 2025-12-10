"use client";

import { cn } from "@heroui/theme";
import { useEffect, useRef, useState } from "react";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

const AnimatedNumber = ({
  value,
  suffix = "",
  isVisible,
}: {
  value: number;
  suffix?: string;
  isVisible: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span className="tabular-nums">
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatItem = ({ value, suffix, label, delay = 0 }: StatItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "group relative flex flex-col gap-2 rounded-2xl border border-default-200/50 bg-background/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      )}
    >
      <div className="font-semibold text-4xl text-foreground tracking-tight lg:text-5xl">
        <AnimatedNumber value={value} suffix={suffix} isVisible={isVisible} />
      </div>
      <div className="text-default-600 text-sm">{label}</div>
      {/* Subtle accent line */}
      <div className="absolute right-6 bottom-0 left-6 h-0.5 scale-x-0 bg-gradient-to-r from-primary to-primary/60 transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
};

export const StatsSection = () => {
  const stats = [
    { value: 5, suffix: "+", label: "Years of historical data" },
    { value: 50, suffix: "+", label: "Car makes tracked" },
    { value: 120, suffix: "+", label: "COE bidding rounds analysed" },
    { value: 10000, suffix: "+", label: "Monthly data points" },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="flex flex-col gap-12">
        {/* Section header */}
        <div className="flex flex-col gap-4">
          <span className="font-medium text-primary text-sm uppercase tracking-widest">
            By the Numbers
          </span>
          <h2 className="max-w-lg font-semibold text-3xl text-foreground tracking-tight lg:text-4xl">
            Comprehensive coverage of Singapore&apos;s automotive landscape
          </h2>
        </div>

        {/* Stats grid - asymmetric */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
