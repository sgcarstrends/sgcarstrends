import { expect, test } from "@playwright/test";

test.describe("COE PQP Rates", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/coe/pqp");
  });

  test("should display page title and main heading", async ({ page }) => {
    await expect(page).toHaveTitle(/COE.*PQP/);
    await expect(page.locator("h1")).toContainText("PQP");
  });

  test("should display PQP data table", async ({ page }) => {
    const dataTable = page.locator("table");
    await expect(dataTable).toBeVisible();

    const tableHeaders = page.locator("th");
    const headerCount = await tableHeaders.count();
    expect(headerCount).toBeGreaterThan(0);
  });

  test("should display alert information", async ({ page }) => {
    const alertContainer = page.locator('.alert, [role="alert"]');
    const alertCount = await alertContainer.count();

    if (alertCount > 0) {
      await expect(alertContainer.first()).toBeVisible();
      await expect(alertContainer.first()).toContainText(/PQP|quota|premium/i);
    }
  });

  test("should handle table column sorting", async ({ page }) => {
    const sortableHeaders = page.locator(
      'th[role="button"], th.sortable, th button',
    );
    const sortableCount = await sortableHeaders.count();

    if (sortableCount > 0) {
      await sortableHeaders.first().click();
      await page.waitForLoadState("networkidle");

      const dataTable = page.locator("table");
      await expect(dataTable).toBeVisible();
    }
  });

  test("should display column data correctly", async ({ page }) => {
    const dataTable = page.locator("table");
    await expect(dataTable).toBeVisible();

    const dataCells = page.locator("td");
    const cellCount = await dataCells.count();

    if (cellCount > 0) {
      await expect(dataCells.first()).toBeVisible();
    }
  });

  test("should handle filtering if available", async ({ page }) => {
    const filterInput = page.locator(
      'input[placeholder*="filter"], input[placeholder*="search"]',
    );
    const filterCount = await filterInput.count();

    if (filterCount > 0) {
      await filterInput.first().fill("Category A");
      await page.waitForTimeout(1000);

      const dataTable = page.locator("table");
      await expect(dataTable).toBeVisible();
    }
  });

  test("should display pagination if data is large", async ({ page }) => {
    const pagination = page.locator(
      '.pagination, nav[aria-label*="pagination"]',
    );
    const paginationCount = await pagination.count();

    if (paginationCount > 0) {
      await expect(pagination.first()).toBeVisible();

      const nextButton = page.locator(
        'button:has-text("Next"), button[aria-label*="next"]',
      );
      const nextCount = await nextButton.count();

      if (nextCount > 0) {
        await nextButton.first().click();
        await page.waitForLoadState("networkidle");

        const dataTable = page.locator("table");
        await expect(dataTable).toBeVisible();
      }
    }
  });

  test("should handle empty data states", async ({ page }) => {
    await page.goto("/coe/pqp?category=invalid");

    await expect(page.locator("h1")).toContainText("PQP");
    await page.waitForLoadState("networkidle");
  });

  test("should be responsive on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await expect(page.locator("h1")).toBeVisible();

    const dataTable = page.locator("table");
    await expect(dataTable).toBeVisible();
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator("h1")).toBeVisible();

    const dataTable = page.locator("table");
    await expect(dataTable).toBeVisible();
  });

  test("should handle query parameters correctly", async ({ page }) => {
    await page.goto("/coe/pqp?category=A&year=2025");

    await expect(page.locator("h1")).toContainText("PQP");

    const dataTable = page.locator("table");
    await expect(dataTable).toBeVisible();
  });

  test("should display loading states properly", async ({ page }) => {
    await page.goto("/coe/pqp", { waitUntil: "networkidle" });

    const dataTable = page.locator("table");
    await expect(dataTable).toBeVisible();
  });
});
