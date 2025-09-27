import { describe, expect, it } from "vitest";
import { createExternalCampaignURL } from "../utm";

describe("UTM", () => {
  describe("createExternalCampaignURL", () => {
    it("should add UTM parameters for email newsletter", () => {
      const result = createExternalCampaignURL("/cars", {
        source: "newsletter",
        medium: "email",
        campaign: "monthly_report",
      });

      expect(result).toBe(
        "/cars?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_report",
      );
    });

    it("should add UTM parameters for social media campaigns", () => {
      const result = createExternalCampaignURL(
        "/blog/coe-results-january-2024",
        {
          source: "linkedin",
          medium: "social",
          campaign: "blog",
          content: "company_post",
        },
      );

      expect(result).toBe(
        "/blog/coe-results-january-2024?utm_source=linkedin&utm_medium=social&utm_campaign=blog&utm_content=company_post",
      );
    });

    it("should handle URLs with existing query parameters", () => {
      const result = createExternalCampaignURL("/cars?month=2024-01", {
        source: "telegram",
        medium: "social",
        campaign: "data_update",
      });

      expect(result).toBe(
        "/cars?month=2024-01&utm_source=telegram&utm_medium=social&utm_campaign=data_update",
      );
    });

    it("should skip undefined UTM parameters", () => {
      const result = createExternalCampaignURL("/coe", {
        source: "discord",
        campaign: "announcement",
      });

      expect(result).toBe("/coe?utm_source=discord&utm_campaign=announcement");
    });

    it("should include all 5 UTM parameters for referral tracking", () => {
      const result = createExternalCampaignURL("/coe", {
        source: "twitter",
        medium: "social",
        campaign: "blog",
        term: "coe_bidding_results",
        content: "thread_post",
      });

      expect(result).toBe(
        "/coe?utm_source=twitter&utm_medium=social&utm_campaign=blog&utm_term=coe_bidding_results&utm_content=thread_post",
      );
    });
  });
});
