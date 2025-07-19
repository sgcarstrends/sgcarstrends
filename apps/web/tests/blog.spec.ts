import { test, expect } from "@playwright/test";

test.describe("Blog", () => {
  test.describe("Blog listing page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/blog");
    });

    test("should display page title and heading", async ({ page }) => {
      await expect(page).toHaveTitle(/Blog/);
      await expect(page.locator("h1")).toContainText("Blog");
    });

    test("should display featured badges when featured posts exist", async ({
      page,
    }) => {
      const featuredBadge = page.locator("text=Featured").first();
      const badgeCount = await featuredBadge.count();

      if (badgeCount > 0) {
        await expect(featuredBadge).toBeVisible();
      }
    });

    test("should navigate to individual blog post when clicked", async ({
      page,
    }) => {
      const postLinks = page
        .locator('a[href^="/blog/"]')
        .filter({ hasNotText: "Back" });
      const linkCount = await postLinks.count();

      if (linkCount > 0) {
        const firstLink = postLinks.first();
        const href = await firstLink.getAttribute("href");

        await firstLink.click();
        await expect(page).toHaveURL(href);
      }
    });
  });

  test.describe("Individual blog post functionality", () => {
    test("should display formatted content with headings when content exists", async ({
      page,
    }) => {
      await page.goto("/blog");

      const postLinks = page
        .locator('a[href^="/blog/"]')
        .filter({ hasNotText: "Back" });
      const linkCount = await postLinks.count();

      if (linkCount > 0) {
        await postLinks.first().click();

        const headings = page.locator("h2, h3, h4");
        const headingCount = await headings.count();

        if (headingCount > 0) {
          await expect(headings.first()).toBeVisible();
        }
      }
    });
  });
});
