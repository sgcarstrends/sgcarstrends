import slugify from "@sindresorhus/slugify";

export const normaliseBrandName = (text: string): string => {
  const cleaned = text.replace(/-logo.*$/, "").replace(/^logo-/, "");
  return slugify(cleaned);
};
