// TODO: Delete this file once blog/posts UI revamp is complete
"use client";

import { Chip } from "@heroui/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Tab, Tabs } from "@heroui/tabs";
import Image from "next/image";
import { useState } from "react";

// Mock TOC sections
const tocSections = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "key-highlights", label: "Key Highlights" },
  { id: "fuel-type-analysis", label: "Fuel Type Analysis" },
  { id: "vehicle-type-analysis", label: "Vehicle Type Analysis" },
  { id: "brand-performance", label: "Brand Performance" },
  { id: "conclusion", label: "Conclusion" },
];

// Hero image from existing category images (EV charging)
const heroImage =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop";

// Mock data matching the production blog post
const mockData = {
  title: "Electric Vehicles Dominate Singapore October 2025",
  date: "12 November 2025",
  readingTime: "5 min read",
  views: "313 views",
  tags: ["Electric Vehicles", "Market Analysis", "October 2025"],
  heroImage,
  executiveSummary:
    "Singapore's car market in October 2025 saw a remarkable shift towards electrification, with Electric Vehicles (EVs) securing over half of all new registrations. Hybrid vehicles also maintained strong popularity, collectively pushing traditional petrol cars to a minority share. Sports Utility Vehicles (SUVs) continued their reign as the preferred body style, reflecting a broader consumer trend for versatile and spacious vehicles.",
  highlights: [
    {
      label: "Electric Vehicles Lead the Charge",
      value: "52.60%",
      detail: "2,081 units registered in October 2025",
    },
    {
      label: "Hybrids Remain Strong",
      value: "36.48%",
      detail: "1,443 combined hybrid registrations",
    },
    {
      label: "BYD Tops the Brands",
      value: "1,050",
      detail: "vehicles, leading by strong EV lineup",
    },
    {
      label: "SUVs Continue to Dominate",
      value: "60.54%",
      detail: "2,395 units of all new registrations",
    },
    {
      label: "Petrol Cars Decline",
      value: "10.92%",
      detail: "significant drop in market share",
    },
  ],
  fuelTableColumns: [
    { key: "fuelType", label: "Fuel Type" },
    { key: "registrations", label: "Total Registrations" },
    { key: "percentage", label: "Percentage" },
  ],
  fuelTableRows: [
    {
      key: "1",
      fuelType: "Electric",
      registrations: "2,081",
      percentage: "52.60%",
    },
    {
      key: "2",
      fuelType: "Petrol-Electric",
      registrations: "1,351",
      percentage: "34.15%",
    },
    {
      key: "3",
      fuelType: "Petrol",
      registrations: "432",
      percentage: "10.92%",
    },
    {
      key: "4",
      fuelType: "Petrol-Electric (Plug-In)",
      registrations: "92",
      percentage: "2.33%",
    },
    {
      key: "5",
      fuelType: "Total",
      registrations: "3,956",
      percentage: "100.00%",
    },
  ],
  vehicleTableColumns: [
    { key: "vehicleType", label: "Vehicle Type" },
    { key: "registrations", label: "Total Registrations" },
    { key: "percentage", label: "Percentage" },
  ],
  vehicleTableRows: [
    {
      key: "1",
      vehicleType: "Sports Utility Vehicle",
      registrations: "2,395",
      percentage: "60.54%",
    },
    {
      key: "2",
      vehicleType: "Multi-purpose Vehicle",
      registrations: "792",
      percentage: "20.02%",
    },
    {
      key: "3",
      vehicleType: "Sedan",
      registrations: "549",
      percentage: "13.88%",
    },
    {
      key: "4",
      vehicleType: "Hatchback",
      registrations: "136",
      percentage: "3.44%",
    },
    {
      key: "5",
      vehicleType: "Coupe/Convertible",
      registrations: "67",
      percentage: "1.69%",
    },
    {
      key: "6",
      vehicleType: "Station-wagon",
      registrations: "17",
      percentage: "0.43%",
    },
    {
      key: "7",
      vehicleType: "Total",
      registrations: "3,956",
      percentage: "100.00%",
    },
  ],
};

// Style 1: Bloomberg Businessweek - Bold Magazine Editorial
const BloombergStyle = () => (
  <div className="min-h-screen">
    {/* Hero Image - Full bleed with dramatic dark overlay */}
    <div className="relative mb-12 aspect-[4/3] w-full overflow-hidden md:aspect-[21/9]">
      <Image
        src={mockData.heroImage}
        alt="Hero"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
        <span className="mb-3 font-bold text-white/70 text-xs uppercase tracking-[0.3em] drop-shadow-md">
          Market Analysis
        </span>
        <h1 className="mb-3 max-w-4xl font-black text-2xl text-white leading-tight tracking-tight drop-shadow-lg sm:text-4xl md:text-6xl md:leading-[0.95]">
          {mockData.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 font-medium text-white/70 text-xs uppercase tracking-wider drop-shadow-md sm:gap-4 sm:text-sm">
          <span>{mockData.date}</span>
          <span className="h-1 w-1 rounded-full bg-white/50" />
          <span>{mockData.readingTime}</span>
          <span className="h-1 w-1 rounded-full bg-white/50" />
          <span>{mockData.views}</span>
        </div>
      </div>
    </div>

    {/* Table of Contents - Bloomberg Style: Compact horizontal */}
    <nav className="mb-12 border-black border-b-2 pb-6">
      <div className="mb-4 font-bold text-black/60 text-xs uppercase tracking-[0.3em]">
        In This Report
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {tocSections.map((section, idx) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex items-center gap-2 font-bold text-black text-sm underline-offset-4 hover:underline"
          >
            <span className="text-primary">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span>{section.label}</span>
          </a>
        ))}
      </div>
    </nav>

    {/* Executive Summary */}
    <section className="mb-12">
      <p className="font-light text-black/80 text-lg leading-relaxed">
        {mockData.executiveSummary}
      </p>
    </section>

    {/* Key Highlights */}
    <section className="mb-12">
      <h2 className="mb-6 font-bold text-black/60 text-xs uppercase tracking-[0.3em]">
        Key Highlights
      </h2>
      <div className="grid grid-cols-1 gap-0 border-black border-t-2 md:grid-cols-2 lg:grid-cols-3">
        {mockData.highlights.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="border-black border-r-0 border-b-2 p-5 last:border-r-0 md:border-r-2"
          >
            <div className="mb-1 font-black text-3xl text-primary md:text-4xl">
              {item.value}
            </div>
            <div className="mb-1 font-bold text-black text-xs uppercase tracking-wide">
              {item.label}
            </div>
            <div className="text-black/60 text-xs">{item.detail}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Data Tables - Editorial magazine style */}
    <section className="mb-12">
      <h2 className="mb-6 font-bold text-black/60 text-xs uppercase tracking-[0.3em]">
        Data Tables
      </h2>
      <h3 className="mb-4 font-semibold text-black text-xl">
        Fuel Type Breakdown
      </h3>
      <div className="border-primary border-l-4">
        <Table
          aria-label="Fuel type breakdown"
          classNames={{
            wrapper: "rounded-none shadow-none bg-transparent",
            th: "bg-transparent text-black/50 font-bold uppercase text-[10px] tracking-wider border-b-2 border-black",
            td: "text-sm py-3",
            tr: "border-b border-black/10 last:border-none",
          }}
        >
          <TableHeader columns={mockData.fuelTableColumns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className={column.key !== "fuelType" ? "text-right" : ""}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={mockData.fuelTableRows}>
            {(item) => (
              <TableRow
                key={item.key}
                className={
                  item.fuelType === "Total"
                    ? "bg-black/5 font-semibold"
                    : "hover:bg-black/[0.02]"
                }
              >
                {(columnKey) => (
                  <TableCell
                    className={
                      columnKey === "percentage"
                        ? "text-right font-semibold text-primary tabular-nums"
                        : columnKey !== "fuelType"
                          ? "text-right tabular-nums"
                          : ""
                    }
                  >
                    {item[columnKey as keyof typeof item]}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>

    {/* Analysis Section */}
    <section className="mb-12">
      <h2 className="mb-4 font-bold text-black/60 text-xs uppercase tracking-[0.3em]">
        Analysis
      </h2>
      <h3 className="mb-4 font-black text-black text-xl">Fuel Type Trends</h3>
      <p className="mb-6 text-base text-black/80 leading-relaxed">
        October 2025 data paints a clear picture: Singapore's car market is
        rapidly electrifying. Electric Vehicles (EVs) have crossed a significant
        milestone, claiming over half of all new registrations at 52.60%. This
        surge can be attributed to a combination of factors, including
        increasing model availability, advancements in charging infrastructure.
      </p>
      <blockquote className="my-6 border-primary border-l-4 pl-6 font-light text-lg italic">
        "The love affair with Sports Utility Vehicles (SUVs) in Singapore
        continues unabated, with SUVs accounting for a staggering 60.54% of all
        new registrations."
      </blockquote>
    </section>
  </div>
);

// Style 2: Hybrid - Best of All (Single-column with horizontal TOC)
const HybridStyle = () => (
  <div className="min-h-screen">
    {/* Header - Centered with gradient title */}
    <header className="border-default-200 border-b bg-background py-8">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Chip
          size="sm"
          variant="flat"
          className="mb-4 bg-default-100 text-default-600 text-xs"
        >
          Market Analysis
        </Chip>
        <h1 className="mx-auto mb-4 max-w-4xl bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text font-semibold text-3xl text-transparent leading-tight md:text-5xl">
          {mockData.title}
        </h1>
        <div className="flex items-center justify-center gap-3 text-default-500 text-sm">
          <span>{mockData.date}</span>
          <span className="text-default-300">·</span>
          <span>{mockData.readingTime}</span>
          <span className="text-default-300">·</span>
          <span>{mockData.views}</span>
        </div>
      </div>
    </header>

    {/* Hero Image - Full width, ABOVE content (not overlay) */}
    <div className="relative aspect-[21/9] w-full">
      <Image
        src={mockData.heroImage}
        alt="Hero"
        fill
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>

    {/* Content - Single column */}
    <div className="mx-auto max-w-3xl px-6 pt-8">
      {/* Horizontal TOC - Bloomberg-style numbered navigation */}
      <nav className="mb-8 border-default-200 border-b pb-6">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {tocSections.map((section, idx) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex items-center gap-2 text-default-600 text-sm transition-colors hover:text-foreground"
            >
              <span className="font-bold text-primary/60 text-xs group-hover:text-primary">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span>{section.label}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Key Highlights - Bloomberg grid style */}
      <section className="mb-8">
        <h2 className="mb-6 font-medium text-default-400 text-sm uppercase tracking-wider">
          Key Highlights
        </h2>
        <div className="grid grid-cols-1 gap-0 border-default-200 border-t md:grid-cols-2 lg:grid-cols-3">
          {mockData.highlights.map((item) => (
            <div
              key={`hybrid-${item.label}-${item.value}`}
              className="border-default-200 border-r-0 border-b p-5 last:border-r-0 md:border-r"
            >
              <div className="mb-1 font-semibold text-3xl text-primary tabular-nums md:text-4xl">
                {item.value}
              </div>
              <div className="mb-1 font-medium text-foreground text-sm">
                {item.label}
              </div>
              <div className="text-default-500 text-xs">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Executive Summary */}
      <section className="mb-8">
        <p className="text-default-600 text-lg leading-relaxed">
          {mockData.executiveSummary}
        </p>
      </section>

      {/* Data Table - Editorial accent border style */}
      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-foreground text-xl">
          Fuel Type Breakdown
        </h2>
        <div className="border-primary border-l-4">
          <Table
            aria-label="Fuel type breakdown"
            classNames={{
              wrapper: "rounded-none shadow-none bg-transparent",
              th: "bg-transparent text-default-400 font-bold uppercase text-[10px] tracking-wider border-b-2 border-foreground",
              td: "text-sm py-3",
              tr: "border-b border-default-100 last:border-none hover:bg-default-50 transition-colors",
            }}
          >
            <TableHeader columns={mockData.fuelTableColumns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className={column.key !== "fuelType" ? "text-right" : ""}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={mockData.fuelTableRows}>
              {(item) => (
                <TableRow
                  key={item.key}
                  className={item.fuelType === "Total" ? "font-semibold" : ""}
                >
                  {(columnKey) => (
                    <TableCell
                      className={
                        columnKey === "percentage"
                          ? "text-right font-semibold text-primary tabular-nums"
                          : columnKey !== "fuelType"
                            ? "text-right tabular-nums"
                            : ""
                      }
                    >
                      {item[columnKey as keyof typeof item]}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Analysis Section */}
      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-foreground text-xl">
          Fuel Type Trends
        </h2>
        <p className="mb-6 text-base text-default-600 leading-relaxed">
          October 2025 data paints a clear picture: Singapore's car market is
          rapidly electrifying. Electric Vehicles (EVs) have crossed a
          significant milestone, claiming over half of all new registrations at
          52.60%. This surge can be attributed to a combination of factors,
          including increasing model availability, advancements in charging
          infrastructure.
        </p>
        <blockquote className="my-6 border-primary border-l-4 pl-6 text-default-500 text-lg italic">
          "The love affair with Sports Utility Vehicles (SUVs) in Singapore
          continues unabated, with SUVs accounting for a staggering 60.54% of
          all new registrations."
        </blockquote>
      </section>
    </div>
  </div>
);

export default function StylePreviewPage() {
  const [selected, setSelected] = useState("hybrid");

  const styles = [
    {
      key: "bloomberg",
      title: "Bloomberg",
      description: "Bold Magazine Editorial — Dramatic typography",
    },
    {
      key: "hybrid",
      title: "Hybrid ★",
      description: "Best of All — Single-column with horizontal TOC",
    },
  ];

  return (
    <div>
      {/* Header with tabs */}
      <div className="px-4 py-6">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-semibold text-foreground text-lg">
            Blog Style Preview
          </h1>
          <Tabs
            aria-label="Style options"
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key as string)}
            variant="underlined"
            color="primary"
            size="sm"
          >
            {styles.map((style) => (
              <Tab key={style.key} title={style.title} />
            ))}
          </Tabs>
        </div>
        <p className="text-default-500 text-sm">
          {styles.find((s) => s.key === selected)?.description}
        </p>
      </div>

      {/* Full-bleed preview */}
      {selected === "bloomberg" && <BloombergStyle />}
      {selected === "hybrid" && <HybridStyle />}
    </div>
  );
}
