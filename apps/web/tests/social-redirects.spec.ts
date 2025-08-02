import { expect, test } from "@playwright/test";

test.describe("Social Media Redirects", () => {
  const socialPlatforms = [
    { path: "/twitter", expectedDomain: "x.com" },
    { path: "/instagram", expectedDomain: "instagram.com" },
    { path: "/linkedin", expectedDomain: "linkedin.com" },
    { path: "/telegram", expectedDomain: "t.me" },
    { path: "/github", expectedDomain: "github.com" },
    { path: "/discord", expectedDomain: "discord.com" },
  ];

  socialPlatforms.forEach(({ path, expectedDomain }) => {
    test(`should redirect ${path} to ${expectedDomain}`, async ({ page }) => {
      // Navigate to the redirect route and wait for redirect
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });

      expect(200).toEqual(response?.status());

      // Check that final URL contains expected domain
      expect(page.url()).toContain(expectedDomain);

      // Check that UTM parameters are present
      const url = new URL(page.url());
      expect(url.searchParams.get("utm_source")).toBe("sgcarstrends");
      expect(url.searchParams.get("utm_medium")).toBe("social_redirect");
      expect(url.searchParams.has("utm_campaign")).toBe(true);
    });
  });
});
