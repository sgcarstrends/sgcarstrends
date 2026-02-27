import { readFileSync } from "node:fs";
import { join } from "node:path";
import { OG_CONFIG } from "./config";

/**
 * Load Geist fonts from local assets for OG images
 *
 * Uses synchronous readFileSync so the operation completes during
 * prerendering with Next.js 16 Cache Components.
 */
export function getOGFonts() {
  const bold = readFileSync(join(process.cwd(), "assets/fonts/Geist-Bold.ttf"));

  return [
    {
      name: OG_CONFIG.fontFamily,
      data: bold,
      style: "normal" as const,
      weight: 700 as const,
    },
  ];
}
