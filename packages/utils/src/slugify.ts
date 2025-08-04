/**
 * Converts a string into a URL-friendly slug
 *
 * @param str - The string to be converted into a slug
 * @returns The slugified string
 */
export const slugify = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[\W_]+/g, "-");
};
