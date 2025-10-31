import { cn } from "@web/lib/utils";
import React from "react";

/**
 * Typography System
 *
 * Modern, elegant design inspired by Vercel, Linear, and Stripe.
 * Uses lighter font weights and relies on size/spacing for hierarchy.
 *
 * Principles:
 * - Semibold (600) for primary headings
 * - Medium (500) for secondary headings and labels
 * - Normal (400) for body text
 * - Bold reserved for data emphasis (numbers, metrics)
 */

/**
 * H1 - Page titles
 *
 * Use for: Primary page heading (one per page)
 * Weight: Semibold (600)
 *
 * @example
 * <Typography.H1>COE Overview</Typography.H1>
 */
const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "scroll-m-20 font-semibold text-4xl tracking-tight lg:text-5xl",
      className,
    )}
    {...props}
  />
));
H1.displayName = "H1";

/**
 * H2 - Section titles
 *
 * Use for: Major sections, card groups
 * Weight: Semibold (600)
 *
 * @example
 * <Typography.H2>Fun Facts</Typography.H2>
 */
const H2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "scroll-m-20 font-semibold text-3xl tracking-tight first:mt-0",
      className,
    )}
    {...props}
  />
));
H2.displayName = "H2";

/**
 * H3 - Subsection titles
 *
 * Use for: Card titles, subsections
 * Weight: Medium (500) - lighter for better hierarchy
 *
 * @example
 * <Typography.H3>Category A vs B</Typography.H3>
 */
const H3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("scroll-m-20 font-medium text-2xl tracking-tight", className)}
    {...props}
  />
));
H3.displayName = "H3";

/**
 * H4 - Small headings
 *
 * Use for: Nested sections, list headers
 * Weight: Medium (500)
 *
 * @example
 * <Typography.H4>Latest PQP Rates</Typography.H4>
 */
const H4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("scroll-m-20 font-medium text-xl tracking-tight", className)}
    {...props}
  />
));
H4.displayName = "H4";

/**
 * BodyLarge - Emphasized body text
 *
 * Use for: Introductions, lead paragraphs
 * Weight: Normal (400)
 *
 * @example
 * <Typography.BodyLarge>Explore COE trends and analysis.</Typography.BodyLarge>
 */
const BodyLarge = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-lg leading-relaxed", className)}
    {...props}
  />
));
BodyLarge.displayName = "BodyLarge";

/**
 * Body - Standard body text
 *
 * Use for: Paragraphs, descriptions, general content
 * Weight: Normal (400)
 *
 * @example
 * <Typography.Body>The latest COE results show...</Typography.Body>
 */
const Body = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-base leading-7", className)} {...props} />
));
Body.displayName = "Body";

/**
 * BodySmall - Smaller body text
 *
 * Use for: Secondary descriptions, helper text
 * Weight: Normal (400)
 *
 * @example
 * <Typography.BodySmall>Updated daily from LTA</Typography.BodySmall>
 */
const BodySmall = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm leading-6", className)} {...props} />
));
BodySmall.displayName = "BodySmall";

/**
 * Label - UI labels
 *
 * Use for: Form labels, navigation items, tabs
 * Weight: Medium (500)
 *
 * @example
 * <Typography.Label>Select Month</Typography.Label>
 */
const Label = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("font-medium text-sm leading-none", className)}
    {...props}
  />
));
Label.displayName = "Label";

/**
 * Caption - Metadata text
 *
 * Use for: Timestamps, data sources, footnotes
 * Weight: Normal (400)
 *
 * @example
 * <Typography.Caption>Last updated: 29 Oct 2025</Typography.Caption>
 */
const Caption = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-muted-foreground text-xs leading-tight", className)}
    {...props}
  />
));
Caption.displayName = "Caption";

// Legacy components for backward compatibility
const P = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("not-first:mt-6 leading-7", className)}
    {...props}
  />
));
P.displayName = "P";

const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.HTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn("mt-6 border-l-2 pl-6 italic", className)}
    {...props}
  />
));
Blockquote.displayName = "Blockquote";

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
    {...props}
  />
));
List.displayName = "List";

const InlineCode = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-medium font-mono text-sm",
      className,
    )}
    {...props}
  />
));
InlineCode.displayName = "InlineCode";

const Lead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-xl leading-relaxed", className)}
    {...props}
  />
));
Lead.displayName = "Lead";

const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <small
      ref={ref}
      className={cn("font-medium text-sm leading-none", className)}
      {...props}
    />
  ),
);
Small.displayName = "Small";

const Muted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
Muted.displayName = "Muted";

const Typography = {
  // Modern variants
  H1,
  H2,
  H3,
  H4,
  BodyLarge,
  Body,
  BodySmall,
  Label,
  Caption,
  // Legacy variants
  P,
  Blockquote,
  List,
  InlineCode,
  Lead,
  Small,
  Muted,
};

export default Typography;
