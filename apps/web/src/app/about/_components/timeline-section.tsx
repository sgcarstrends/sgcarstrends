"use client";

import { Avatar } from "@heroui/avatar";
import { cn } from "@heroui/theme";
import { useEffect, useRef, useState } from "react";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  highlight?: boolean;
}

const timelineData: TimelineItem[] = [
  {
    date: "2020",
    title: "Project Inception",
    description:
      "Started as a personal project to track COE prices and car registration trends.",
  },
  {
    date: "2021",
    title: "Public Launch",
    description:
      "Launched sgcarstrends.com with comprehensive COE and registration data.",
  },
  {
    date: "2023",
    title: "API & Blog Features",
    description:
      "Introduced public API access and AI-powered market analysis blog posts.",
    highlight: true,
  },
  {
    date: "2024",
    title: "Enhanced Analytics",
    description:
      "Added advanced visualisations, fuel type breakdowns, and deregistration tracking.",
  },
  {
    date: "2025",
    title: "Continued Growth",
    description:
      "Expanding coverage and building new features based on community feedback.",
    highlight: true,
  },
];

const TimelineItemComponent = ({
  item,
  index,
  isVisible,
}: {
  item: TimelineItem;
  index: number;
  isVisible: boolean;
}) => {
  return (
    <div
      className={cn(
        "group relative flex gap-6 transition-all duration-500 lg:gap-8",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Timeline line and dot */}
      <div className="relative flex flex-col items-center">
        <Avatar
          name={item.date}
          classNames={{
            base: cn(
              "relative z-10 h-12 w-12 border-2 bg-background transition-colors",
              item.highlight
                ? "border-primary text-primary"
                : "border-default-300 text-default-600 group-hover:border-primary/50",
            ),
            name: "font-medium text-sm",
          }}
          showFallback
          getInitials={() => item.date}
        />
        {index < timelineData.length - 1 && (
          <div className="absolute top-12 h-full w-0.5 bg-gradient-to-b from-default-300 to-default-200" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 pb-12">
        <h3
          className={cn(
            "font-semibold text-lg",
            item.highlight ? "text-primary" : "text-foreground",
          )}
        >
          {item.title}
        </h3>
        <p className="max-w-md text-default-600 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export const TimelineSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Header */}
        <div className="lg:col-span-4">
          <div
            className={cn(
              "sticky top-24 flex flex-col gap-4 transition-all duration-700",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            <span className="font-medium text-primary text-sm uppercase tracking-widest">
              Our Journey
            </span>
            <h2 className="font-semibold text-3xl text-foreground tracking-tight lg:text-4xl">
              From side project to Singapore&apos;s car data platform
            </h2>
            <p className="text-default-600 leading-relaxed">
              What started as a personal tool to track COE prices has grown into
              a comprehensive platform serving thousands of users monthly.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-8">
          <div className="flex flex-col">
            {timelineData.map((item, index) => (
              <TimelineItemComponent
                key={item.date}
                item={item}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
