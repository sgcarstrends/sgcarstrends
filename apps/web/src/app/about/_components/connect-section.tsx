"use client";

import { Button } from "@heroui/button";
import { navLinks } from "@web/config/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { staggerContainerVariants, staggerItemVariants } from "./variants";

export const ConnectSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 lg:py-28">
      <motion.div
        className="flex flex-col items-center gap-12 text-center"
        variants={shouldReduceMotion ? undefined : staggerContainerVariants}
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Header */}
        <motion.div
          className="flex max-w-xl flex-col gap-4"
          variants={shouldReduceMotion ? undefined : staggerItemVariants}
        >
          <span className="font-medium text-primary text-sm uppercase tracking-widest">
            Stay Connected
          </span>
          <h2 className="font-semibold text-3xl text-foreground tracking-tight lg:text-4xl">
            Join our growing community
          </h2>
          <p className="text-default-600 text-lg leading-relaxed">
            Follow us on social media for the latest updates, insights, and
            discussions about Singapore&apos;s car market.
          </p>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          variants={shouldReduceMotion ? undefined : staggerItemVariants}
        >
          {navLinks.socialMedia.map(({ title, url, icon: Icon }) => (
            <Button
              key={title}
              as="a"
              href={url}
              rel="me noreferrer"
              target="_blank"
              variant="bordered"
              className="gap-2 rounded-full border-default-300 px-5 transition-all hover:border-primary hover:bg-primary/5"
              aria-label={title}
            >
              <Icon className="size-4" />
              <span>{title}</span>
            </Button>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center gap-4 border-default-200 border-t pt-12 sm:flex-row sm:gap-6"
          variants={shouldReduceMotion ? undefined : staggerItemVariants}
        >
          <Button
            as={Link}
            href="/"
            color="primary"
            size="lg"
            className="gap-2 rounded-full px-8"
          >
            Explore the Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            as={Link}
            href="/blog"
            variant="light"
            size="lg"
            className="gap-2 rounded-full px-8"
          >
            Read Market Insights
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
