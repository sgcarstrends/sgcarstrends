import { test, expect } from "@playwright/test";

const fuelTypes = [
  { slug: "petrol", name: "Petrol" },
  { slug: "electric", name: "Electric" },
  { slug: "diesel", name: "Diesel" },
];

test.describe("Fuel Types Pages", () => {
  fuelTypes.forEach(({ slug, name }) => {
    test.describe(`${name} Fuel Type Page`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/cars/fuel-types/${slug}`);
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
        await page.goto(`/cars/fuel-types/${slug}?month=2025-01`);

        await expect(page.locator("h1")).toContainText(name);
        await page.waitForLoadState("networkidle");
      });
    });
  });

  test("should navigate between fuel type pages", async ({ page }) => {
    await page.goto("/cars/fuel-types/petrol");

    const navigationLinks = page.locator('a[href*="/cars/fuel-types/"]');
    const linkCount = await navigationLinks.count();

    if (linkCount > 0) {
      await navigationLinks.first().click();
      await page.waitForLoadState("networkidle");

      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("should handle empty data states for fuel types", async ({ page }) => {
    await page.goto("/cars/fuel-types/petrol?month=1900-01");

    await expect(page.locator("h1")).toContainText("Petrol");
    await page.waitForLoadState("networkidle");
  });
});
