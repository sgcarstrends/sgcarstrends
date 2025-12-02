/**
 * Hero images for AI-generated blog posts
 * Singapore-focused Unsplash images for contextual relevance
 */

export const HERO_IMAGES = {
  cars: "https://images.unsplash.com/photo-1519043916581-33ecfdba3b1c", // Singapore highway with cars
  coe: "https://images.unsplash.com/photo-1519045550819-021aa92e9312", // Marina Bay Sands beside road
} as const;

/**
 * Get hero image URL for a data type with size parameters
 * @param dataType - "cars" or "coe"
 * @returns Full Unsplash URL with crop parameters for hero display (1200x514)
 */
export function getHeroImage(dataType: "cars" | "coe"): string {
  return `${HERO_IMAGES[dataType]}?w=1200&h=514&fit=crop`;
}
