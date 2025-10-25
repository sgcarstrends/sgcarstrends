"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { AnimatedNumber } from "@web/components/animated-number";
import type { Pqp } from "@web/types/coe";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface Props {
  data: Pqp.Comparison[];
}

export const ComparisonSummaryCard = ({ data }: Props) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {data.map((item, index) => {
        const isPQPLower = item.differencePercent > 0;
        const isPQPHigher = item.differencePercent < 0;

        return (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.4,
              delay: shouldReduceMotion ? 0 : index * 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Card className="p-4">
              <CardHeader>
                <div className="font-bold text-lg">{item.category}</div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-default-500 text-sm">
                      Latest Premium
                    </div>
                    <div className="font-bold text-2xl text-primary">
                      $<AnimatedNumber value={item.latestPremium} />
                    </div>
                  </div>
                  <div>
                    <div className="text-default-500 text-sm">PQP Rate</div>
                    <div className="font-bold text-2xl">
                      $<AnimatedNumber value={item.pqpRate} />
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex items-center gap-2">
                  <Chip
                    variant="flat"
                    color={
                      isPQPLower
                        ? "success"
                        : isPQPHigher
                          ? "danger"
                          : "default"
                    }
                    startContent={
                      isPQPLower ? (
                        <ArrowDownRight className="size-4" />
                      ) : isPQPHigher ? (
                        <ArrowUpRight className="size-4" />
                      ) : null
                    }
                  >
                    <AnimatedNumber value={Math.abs(item.differencePercent)} />%
                  </Chip>
                  <span className="text-muted-foreground text-sm">
                    PQP{" "}
                    {isPQPLower ? "below" : isPQPHigher ? "above" : "equals"}{" "}
                    premium
                  </span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
