"use client";

import { Card, CardBody, Chip, Divider, Link } from "@heroui/react";
import { motion, type Variants } from "framer-motion";
import {
  Clock,
  Mail,
  MessageCircle,
  Settings,
  Shield,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import useMaintenance from "@/hooks/use-maintenance";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

const cardGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const spinVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 10,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

export const MaintenanceNotice = () => {
  useMaintenance();

  return (
    <motion.div
      className="mx-auto max-w-4xl space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      {/* Hero Section */}
      <motion.div
        className="flex flex-col items-center space-y-4 text-center"
        variants={itemVariants}
      >
        <motion.div className="mb-4" variants={iconVariants} animate="animate">
          <motion.div variants={spinVariants} animate="animate">
            <Settings className="text-primary size-20" />
          </motion.div>
        </motion.div>
        <motion.h1
          className="text-foreground text-4xl font-bold"
          variants={textVariants}
        >
          🚗 Pit Stop in Progress
        </motion.h1>
        <motion.p
          className="text-foreground-600 max-w-lg text-lg"
          variants={textVariants}
        >
          Just like a Formula 1 pit stop, we&apos;re fine-tuning our engines to
          deliver the fastest and most reliable Singapore car market insights!
        </motion.p>
      </motion.div>

      {/* Status Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardBody>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-primary size-5" />
                  <span className="text-foreground font-semibold">
                    Estimated Completion
                  </span>
                </div>
                <Chip variant="shadow" color="primary" size="lg">
                  2 hours
                </Chip>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className="bg-primary size-2 animate-pulse rounded-full"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="bg-primary size-2 animate-pulse rounded-full"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="bg-primary size-2 animate-pulse rounded-full"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
                <span className="text-foreground-600 text-sm font-medium">
                  Maintenance in progress
                </span>
              </div>
              <p className="text-foreground-600 text-center text-sm">
                We are upgrading our data processing systems for faster analysis
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* What We're Doing Section */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <h2 className="text-foreground text-center text-2xl font-semibold">
          What&apos;s Under the Hood? 🔧
        </h2>
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          variants={cardGridVariants}
        >
          <motion.div variants={cardVariants}>
            <Card className="border-primary-200 border-1">
              <CardBody className="flex flex-row items-start gap-3 p-4">
                <Zap className="text-primary mt-1 size-6 flex-shrink-0" />
                <div>
                  <h3 className="text-foreground font-semibold">
                    Performance Boost
                  </h3>
                  <p className="text-foreground-600 text-sm">
                    Turbocharging our database for lightning-fast COE trend
                    analysis
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="border-primary-200 border-1">
              <CardBody className="flex flex-row items-start gap-3 p-4">
                <Shield className="text-primary mt-1 size-6 flex-shrink-0" />
                <div>
                  <h3 className="text-foreground font-semibold">
                    Security Updates
                  </h3>
                  <p className="text-foreground-600 text-sm">
                    Installing the latest security patches to protect your data
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="border-primary-200 border-1">
              <CardBody className="flex flex-row items-start gap-3 p-4">
                <TrendingUp className="text-primary mt-1 size-6 flex-shrink-0" />
                <div>
                  <h3 className="text-foreground font-semibold">
                    New Features
                  </h3>
                  <p className="text-foreground-600 text-sm">
                    Adding advanced analytics for better market predictions
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="border-primary-200 border-1">
              <CardBody className="flex flex-row items-start gap-3 p-4">
                <Wrench className="text-primary mt-1 size-6 flex-shrink-0" />
                <div>
                  <h3 className="text-foreground font-semibold">Bug Fixes</h3>
                  <p className="text-foreground-600 text-sm">
                    Fixing minor issues to ensure smooth sailing ahead
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Divider />
      </motion.div>

      {/* Contact Section */}
      <motion.div className="space-y-4 text-center" variants={itemVariants}>
        <h3 className="text-foreground text-lg font-semibold">
          Need Immediate Assistance? 🚨
        </h3>
        <p className="text-foreground-600">
          While we&apos;re upgrading, our support team is still available for
          urgent inquiries
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="mailto:support@sgcarstrends.com"
            color="primary"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Mail className="size-4" />
            support@sgcarstrends.com
          </Link>
          <span className="text-foreground-400 hidden sm:inline">|</span>
          <Link
            href="https://twitter.com/sgcarstrends"
            color="primary"
            className="flex items-center gap-2 text-sm font-medium"
            isExternal
          >
            <MessageCircle className="size-4" />
            Follow updates on Twitter
          </Link>
        </div>
      </motion.div>

      {/* Footer Message */}
      <motion.div className="text-center" variants={itemVariants}>
        <p className="text-foreground-500 text-sm">
          🏁 Thanks for your patience as we race towards a better experience!
        </p>
        <p className="text-foreground-400 mt-2 text-xs">
          This page will automatically refresh when maintenance is complete
        </p>
      </motion.div>
    </motion.div>
  );
};
