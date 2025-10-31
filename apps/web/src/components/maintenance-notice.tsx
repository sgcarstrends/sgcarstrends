"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import Typography from "@web/components/typography";
import useMaintenance from "@web/hooks/use-maintenance";
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
      className="mx-auto flex max-w-4xl flex-col gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      {/* Hero Section */}
      <motion.div
        className="flex flex-col items-center gap-4 text-center"
        variants={itemVariants}
      >
        <motion.div className="mb-4" variants={iconVariants} animate="animate">
          <motion.div variants={spinVariants} animate="animate">
            <Settings className="size-20 text-primary" />
          </motion.div>
        </motion.div>
        <motion.div variants={textVariants}>
          <Typography.H1>🚗 Pit Stop in Progress</Typography.H1>
        </motion.div>
        <motion.div variants={textVariants}>
          <Typography.BodyLarge>
            Just like a Formula 1 pit stop, we&apos;re fine-tuning our engines
            to deliver the fastest and most reliable Singapore car market
            insights!
          </Typography.BodyLarge>
        </motion.div>
      </motion.div>

      {/* Status Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardBody>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-primary" />
                  <Typography.Body>Estimated Completion</Typography.Body>
                </div>
                <Chip variant="shadow" color="primary" size="lg">
                  2 hours
                </Chip>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className="size-2 animate-pulse rounded-full bg-primary"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="size-2 animate-pulse rounded-full bg-primary"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="size-2 animate-pulse rounded-full bg-primary"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
                <Typography.BodySmall>
                  Maintenance in progress
                </Typography.BodySmall>
              </div>
              <Typography.BodySmall>
                We are upgrading our data processing systems for faster analysis
              </Typography.BodySmall>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* What We're Doing Section */}
      <motion.div className="flex flex-col gap-4" variants={itemVariants}>
        <Typography.H2>What&apos;s Under the Hood? 🔧</Typography.H2>
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          variants={cardGridVariants}
        >
          <motion.div variants={cardVariants}>
            <Card className="border-1 border-primary-200">
              <CardBody className="flex flex-row items-start gap-3 p-4">
                <Zap className="mt-1 size-6 flex-shrink-0 text-primary" />
                <div>
                  <Typography.H3>Performance Boost</Typography.H3>
                  <Typography.BodySmall>
                    Turbocharging our database for lightning-fast COE trend
                    analysis
                  </Typography.BodySmall>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="border-1 border-primary-200">
              <CardBody className="flex flex-row items-start gap-3 p-4">
                <Shield className="mt-1 size-6 flex-shrink-0 text-primary" />
                <div>
                  <Typography.H3>Security Updates</Typography.H3>
                  <Typography.BodySmall>
                    Installing the latest security patches to protect your data
                  </Typography.BodySmall>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="border-1 border-primary-200">
              <CardBody className="flex flex-row items-start gap-3 p-4">
                <TrendingUp className="mt-1 size-6 flex-shrink-0 text-primary" />
                <div>
                  <Typography.H3>New Features</Typography.H3>
                  <Typography.BodySmall>
                    Adding advanced analytics for better market predictions
                  </Typography.BodySmall>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="border-1 border-primary-200">
              <CardBody className="flex flex-row items-start gap-3 p-4">
                <Wrench className="mt-1 size-6 flex-shrink-0 text-primary" />
                <div>
                  <Typography.H3>Bug Fixes</Typography.H3>
                  <Typography.BodySmall>
                    Fixing minor issues to ensure smooth sailing ahead
                  </Typography.BodySmall>
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
      <motion.div
        className="flex flex-col gap-4 text-center"
        variants={itemVariants}
      >
        <Typography.H3>Need Immediate Assistance? 🚨</Typography.H3>
        <Typography.Body>
          While we&apos;re upgrading, our support team is still available for
          urgent inquiries
        </Typography.Body>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="mailto:support@sgcarstrends.com"
            color="primary"
            className="flex items-center gap-2 font-medium text-sm"
          >
            <Mail className="size-4" />
            support@sgcarstrends.com
          </Link>
          <span className="hidden text-foreground-400 sm:inline">|</span>
          <Link
            href="https://twitter.com/sgcarstrends"
            color="primary"
            className="flex items-center gap-2 font-medium text-sm"
            isExternal
          >
            <MessageCircle className="size-4" />
            Follow updates on Twitter
          </Link>
        </div>
      </motion.div>

      {/* Footer Message */}
      <motion.div className="text-center" variants={itemVariants}>
        <Typography.BodySmall>
          🏁 Thanks for your patience as we race towards a better experience!
        </Typography.BodySmall>
        <Typography.Caption>
          This page will automatically refresh when maintenance is complete
        </Typography.Caption>
      </motion.div>
    </motion.div>
  );
};
