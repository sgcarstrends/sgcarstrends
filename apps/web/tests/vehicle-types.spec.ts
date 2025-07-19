import { test, expect } from "@playwright/test";

const vehicleTypes = [
  { slug: "hatchback", name: "Hatchback" },
  { slug: "sedan", name: "Sedan" },
  { slug: "sports-utility-vehicle", name: "Sports Utility Vehicle" },
];

test.describe("Vehicle Types Pages", () => {
  vehicleTypes.forEach(({ slug, name }) => {
    test.describe(`${name} Vehicle Type Page`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/cars/vehicle-types/${slug}`);
      });

      test(`should display ${name} overview trends chart`, async ({ page }) => {
        const chartContainer = page
          .locator('.chart-container, [aria-label*="chart"], canvas, svg')
          .first();
        await expect(chartContainer).toBeVisible();
      });

      test(`should handle query parameters for ${name} page`, async ({
        page,
      }) => {
        await page.goto(`/cars/vehicle-types/${slug}?month=2025-01`);

        await expect(page.locator("h1")).toContainText(name);
        await page.waitForLoadState("networkidle");
      });
    });
  });

  test("should navigate between vehicle type pages", async ({ page }) => {
    await page.goto("/cars/vehicle-types/sedan");

    const navigationLinks = page.locator('a[href*="/cars/vehicle-types/"]');
    const linkCount = await navigationLinks.count();

    if (linkCount > 0) {
      await navigationLinks.first().click();
      await page.waitForLoadState("networkidle");

      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("should handle empty data states for vehicle types", async ({
    page,
  }) => {
    await page.goto("/cars/vehicle-types/sedan?month=1900-01");

    await expect(page.locator("h1")).toContainText("Sedan");
    await page.waitForLoadState("networkidle");
  });

  test("should display data visualization elements", async ({ page }) => {
    await page.goto("/cars/vehicle-types/hatchback");

    const chartContainer = page
      .locator('.chart-container, [aria-label*="chart"], canvas, svg')
      .first();
    await expect(chartContainer).toBeVisible();

    await chartContainer.hover();
    await page.waitForTimeout(1000);
  });
});
