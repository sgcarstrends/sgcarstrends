"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import Typography from "@web/components/typography";
import {
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@web/config/animations";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Car, Landmark, Layers, TrendingUp } from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
}

interface GlossaryCategory {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  terms: GlossaryTerm[];
}

const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  {
    title: "Core Terms",
    icon: BookOpen,
    iconColor: "text-primary",
    terms: [
      {
        term: "COE",
        definition:
          "Certificate of Entitlement — a quota licence required to register a vehicle in Singapore, valid for 10 years.",
      },
      {
        term: "PQP",
        definition:
          "Prevailing Quota Premium — the moving average of COE prices used to calculate COE renewal costs after 10 years.",
      },
      {
        term: "PARF",
        definition:
          "Preferential Additional Registration Fee — a rebate given when deregistering a vehicle before its COE expires, calculated as a percentage of the ARF paid.",
      },
      {
        term: "ARF",
        definition:
          "Additional Registration Fee — a tax levied on top of the vehicle's Open Market Value at registration. The rate is tiered based on OMV.",
      },
      {
        term: "OMV",
        definition:
          "Open Market Value — the price of a vehicle before any Singapore-specific taxes, assessed by Singapore Customs.",
      },
      {
        term: "Road Tax",
        definition:
          "An annual tax based on engine capacity (for ICE vehicles) or power output (for EVs), payable to renew the vehicle's road usage rights.",
      },
    ],
  },
  {
    title: "COE Categories",
    icon: Layers,
    iconColor: "text-warning",
    terms: [
      {
        term: "Category A",
        definition:
          "Cars up to 1,600cc and 130bhp, or electric cars with power up to 110kW.",
      },
      {
        term: "Category B",
        definition:
          "Cars above 1,600cc or 130bhp, or electric cars with power above 110kW.",
      },
      {
        term: "Category C",
        definition: "Goods vehicles and buses.",
      },
      {
        term: "Category D",
        definition: "Motorcycles.",
      },
      {
        term: "Category E",
        definition:
          "Open category — can be used for any vehicle type. Typically attracts the highest premiums.",
      },
    ],
  },
  {
    title: "Vehicle Types",
    icon: Car,
    iconColor: "text-success",
    terms: [
      {
        term: "BEV",

        definition:
          "Battery Electric Vehicle — powered entirely by an electric motor and battery, with zero tailpipe emissions.",
      },
      {
        term: "PHEV",

        definition:
          "Plug-in Hybrid Electric Vehicle — has both an electric motor and internal combustion engine, with a battery that can be charged externally.",
      },
      {
        term: "HEV",

        definition:
          "Hybrid Electric Vehicle — combines an internal combustion engine with an electric motor but cannot be plugged in to charge.",
      },
    ],
  },
  {
    title: "Regulatory Bodies and Schemes",
    icon: Landmark,
    iconColor: "text-secondary",
    terms: [
      {
        term: "LTA",

        definition:
          "Land Transport Authority — the government agency responsible for planning, operating, and maintaining Singapore's land transport infrastructure and systems.",
      },
      {
        term: "VQS",

        definition:
          "Vehicle Quota System — the overall system that controls vehicle population growth in Singapore through COE quotas.",
      },
      {
        term: "VES",

        definition:
          "Vehicular Emissions Scheme — a scheme that provides rebates or surcharges based on a vehicle's emissions, encouraging cleaner vehicles.",
      },
      {
        term: "CEVS",

        definition:
          "Carbon Emissions-based Vehicle Scheme — the predecessor to VES, which provided rebates or surcharges based on carbon emissions alone.",
      },
      {
        term: "ERP",

        definition:
          "Electronic Road Pricing — a congestion pricing system that charges motorists for using certain roads during peak hours.",
      },
    ],
  },
  {
    title: "Market Terms",
    icon: TrendingUp,
    iconColor: "text-primary",
    terms: [
      {
        term: "Quota Premium",

        definition:
          "The price of a COE as determined by the bidding exercise — the lowest successful bid in each category.",
      },
      {
        term: "Deregistration",

        definition:
          "The process of removing a vehicle from the Singapore register, either for export, scrappage, or to claim PARF/COE rebates.",
      },
      {
        term: "Parallel Import",

        definition:
          "Vehicles imported by dealers other than the official authorised distributor, often at competitive prices.",
      },
      {
        term: "Paper Bid",

        definition:
          "A pre-bidding COE commitment made through authorised dealers before the actual bidding exercise.",
      },
    ],
  },
];

export function GlossarySection() {
  return (
    <section
      id="glossary"
      className="relative -mx-6 scroll-mt-24 overflow-hidden bg-default-100 px-6 py-20 lg:py-28"
    >
      {/* Dot pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="container relative mx-auto">
        {/* Section header */}
        <motion.div
          className="flex flex-col items-center gap-4 pb-12 text-center"
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Typography.Label className="text-primary uppercase tracking-widest">
            Terminology
          </Typography.Label>
          <Typography.H2 className="lg:text-4xl">
            Glossary of Key Terms
          </Typography.H2>
          <Typography.Text className="max-w-2xl text-default-600">
            Understanding Singapore&apos;s automotive terminology is essential
            for navigating the car market.
          </Typography.Text>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-col gap-12">
          {GLOSSARY_CATEGORIES.map((category) => (
            <motion.div
              key={category.title}
              className="flex flex-col gap-6"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <category.icon className={`size-5 ${category.iconColor}`} />
                <Typography.H3>{category.title}</Typography.H3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.terms.map(({ term, definition }) => (
                  <motion.div key={term} variants={staggerItemVariants}>
                    <Card className="h-full border-default-200/80 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                      <CardHeader className="pb-0">
                        <Typography.H4>{term}</Typography.H4>
                      </CardHeader>
                      <CardBody>
                        <Typography.TextSm>{definition}</Typography.TextSm>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
