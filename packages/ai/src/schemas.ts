import { z } from "zod";

export const highlightSchema = z.object({
  value: z.string().describe('Metric value, e.g. "52.60%", "$125,000"'),
  label: z.string().describe('Short label, e.g. "Electric Vehicles Lead"'),
  detail: z.string().describe('Context, e.g. "2,081 units registered"'),
});

export const postSchema = z.object({
  title: z.string().max(100).describe("SEO title, max 60 chars preferred"),
  excerpt: z
    .string()
    .max(500)
    .describe(
      "2-3 sentence summary for meta description, ideally under 300 chars",
    ),
  content: z.string().describe("Full markdown blog post (without H1 title)"),
  tags: z
    .array(z.string())
    .min(1)
    .max(10)
    .describe(
      '3-5 tags in Title Case: first tag is dataType ("Cars" or "COE"), followed by 2-4 generic topic tags',
    ),
  highlights: z
    .array(highlightSchema)
    .min(3)
    .max(10)
    .describe("3-6 key statistics for visual display"),
});

export type GeneratedPost = z.infer<typeof postSchema>;
export type Highlight = z.infer<typeof highlightSchema>;
