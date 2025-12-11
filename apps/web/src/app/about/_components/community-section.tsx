"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import Typography from "@web/components/typography";
import { navLinks } from "@web/config/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Code2, Heart } from "lucide-react";
import NextLink from "next/link";
import { staggerContainerVariants, staggerItemVariants } from "./variants";

export const CommunitySection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="-mx-6 relative overflow-hidden bg-foreground px-6 py-20 lg:py-28">
      {/* Subtle gradient accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="-right-1/4 absolute top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto">
        <motion.div
          className="flex flex-col items-center gap-16"
          variants={shouldReduceMotion ? undefined : staggerContainerVariants}
          initial={shouldReduceMotion ? undefined : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Creator info */}
          <motion.div
            className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center"
            variants={shouldReduceMotion ? undefined : staggerItemVariants}
          >
            <Chip
              variant="light"
              startContent={<Code2 className="h-4 w-4" />}
              classNames={{
                base: "bg-transparent",
                content:
                  "font-medium text-primary text-sm uppercase tracking-widest",
              }}
            >
              Behind the Data
            </Chip>

            <div className="flex flex-col gap-4">
              <Typography.H2 className="text-primary-foreground">
                Built with{" "}
                <Heart className="mb-1 inline h-7 w-7 fill-red-500 text-red-500" />{" "}
                in Singapore
              </Typography.H2>
              <Typography.TextLg className="text-primary-foreground/70">
                SG Cars Trends is an independent project created by{" "}
                <Link
                  href="https://ruchern.dev"
                  isExternal
                  className="font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Ru Chern
                </Link>
                , a software engineer who wanted to make this data easier to
                explore.
              </Typography.TextLg>
            </div>

            <Typography.TextSm className="max-w-lg text-primary-foreground/50">
              This platform is maintained in spare time alongside a full-time
              job. If you find it useful, consider sharing it with others who
              might benefit.
            </Typography.TextSm>
          </motion.div>

          {/* Social connections */}
          <motion.div
            className="flex flex-col items-center gap-8 border-primary-foreground/10 border-t pt-12"
            variants={shouldReduceMotion ? undefined : staggerItemVariants}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <Typography.Label className="text-primary uppercase tracking-widest">
                Stay Updated
              </Typography.Label>
              <Typography.H2 className="text-primary-foreground">
                Follow for the Latest Updates
              </Typography.H2>
              <Typography.TextLg className="max-w-xl text-primary-foreground/70">
                Get notified when new COE results, car registration data, and
                market insights are published.
              </Typography.TextLg>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {navLinks.socialMedia.map(({ title, url, icon: Icon }) => (
                <Button
                  key={title}
                  as="a"
                  href={url}
                  rel="me noreferrer"
                  target="_blank"
                  variant="bordered"
                  className="gap-2 rounded-full border-primary-foreground/20 px-5 text-primary-foreground transition-all hover:border-primary hover:bg-primary/5"
                  aria-label={title}
                >
                  <Icon className="size-4" />
                  <span>{title}</span>
                </Button>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:gap-6">
              <Button
                as={NextLink}
                href="/"
                color="primary"
                size="lg"
                className="gap-2 rounded-full px-8"
              >
                Explore the Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                as={NextLink}
                href="/blog"
                variant="light"
                size="lg"
                className="gap-2 rounded-full px-8 text-primary-foreground"
              >
                Read Market Insights
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
