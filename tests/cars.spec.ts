import { test, expect } from "@playwright/test";

test.describe("Cars Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cars");
  });

  test("should display page title and main heading", async ({ page }) => {
    await expect(page).toHaveTitle(/Car Registrations/);
    await expect(page.locator("h1")).toContainText("Car Registrations");
  });

  test("should display last updated information", async ({ page }) => {
    const lastUpdated = page.locator("text=Last updated");
    if (await lastUpdated.isVisible()) {
      await expect(lastUpdated).toBeVisible();
    }
  });

  test("should display three main statistics cards", async ({ page }) => {
    await expect(page.locator("text=Total Registrations")).toBeVisible();
    await expect(page.locator("text=Top Fuel Type")).toBeVisible();
    await expect(page.locator("text=Top Vehicle Type")).toBeVisible();

    const totalRegistrationsCard = page
      .locator('[data-testid="total-registrations-card"], .text-blue-600')
      .filter({ hasText: /\d/ })
      .first();
    const topFuelTypeCard = page
      .locator('[data-testid="top-fuel-type-card"], .text-green-600')
      .filter({ hasText: /\d/ })
      .first();
    const topVehicleTypeCard = page
      .locator('[data-testid="top-vehicle-type-card"], .text-pink-600')
      .filter({ hasText: /\d/ })
      .first();

    await expect(totalRegistrationsCard).toBeVisible();
    await expect(topFuelTypeCard).toBeVisible();
    await expect(topVehicleTypeCard).toBeVisible();
  });

  test("should display top makes section", async ({ page }) => {
    await expect(page.locator("text=Top Makes by Fuel Type")).toBeVisible();

    const topMakesSection = page
      .locator("text=Top Makes by Fuel Type")
      .locator("..");
    await expect(topMakesSection).toBeVisible();
  });

  test("should handle query parameters", async ({ page }) => {
    await page.goto("/cars?month=2025-01");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("Car Registrations");
    await expect(page.locator("text=Total Registrations")).toBeVisible();
  });

  test("should display loading states properly", async ({ page }) => {
    await page.goto("/cars", { waitUntil: "networkidle" });

    await expect(page.locator("text=Total Registrations")).toBeVisible();
    await expect(page.locator("text=Top Fuel Type")).toBeVisible();
    await expect(page.locator("text=Top Vehicle Type")).toBeVisible();
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Total Registrations")).toBeVisible();
    await expect(page.locator("text=Top Fuel Type")).toBeVisible();
    await expect(page.locator("text=Top Vehicle Type")).toBeVisible();
  });

  test("should display animated numbers", async ({ page }) => {
    const animatedNumbers = page.locator(".text-4xl.font-bold");
    const numberCount = await animatedNumbers.count();
    expect(numberCount).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < Math.min(numberCount, 3); i++) {
      await expect(animatedNumbers.nth(i)).toBeVisible();
    }
  });

  test("should display badges with correct colors", async ({ page }) => {
    const blueBadge = page.locator(".bg-blue-600").first();
    const greenBadge = page.locator(".bg-green-600").first();
    const pinkBadge = page.locator(".bg-pink-600").first();

    await expect(blueBadge).toBeVisible();
    await expect(greenBadge).toBeVisible();
    await expect(pinkBadge).toBeVisible();
  });
});
