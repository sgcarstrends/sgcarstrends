import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { OG_CONFIG } from "./config";

const FONT_DIR = join(process.cwd(), "assets/fonts");

const WEIGHTS = [
  { weight: 500, file: "Urbanist-Medium.ttf" },
  { weight: 600, file: "Urbanist-SemiBold.ttf" },
  { weight: 700, file: "Urbanist-Bold.ttf" },
  { weight: 800, file: "Urbanist-ExtraBold.ttf" },
] as const;

const fontFiles = Promise.all(
  WEIGHTS.map(async ({ weight, file }) => ({
    name: OG_CONFIG.fontFamily,
    data: await readFile(join(FONT_DIR, file)),
    style: "normal" as const,
    weight,
  })),
);

/**
 * Urbanist weights used by the share cards. The files are read once per
 * module instance and shared by every image route.
 */
export function getOGFonts() {
  return fontFiles;
}
