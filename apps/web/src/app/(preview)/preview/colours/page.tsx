"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";

const accentOptions = [
  {
    name: "Steel Blue",
    hex: "#4A6AAE",
    hsl: "hsl(220, 40%, 49%)",
    description: "Monochromatic - stays in the blue family",
    recommended: true,
  },
  {
    name: "Muted Teal",
    hex: "#14B8A6",
    hsl: "hsl(173, 80%, 40%)",
    description: "Modern but subtle, desaturated cyan",
    recommended: false,
  },
  {
    name: "Gold/Amber",
    hex: "#F59E0B",
    hsl: "hsl(38, 92%, 50%)",
    description: "Classic navy complement, adds warmth",
    recommended: false,
  },
  {
    name: "Soft Sky Blue",
    hex: "#7DD3FC",
    hsl: "hsl(198, 93%, 74%)",
    description: "Light and airy, clean highlights",
    recommended: false,
  },
];

const AccentPreview = ({
  colour,
}: {
  colour: (typeof accentOptions)[number];
}) => {
  const accentStyle = { backgroundColor: colour.hex };
  const accentTextStyle = { color: colour.hex };
  const accentBorderStyle = { borderColor: colour.hex };

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-col items-start gap-2 pb-0">
        <div className="flex w-full items-center justify-between">
          <h3 className="font-medium text-xl">{colour.name}</h3>
          {colour.recommended && (
            <Chip className="rounded-full" color="success" size="sm">
              Recommended
            </Chip>
          )}
        </div>
        <p className="text-default-600 text-sm">{colour.description}</p>
        <div className="flex items-center gap-2">
          <code className="rounded bg-default-100 px-2 py-1 font-mono text-xs">
            {colour.hex}
          </code>
          <code className="rounded bg-default-100 px-2 py-1 font-mono text-xs">
            {colour.hsl}
          </code>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-6">
        {/* Colour swatch */}
        <div className="flex items-center gap-4">
          <div
            className="size-16 rounded-xl shadow-sm"
            style={accentStyle}
            title={colour.name}
          />
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">Accent Colour</span>
            <span className="text-default-500 text-xs">
              For highlights, links, and interactive elements
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm">Buttons</span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="rounded-full text-white"
              style={accentStyle}
              size="sm"
            >
              Primary Action
            </Button>
            <Button
              className="rounded-full border-2 bg-transparent"
              style={{ ...accentBorderStyle, ...accentTextStyle }}
              size="sm"
            >
              Secondary
            </Button>
            <Button
              className="rounded-full bg-transparent"
              style={accentTextStyle}
              size="sm"
            >
              Text Button
            </Button>
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm">Chips & Badges</span>
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              className="rounded-full text-white"
              style={accentStyle}
              size="sm"
            >
              Active
            </Chip>
            <Chip
              classNames={{
                base: "rounded-full border-2 bg-transparent",
                content: "",
              }}
              style={{ ...accentBorderStyle, ...accentTextStyle }}
              size="sm"
            >
              Outlined
            </Chip>
            <Chip
              classNames={{
                base: "rounded-full",
                content: "",
              }}
              style={{
                backgroundColor: `${colour.hex}20`,
                ...accentTextStyle,
              }}
              size="sm"
            >
              Subtle
            </Chip>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm">Links & Text</span>
          <div className="flex flex-col gap-1">
            <Link href="#" style={accentTextStyle} className="text-sm">
              This is an accent link →
            </Link>
            <p className="text-sm">
              Regular text with{" "}
              <span style={accentTextStyle} className="font-medium">
                highlighted keywords
              </span>{" "}
              inline.
            </p>
          </div>
        </div>

        {/* Progress/Indicators */}
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm">Progress & Indicators</span>
          <div className="flex flex-col gap-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-default-200">
              <div
                className="h-full rounded-full"
                style={{ ...accentStyle, width: "65%" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full" style={accentStyle} />
              <span className="text-sm">Active indicator</span>
            </div>
          </div>
        </div>

        {/* Card with accent border */}
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm">Card Accent</span>
          <div
            className="rounded-xl border-2 border-l-4 bg-default-50 p-4"
            style={{ borderLeftColor: colour.hex }}
          >
            <p className="font-medium text-sm">Featured Content</p>
            <p className="text-default-500 text-xs">
              Cards with accent left border for emphasis
            </p>
          </div>
        </div>

        {/* With Navy Blue context */}
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm">With Navy Blue Primary</span>
          <div className="flex items-center gap-2 rounded-xl bg-primary p-4">
            <Button
              className="rounded-full text-white"
              style={accentStyle}
              size="sm"
            >
              Accent Button
            </Button>
            <span className="text-sm text-white/80">on navy background</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default function ColourPreviewPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="font-semibold text-4xl text-foreground">
            Accent Colour Preview
          </h1>
          <p className="mt-2 text-default-600 text-lg">
            Compare accent colour options against the Navy Blue primary colour
            scheme
          </p>
        </div>

        {/* Current colours reference */}
        <Card className="mb-8 rounded-2xl border-2 border-primary">
          <CardHeader className="flex flex-col items-start gap-2">
            <h2 className="font-medium text-xl">Current Brand Colours</h2>
            <p className="text-default-600 text-sm">
              These are the established primary and secondary colours
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div
                  className="size-12 rounded-xl shadow-sm"
                  style={{ backgroundColor: "#191970" }}
                />
                <div>
                  <p className="font-medium text-sm">Navy Blue</p>
                  <p className="text-default-500 text-xs">#191970 - Primary</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="size-12 rounded-xl shadow-sm"
                  style={{ backgroundColor: "#708090" }}
                />
                <div>
                  <p className="font-medium text-sm">Slate Gray</p>
                  <p className="text-default-500 text-xs">
                    #708090 - Secondary
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="size-12 rounded-xl border-2 border-danger border-dashed shadow-sm"
                  style={{ backgroundColor: "#00FFFF" }}
                />
                <div>
                  <p className="font-medium text-sm">Cyan (Current)</p>
                  <p className="text-danger text-xs">#00FFFF - Too saturated</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Accent colour options */}
        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-3xl">Accent Colour Options</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {accentOptions.map((colour) => (
              <AccentPreview key={colour.name} colour={colour} />
            ))}
          </div>
        </div>

        {/* Side by side comparison */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-col items-start gap-2">
            <h2 className="font-medium text-xl">
              Side-by-Side Button Comparison
            </h2>
            <p className="text-default-600 text-sm">
              All accent colours shown together for direct comparison
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-3">
              {accentOptions.map((colour) => (
                <Button
                  key={colour.name}
                  className="rounded-full text-white"
                  style={{ backgroundColor: colour.hex }}
                >
                  {colour.name}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
