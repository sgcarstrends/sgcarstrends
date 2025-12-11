"use client";

import { Avatar } from "@heroui/avatar";
import { cn } from "@heroui/theme";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUpVariants } from "./variants";

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

interface TimelineItemComponentProps {
  item: TimelineItem;
  index: number;
}

const TimelineItemComponent = ({ item, index }: TimelineItemComponentProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative flex gap-6 lg:gap-8"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration: 0.5,
              delay: index * 0.15,
              ease: [0.4, 0, 0.2, 1],
            }
      }
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
    </motion.div>
  );
};

export const TimelineSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Header */}
        <div className="lg:col-span-4">
          <motion.div
            className="sticky top-24 flex flex-col gap-4"
            variants={shouldReduceMotion ? undefined : fadeInUpVariants}
            initial={shouldReduceMotion ? undefined : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
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
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-8">
          <div className="flex flex-col">
            {timelineData.map((item, index) => (
              <TimelineItemComponent
                key={item.date}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
