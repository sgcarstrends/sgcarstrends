"use client";

import { PageHeader } from "@web/components/page-header";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@web/config/animations";
import { motion } from "framer-motion";
import type { FAQSection } from "./faq-sections";
import { FAQSections } from "./faq-sections";

interface FAQPageContentProps {
  sections: FAQSection[];
}

export function FAQPageContent({ sections }: FAQPageContentProps) {
  return (
    <motion.div
      className="flex flex-col gap-8"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItemVariants}>
        <PageHeader
          title="Frequently Asked Questions"
          subtitle="Common questions about Singapore's automotive market, COE system, and car registration trends."
        />
      </motion.div>
      <motion.div variants={staggerItemVariants}>
        <FAQSections sections={sections} />
      </motion.div>
    </motion.div>
  );
}
