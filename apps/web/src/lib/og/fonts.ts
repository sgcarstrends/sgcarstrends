import { readFileSync } from "node:fs";
import { join } from "node:path";
import { OG_CONFIG } from "./config";

const boldFont = readFileSync(
  join(process.cwd(), "assets/fonts/Geist-Bold.ttf"),
);

export function getOGFonts() {
  return [
    {
      name: OG_CONFIG.fontFamily,
      data: boldFont,
      style: "normal" as const,
      weight: 700 as const,
    },
  ];
}
