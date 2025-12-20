import type { ReactNode } from "react";
import { OG_COLOURS } from "../colours";
import { OG_CONFIG } from "../config";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Base layout wrapper for OG images
 *
 * Provides light background with padding and font family
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        backgroundColor: OG_COLOURS.background,
        fontFamily: OG_CONFIG.fontFamily,
        padding: "80px 100px",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
