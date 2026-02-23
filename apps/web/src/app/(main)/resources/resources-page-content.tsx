"use client";

import { Tab, Tabs } from "@heroui/react";
import { PageHeader } from "@web/components/page-header";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@web/config/animations";
import { motion } from "framer-motion";
import { DataSourcesTab } from "./data-sources-tab";
import { FAQTab } from "./faq-tab";
import { GlossaryTab } from "./glossary-tab";
import { GuidesTab } from "./guides-tab";

export function ResourcesPageContent() {
  return (
    <motion.div
      className="flex flex-col gap-8"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItemVariants}>
        <PageHeader
          title="Resources"
          subtitle="Educational hub for Singapore's automotive market — FAQs, glossary, data sources, and guides."
        />
      </motion.div>
      <motion.div variants={staggerItemVariants}>
        <Tabs aria-label="Resources" variant="underlined" size="lg">
          <Tab key="faq" title="FAQ">
            <FAQTab />
          </Tab>
          <Tab key="glossary" title="Glossary">
            <GlossaryTab />
          </Tab>
          <Tab key="data-sources" title="Data Sources">
            <DataSourcesTab />
          </Tab>
          <Tab key="guides" title="Guides">
            <GuidesTab />
          </Tab>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
