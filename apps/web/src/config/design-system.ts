/**
 * Design System Tokens
 *
 * Centralized design tokens for consistent UI across the application.
 * Based on Vercel Web Interface Guidelines and modern dashboard design principles.
 */

/**
 * Spacing tokens for gap utilities
 * Use these instead of arbitrary gap values for consistency
 */
export const SPACING = {
  /** 8px - Compact spacing for tight layouts */
  sm: "gap-2",
  /** 16px - Default spacing between elements */
  md: "gap-4",
  /** 24px - Section group spacing */
  lg: "gap-6",
  /** 32px - Major section spacing */
  xl: "gap-8",
} as const;

/**
 * Border radius tokens for consistent rounded corners
 * Implements pill-shaped design system
 */
export const RADIUS = {
  /** Fully rounded - for pills, buttons, chips */
  pill: "rounded-full",
  /** Large rounded - for standard cards */
  card: "rounded-2xl",
  /** Extra large rounded - for hero/featured cards */
  cardLarge: "rounded-3xl",
  /** Medium rounded - for elements within cards */
  element: "rounded-xl",
  /** Small rounded - for compact elements */
  elementSm: "rounded-lg",
} as const;

/**
 * Chart height tokens for standardized chart sizing (3-tier system)
 */
export const CHART_HEIGHTS = {
  /** 64px - Sparklines and mini charts */
  sparkline: "h-16",
  /** 300px - Standard dashboard charts (most charts) */
  standard: "h-[300px]",
  /** 400px - Detailed charts with more data */
  tall: "h-[400px]",
} as const;

/**
 * Chart grid presets for consistent CartesianGrid styling
 */
export const CHART_GRID = {
  /** Default grid with horizontal dashed lines */
  default: {
    vertical: false,
    strokeDasharray: "3 3",
    className: "stroke-default-200",
  },
  /** Minimal grid with no lines */
  minimal: {
    vertical: false,
    horizontal: false,
    strokeDasharray: undefined,
    className: undefined,
  },
} as const;

/**
 * Chart tooltip cursor presets
 */
export const CHART_CURSOR = {
  /** Highlight cursor for bar/area charts */
  highlight: { fill: "hsl(var(--muted))", opacity: 0.2 },
  /** No cursor for line charts */
  none: false,
} as const;

/**
 * Card variant presets for visual hierarchy
 */
export const CARD_VARIANTS = {
  /** Default card styling */
  default: "rounded-2xl",
  /** Hero/featured card with shadow */
  hero: "rounded-3xl shadow-md",
  /** Metric card with hover effect */
  metric: "rounded-2xl hover:shadow-sm transition-shadow",
} as const;

/**
 * Chart margin presets for consistent chart layouts
 */
export const CHART_MARGINS = {
  /** Default margins for most charts */
  default: { top: 20, right: 20, left: 20, bottom: 20 },
  /** Extended margins for charts with legends */
  withLegend: { top: 20, right: 30, left: 20, bottom: 40 },
  /** Minimal margins for sparklines */
  minimal: { top: 5, right: 5, left: 5, bottom: 5 },
} as const;

/**
 * Card padding presets
 */
export const CARD_PADDING = {
  /** Compact padding for metric cards */
  compact: "p-3",
  /** Standard padding for most cards */
  standard: "p-4",
  /** Large padding for hero cards */
  large: "p-6",
} as const;

/**
 * Animation duration tokens (in milliseconds)
 * Used with Framer Motion and CSS transitions
 */
export const ANIMATION_DURATION = {
  /** Fast transitions - hover states */
  fast: 150,
  /** Normal transitions - most animations */
  normal: 300,
  /** Slow transitions - entrance animations */
  slow: 500,
} as const;

/**
 * Type exports for type safety
 */
export type Spacing = keyof typeof SPACING;
export type Radius = keyof typeof RADIUS;
export type ChartHeight = keyof typeof CHART_HEIGHTS;
export type ChartMargin = keyof typeof CHART_MARGINS;
export type ChartGrid = keyof typeof CHART_GRID;
export type ChartCursor = keyof typeof CHART_CURSOR;
export type CardVariant = keyof typeof CARD_VARIANTS;
export type CardPadding = keyof typeof CARD_PADDING;
export type AnimationDuration = keyof typeof ANIMATION_DURATION;
