import { addUTMParametersToURL, createSocialShareURL } from "@api/utils/utm";
import { describe, expect, it } from "vitest";

describe("UTM utilities", () => {
  describe("addUTMParametersToURL", () => {
    it("should add UTM parameters to a base URL", () => {
      const result = addUTMParametersToURL(
        "https://sgcarstrends.com/cars",
        "LinkedIn",
      );

      expect(result).toBe(
        "https://sgcarstrends.com/cars?utm_source=linkedin&utm_medium=social&utm_campaign=blog",
      );
    });

    it("should add UTM parameters with content", () => {
      const result = addUTMParametersToURL(
        "https://sgcarstrends.com/blog/post-slug",
        "Twitter",
        "blog_post",
      );

      expect(result).toBe(
        "https://sgcarstrends.com/blog/post-slug?utm_source=twitter&utm_medium=social&utm_campaign=blog&utm_content=blog_post",
      );
    });

    it("should handle URLs with existing query parameters", () => {
      const result = addUTMParametersToURL(
        "https://sgcarstrends.com/cars?month=2024-01",
        "Discord",
      );

      expect(result).toBe(
        "https://sgcarstrends.com/cars?month=2024-01&utm_source=discord&utm_medium=social&utm_campaign=blog",
      );
    });
  });

  describe("createSocialShareURL", () => {
    it("should create a social share URL", () => {
      const result = createSocialShareURL(
        "https://sgcarstrends.com/coe",
        "Telegram",
        "coe_data",
      );

      expect(result).toBe(
        "https://sgcarstrends.com/coe?utm_source=telegram&utm_medium=social&utm_campaign=blog&utm_content=coe_data",
      );
    });
  });
});
