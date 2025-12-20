import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { OG_CONFIG } from "./config";

/**
 * Load Geist fonts from local assets for OG images
 *
 * Returns bold (700) weight for headlines
 */
export async function getOGFonts() {
  const bold = await readFile(
    join(process.cwd(), "assets/fonts/Geist-Bold.ttf"),
  );

  return [
    {
      name: OG_CONFIG.fontFamily,
      data: bold,
      style: "normal" as const,
      weight: 700 as const,
    },
  ];
}
