"use client";

import { Card, CardBody } from "@heroui/card";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle, Database, RefreshCw, Shield } from "lucide-react";
import Link from "next/link";
import {
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "./variants";

const features = [
  {
    icon: Database,
    title: "Official Government Source",
    description:
      "All data is sourced directly from the Land Transport Authority (LTA) DataMall, Singapore's official open data portal for transport statistics.",
  },
  {
    icon: RefreshCw,
    title: "Monthly Updates",
    description:
      "Registration data is updated within days of each LTA release. COE results are refreshed after every bidding round—twice monthly.",
  },
  {
    icon: Shield,
    title: "Data Integrity",
    description:
      "We maintain strict data validation processes to ensure accuracy. Historical records are preserved without modification.",
  },
  {
    icon: CheckCircle,
    title: "API Access",
    description:
      "Developers and researchers can access our data programmatically through our RESTful API for custom analysis and integrations.",
  },
];

export const DataSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="-mx-6 relative overflow-hidden bg-secondary px-6 py-20 lg:py-28">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative mx-auto">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left column - Header */}
          <div className="lg:col-span-4">
            <motion.div
              className="sticky top-24 flex flex-col gap-6"
              variants={shouldReduceMotion ? undefined : fadeInUpVariants}
              initial={shouldReduceMotion ? undefined : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="font-medium text-primary text-sm uppercase tracking-widest">
                Data Transparency
              </span>
              <h2 className="font-semibold text-3xl text-foreground tracking-tight lg:text-4xl">
                Built on trust and accuracy
              </h2>
              <p className="text-default-600 leading-relaxed">
                We believe in complete transparency about where our data comes
                from and how it&apos;s processed.
              </p>

              {/* LTA Badge */}
              <Card className="border-default-200">
                <CardBody className="flex flex-row items-center gap-3 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                    <Database className="h-6 w-6 text-default-600" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      Data Provider
                    </div>
                    <Link
                      href="https://datamall.lta.gov.sg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline"
                    >
                      LTA DataMall
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Right column - Features grid */}
          <div className="lg:col-span-8">
            <motion.div
              className="grid gap-6 sm:grid-cols-2"
              variants={
                shouldReduceMotion ? undefined : staggerContainerVariants
              }
              initial={shouldReduceMotion ? undefined : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={
                    shouldReduceMotion ? undefined : staggerItemVariants
                  }
                >
                  <Card className="group h-full border-default-200/80 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardBody className="flex flex-col gap-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-primary/5">
                        <feature.icon className="h-6 w-6 text-default-600 transition-colors group-hover:text-primary" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-default-600 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
