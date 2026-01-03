import { describe, expect, it } from "vitest";
import { addUTMParametersToURL, createSocialShareURL } from "./utm";

describe("UTM", () => {
  describe("addUTMParametersToURL", () => {
    it("should add UTM parameters for social media", () => {
      const result = addUTMParametersToURL(
        "https://sgcarstrends.com/blog/test",
        "LinkedIn",
      );

      expect(result).toBe(
        "https://sgcarstrends.com/blog/test?utm_source=linkedin&utm_medium=social&utm_campaign=blog",
      );
    });

    it("should add term parameter when provided", () => {
      const result = addUTMParametersToURL(
        "https://sgcarstrends.com/coe",
        "Twitter",
        undefined,
        "coe_results",
      );

      expect(result).toBe(
        "https://sgcarstrends.com/coe?utm_source=twitter&utm_medium=social&utm_campaign=blog&utm_term=coe_results",
      );
    });

    it("should add content parameter when provided", () => {
      const result = addUTMParametersToURL(
        "https://sgcarstrends.com/cars",
        "LinkedIn",
        "post_content",
      );

      expect(result).toBe(
        "https://sgcarstrends.com/cars?utm_source=linkedin&utm_medium=social&utm_campaign=blog&utm_content=post_content",
      );
    });

    it("should include all UTM parameters when all are provided", () => {
      const result = addUTMParametersToURL(
        "https://sgcarstrends.com/coe",
        "Telegram",
        "thread_post",
        "coe_bidding_results",
      );

      expect(result).toBe(
        "https://sgcarstrends.com/coe?utm_source=telegram&utm_medium=social&utm_campaign=blog&utm_term=coe_bidding_results&utm_content=thread_post",
      );
    });
  });

  describe("createSocialShareURL", () => {
    it("should create social share URL with UTM parameters", () => {
      const result = createSocialShareURL(
        "https://sgcarstrends.com/blog/post",
        "LinkedIn",
      );

      expect(result).toBe(
        "https://sgcarstrends.com/blog/post?utm_source=linkedin&utm_medium=social&utm_campaign=blog",
      );
    });
  });
});
