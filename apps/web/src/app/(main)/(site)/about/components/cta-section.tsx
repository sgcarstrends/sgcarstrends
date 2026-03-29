"use client";

import { Button } from "@heroui/react";
import Typography from "@web/components/typography";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@web/config/animations";
import { navLinks } from "@web/config/navigation";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto">
        <motion.div
          className="flex flex-col items-center gap-10"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <motion.div
            className="flex flex-col items-center gap-4 text-center"
            variants={staggerItemVariants}
          >
            <Typography.Label className="text-primary uppercase tracking-widest">
              Stay Updated
            </Typography.Label>
            <Typography.H2>Follow for the Latest Updates</Typography.H2>
            <Typography.TextLg className="max-w-xl text-default-600">
              Get notified when new COE results, car registration data, and
              market insights are published.
            </Typography.TextLg>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            variants={staggerItemVariants}
          >
            {navLinks.socialMedia.map(({ title, url, icon: Icon }) => (
              <Link
                key={title}
                href={url}
                rel="me noreferrer"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-default-300 bg-transparent px-5 py-2 text-foreground transition-all hover:border-primary hover:bg-primary/5"
              >
                <Icon className="size-4" />
                <span>{title}</span>
              </Link>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:gap-6"
            variants={staggerItemVariants}
          >
            <Link href="/">
              <Button size="lg" className="gap-2 px-8">
                Explore the Dashboard
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 px-8 text-foreground"
              >
                Read Market Insights
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
