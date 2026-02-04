"use client";

import { useState } from "react";
import { BoldPreview } from "./components/bold-preview";
import { MonochromeBoldPreview } from "./components/dark-preview";
import { WarmMinimalPreview } from "./components/glass-preview";
import { MinimalPreview } from "./components/minimal-preview";

type DesignOption = "warm" | "bold" | "minimal" | "mono";

interface DesignInfo {
  id: DesignOption;
  name: string;
  tagline: string;
  description: string;
}

const DESIGN_OPTIONS: DesignInfo[] = [
  {
    id: "bold",
    name: "Bold & Vibrant",
    tagline: "High Energy",
    description:
      "Strong accent colours, large typography, high contrast, and chunky elements. Bright teal/coral accents on clean white for an energetic, confident feel.",
  },
  {
    id: "minimal",
    name: "Clean Minimal",
    tagline: "Refined Focus",
    description:
      "Maximum whitespace, subtle borders, muted colours, and refined typography. Neutral grays with single accent for a professional, data-focused experience.",
  },
  {
    id: "warm",
    name: "Warm Minimal",
    tagline: "Calm Warmth",
    description:
      "Clean minimal structure with warm earthy tones. Sand, terracotta, and warm grays with amber accent for a professional yet approachable feel.",
  },
  {
    id: "mono",
    name: "Monochrome Bold",
    tagline: "High Impact",
    description:
      "Chunky shadows and bold typography with black/white palette. Electric blue accent for striking, modern, high-impact visuals.",
  },
];

const DesignsPreviewPage = () => {
  const [activeDesign, setActiveDesign] = useState<DesignOption>("bold");

  const renderPreview = () => {
    switch (activeDesign) {
      case "warm":
        return <WarmMinimalPreview />;
      case "bold":
        return <BoldPreview />;
      case "minimal":
        return <MinimalPreview />;
      case "mono":
        return <MonochromeBoldPreview />;
    }
  };

  const activeInfo = DESIGN_OPTIONS.find((d) => d.id === activeDesign);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="font-medium text-primary text-sm uppercase tracking-wider">
            Design Preview
          </p>
          <h1 className="mt-2 font-bold text-4xl text-gray-900">
            Dashboard UI Revamp
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Compare four distinct design directions for the new dashboard. Each
            showcases metric cards, COE premiums, charts, and tables in their
            unique style.
          </p>
        </div>

        {/* Design Selector */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start">
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2">
            {DESIGN_OPTIONS.map((design) => (
              <button
                key={design.id}
                type="button"
                onClick={() => setActiveDesign(design.id)}
                className={`group relative flex flex-col items-start rounded-xl px-4 py-3 text-left transition-all ${
                  activeDesign === design.id
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="font-semibold">{design.name}</span>
                <span
                  className={`text-xs ${
                    activeDesign === design.id
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {design.tagline}
                </span>
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 lg:ml-4">
            <p className="font-medium text-gray-900">{activeInfo?.name}</p>
            <p className="mt-1 text-gray-600 text-sm">
              {activeInfo?.description}
            </p>
          </div>
        </div>

        {/* Preview Area */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          {renderPreview()}
        </div>

        {/* Comparison Guide */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {DESIGN_OPTIONS.map((design) => (
            <div
              key={design.id}
              className={`rounded-xl border-2 p-4 transition-all ${
                activeDesign === design.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <h3 className="font-semibold text-gray-900">{design.name}</h3>
              <p className="mt-1 text-gray-500 text-xs">{design.tagline}</p>
              <div className="mt-3 flex flex-col gap-1">
                <FeatureRow
                  design={design.id}
                  feature="Cards"
                  warm="Warm borders"
                  bold="Chunky shadows"
                  minimal="Thin borders"
                  mono="Black shadows"
                />
                <FeatureRow
                  design={design.id}
                  feature="Typography"
                  warm="Medium weight"
                  bold="Extra bold"
                  minimal="Medium weight"
                  mono="Extra black"
                />
                <FeatureRow
                  design={design.id}
                  feature="Colours"
                  warm="Stone/amber"
                  bold="Teal/coral"
                  minimal="Neutral gray"
                  mono="Black/blue"
                />
              </div>
              <button
                type="button"
                onClick={() => setActiveDesign(design.id)}
                className={`mt-4 w-full rounded-lg py-2 text-sm transition-all ${
                  activeDesign === design.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {activeDesign === design.id ? "Viewing" : "View Design"}
              </button>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">What&apos;s Included</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
            <div>
              <p className="font-medium text-gray-700 text-sm">Metric Cards</p>
              <p className="text-gray-500 text-xs">
                Total registrations, top make, growth
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm">COE Premiums</p>
              <p className="text-gray-500 text-xs">5 categories with trends</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm">Chart Widget</p>
              <p className="text-gray-500 text-xs">
                6-month trend visualisation
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm">Data Table</p>
              <p className="text-gray-500 text-xs">Top 5 makes with stats</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm">Navigation</p>
              <p className="text-gray-500 text-xs">Tab/button styling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureRowProps {
  design: DesignOption;
  feature: string;
  warm: string;
  bold: string;
  minimal: string;
  mono: string;
}

function FeatureRow({
  design,
  feature,
  warm,
  bold,
  minimal,
  mono,
}: FeatureRowProps) {
  const values = { warm, bold, minimal, mono };
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{feature}</span>
      <span className="font-medium text-gray-700">{values[design]}</span>
    </div>
  );
}

export default DesignsPreviewPage;
