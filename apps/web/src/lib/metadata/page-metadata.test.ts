import { SITE_TITLE, SITE_URL } from "@web/config";
import { describe, expect, it } from "vitest";
import { createPageMetadata } from "./page-metadata";

describe("Metadata Utilities", () => {
  describe("createPageMetadata", () => {
    it("should create basic metadata without optional fields", () => {
      const result = createPageMetadata({
        title: "COE Results",
        description: "Latest COE bidding results for Singapore",
        canonical: "/coe/results",
      });

      expect(result).toEqual({
        title: "COE Results",
        description: "Latest COE bidding results for Singapore",
        openGraph: {
          title: "COE Results",
          description: "Latest COE bidding results for Singapore",
          url: `${SITE_URL}/coe/results`,
          siteName: SITE_TITLE,
          locale: "en_SG",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: "COE Results",
          description: "Latest COE bidding results for Singapore",
          site: "@sgcarstrends",
          creator: "@sgcarstrends",
        },
        alternates: {
          canonical: "/coe/results",
        },
      });
    });

    it("should include images when provided", () => {
      const images = "/api/og?title=Test";

      const result = createPageMetadata({
        title: "Test Page",
        description: "Test description",
        canonical: "/test",
        images,
      });

      expect(result.openGraph?.images).toBe(images);
      expect(result.twitter?.images).toBe(images);
    });

    it("should include keywords when provided", () => {
      const keywords = [
        "Singapore car registration",
        "COE results",
        "automotive statistics",
      ];

      const result = createPageMetadata({
        title: "Cars",
        description: "Car statistics",
        canonical: "/cars",
        keywords,
      });

      expect(result.keywords).toEqual(keywords);
    });

    it("should include author information when requested", () => {
      const result = createPageMetadata({
        title: "Cars",
        description: "Car statistics",
        canonical: "/cars",
        includeAuthors: true,
      });

      expect(result.authors).toEqual([
        { name: "SG Cars Trends", url: SITE_URL },
      ]);
      expect(result.creator).toBe("SG Cars Trends");
      expect(result.publisher).toBe("SG Cars Trends");
    });

    it("should not include author information by default", () => {
      const result = createPageMetadata({
        title: "Cars",
        description: "Car statistics",
        canonical: "/cars",
      });

      expect(result.authors).toBeUndefined();
      expect(result.creator).toBeUndefined();
      expect(result.publisher).toBeUndefined();
    });

    it("should handle canonical URLs with query parameters", () => {
      const result = createPageMetadata({
        title: "Cars - January 2024",
        description: "Car statistics for January 2024",
        canonical: "/cars?month=2024-01",
      });

      expect(result.openGraph?.url).toBe(`${SITE_URL}/cars?month=2024-01`);
      expect(result.alternates?.canonical).toBe("/cars?month=2024-01");
    });

    it("should handle array of images", () => {
      const images = ["/api/og?v=1", "/api/og?v=2"];

      const result = createPageMetadata({
        title: "Test",
        description: "Test",
        canonical: "/test",
        images,
      });

      expect(result.openGraph?.images).toEqual(images);
      expect(result.twitter?.images).toEqual(images);
    });

    it("should create complete metadata with all options", () => {
      const result = createPageMetadata({
        title: "Car Registrations",
        description: "Singapore car registration statistics",
        canonical: "/cars?month=2024-01",
        images: "/api/og?title=Cars",
        includeAuthors: true,
      });

      expect(result).toMatchObject({
        title: "Car Registrations",
        description: "Singapore car registration statistics",
        authors: [{ name: "SG Cars Trends", url: SITE_URL }],
        creator: "SG Cars Trends",
        publisher: "SG Cars Trends",
      });
      expect(result.openGraph?.images).toBe("/api/og?title=Cars");
      expect(result.twitter?.images).toBe("/api/og?title=Cars");
    });
  });
});
