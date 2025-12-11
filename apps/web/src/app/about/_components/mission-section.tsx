"use client";

import { Card, CardBody } from "@heroui/card";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUpVariants } from "./variants";

export const MissionSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left column - Pull quote */}
        <div className="lg:col-span-5">
          <motion.div
            className="sticky top-24"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <blockquote className="relative">
              <div className="-left-4 lg:-left-8 absolute top-0 font-serif text-8xl text-primary/20">
                &ldquo;
              </div>
              <p className="relative font-medium text-2xl text-foreground leading-relaxed lg:text-3xl">
                Car buying in Singapore shouldn&apos;t feel like navigating a
                maze blindfolded.
              </p>
            </blockquote>
          </motion.div>
        </div>

        {/* Right column - Mission text */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          <motion.div
            className="flex flex-col gap-6"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <h2 className="font-semibold text-3xl text-foreground tracking-tight lg:text-4xl">
              Our Mission
            </h2>
            <div className="flex flex-col gap-4 text-default-600 text-lg leading-relaxed">
              <p>
                Singapore&apos;s car market is uniquely complex. Between COE
                premiums that swing wildly, registration quotas that change
                monthly, and a maze of vehicle categories, making informed
                decisions feels nearly impossible.
              </p>
              <p>
                We built SG Cars Trends to change that. By aggregating official
                data from the Land Transport Authority and presenting it through
                intuitive visualisations, we&apos;re democratising access to
                market intelligence that was previously scattered across
                government portals and industry reports.
              </p>
              <p>
                Whether you&apos;re a first-time buyer trying to time your
                purchase, a dealer analysing market trends, or simply curious
                about Singapore&apos;s automotive landscape—we&apos;ve got you
                covered.
              </p>
            </div>
          </motion.div>

          {/* Key points */}
          <motion.div
            className="grid gap-6 border-default-200 border-t pt-8 sm:grid-cols-2"
            variants={shouldReduceMotion ? undefined : fadeInUpVariants}
            initial={shouldReduceMotion ? undefined : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={shouldReduceMotion ? undefined : { delay: 0.2 }}
          >
            <Card className="border-none bg-transparent shadow-none">
              <CardBody className="flex flex-col gap-2 p-0">
                <div className="font-semibold text-foreground">
                  Data-Driven Decisions
                </div>
                <p className="text-default-600 text-sm leading-relaxed">
                  Move beyond gut feelings with historical trends and real-time
                  insights.
                </p>
              </CardBody>
            </Card>
            <Card className="border-none bg-transparent shadow-none">
              <CardBody className="flex flex-col gap-2 p-0">
                <div className="font-semibold text-foreground">
                  Always Up-to-Date
                </div>
                <p className="text-default-600 text-sm leading-relaxed">
                  Fresh data after every COE bidding round and monthly
                  registration release.
                </p>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
