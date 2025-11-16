import baseSlugify from "slugify";

/**
 * Slugify a string with default options for URL-safe slugs.
 * Always converts to lowercase and strips special characters.
 *
 * @param input - String to slugify
 * @returns URL-safe slug
 *
 * @example
 * slugify("Singapore's Top Cars") // "singapores-top-cars"
 * slugify("Multi-purpose Vehicle") // "multi-purpose-vehicle"
 */
export const slugify = (input: string): string => {
  return baseSlugify(input, { lower: true, strict: true });
};
