import { slugify } from "@sgcarstrends/utils";

export const normaliseMake = (text: string): string => {
  const cleaned = text.replace(/^logo-|-logo.+$|-logo$/, "");
  return slugify(cleaned);
};
