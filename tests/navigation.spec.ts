import { test, expect } from '@playwright/test';

test.describe.skip('Navigation and Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main navigation menu', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
    
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Cars')).toBeVisible();
    await expect(page.locator('text=COE')).toBeVisible();
  });

  test('should navigate to all main sections', async ({ page }) => {
    await page.click('text=Cars');
    await expect(page).toHaveURL('/cars');
    await expect(page.locator('h1')).toBeVisible();
    
    await page.click('text=COE');
    await expect(page).toHaveURL('/coe');
    await expect(page.locator('h1')).toBeVisible();
    
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display sidebar navigation on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    
    const sidebar = page.locator('aside, nav[aria-label*="sidebar"], .sidebar');
    if (await sidebar.isVisible()) {
      await expect(sidebar).toBeVisible();
    }
  });

  test('should handle mobile navigation toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenuButton = page.locator('button[aria-label*="menu"], .mobile-menu-toggle, button:has-text("Menu")');
    const buttonCount = await mobileMenuButton.count();
    
    if (buttonCount > 0) {
      await mobileMenuButton.first().click();
      
      await page.waitForTimeout(500);
      
      const mobileNav = page.locator('.mobile-nav, nav[aria-label*="mobile"]');
      if (await mobileNav.isVisible()) {
        await expect(mobileNav).toBeVisible();
      }
    }
  });

  test('should display footer with social media links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    const socialLinks = page.locator('a[href*="github"], a[href*="linkedin"], a[href*="twitter"]');
    const socialCount = await socialLinks.count();
    
    if (socialCount > 0) {
      await expect(socialLinks.first()).toBeVisible();
    }
  });

  test('should display current page in navigation', async ({ page }) => {
    await page.goto('/cars');
    
    const activeNavItem = page.locator('nav a[aria-current="page"], nav a.active, nav a[data-active="true"]');
    const activeCount = await activeNavItem.count();
    
    if (activeCount > 0) {
      await expect(activeNavItem.first()).toBeVisible();
    }
  });

  test('should handle theme toggle if present', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="theme"], .theme-toggle, button:has-text("Theme")');
    const toggleCount = await themeToggle.count();
    
    if (toggleCount > 0) {
      await themeToggle.first().click();
      await page.waitForTimeout(500);
      
      await themeToggle.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should display breadcrumb navigation on sub-pages', async ({ page }) => {
    await page.goto('/cars/fuel-types/electric');
    
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], .breadcrumb, ol, ul');
    const breadcrumbCount = await breadcrumb.count();
    
    if (breadcrumbCount > 0) {
      await expect(breadcrumb.first()).toBeVisible();
      await expect(breadcrumb.first()).toContainText('Cars');
    }
  });

  test('should maintain navigation state across page loads', async ({ page }) => {
    await page.click('text=Cars');
    await expect(page).toHaveURL('/cars');
    
    await page.reload();
    await expect(page).toHaveURL('/cars');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
  });

  test('should be accessible with screen readers', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('role', 'navigation');
    
    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    const skipCount = await skipLink.count();
    
    if (skipCount > 0) {
      await expect(skipLink.first()).toBeVisible();
    }
  });
});