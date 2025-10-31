import Typography from "@web/components/typography";
import type { ComponentPropsWithoutRef } from "react";

/**
 * MDX Components Mapping
 *
 * Maps MDX/Markdown HTML elements to our custom Typography components.
 * This ensures all blog content uses the modern, elegant typography system.
 *
 * Used by MDXRemote in blog post rendering.
 */
export const mdxComponents = {
  // Headings
  h1: (props: ComponentPropsWithoutRef<"h1">) => <Typography.H1 {...props} />,
  h2: (props: ComponentPropsWithoutRef<"h2">) => <Typography.H2 {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <Typography.H3 {...props} />,
  h4: (props: ComponentPropsWithoutRef<"h4">) => <Typography.H4 {...props} />,

  // Body text
  p: (props: ComponentPropsWithoutRef<"p">) => <Typography.Text {...props} />,

  // Blockquotes and lists (use legacy components for markdown compatibility)
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <Typography.Blockquote {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => <Typography.List {...props} />,

  // Code (inline)
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <Typography.InlineCode {...props} />
  ),

  // Links - styled for blog content
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
    />
  ),

  // Tables - keep prose styling for markdown tables
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      scope="col"
      className="border border-border px-4 py-2 text-left font-semibold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),

  // Horizontal rule
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-8 border-border" {...props} />
  ),

  // Pre-formatted code blocks - keep default prose styling
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre className="my-6 overflow-x-auto rounded-lg bg-muted p-4" {...props} />
  ),
};
