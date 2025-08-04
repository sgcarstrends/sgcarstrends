/**
 * Converts a string into a URL-friendly slug
 *
 * @param {string} str - The string to be converted into a slug
 * @returns {string} The slugified string
 */
export const slugify = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[\W_]+/g, "-");
};
