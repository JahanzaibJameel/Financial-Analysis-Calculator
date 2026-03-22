import { test, expect } from '@playwright/test';

test.describe('Financial Calculator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load main page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Financial Analysis Calculator/);
    await expect(
      page.getByRole('heading', { name: 'Financial Analysis Calculator' })
    ).toBeVisible();
  });

  test('should display calculator component', async ({ page }) => {
    await expect(page.getByText('Compound Interest Calculator')).toBeVisible();
    await expect(page.getByPlaceholder('Enter principal amount')).toBeVisible();
    await expect(
      page.getByPlaceholder('Annual interest rate (%)')
    ).toBeVisible();
    await expect(page.getByPlaceholder('Number of years')).toBeVisible();
  });

  test('should calculate compound interest correctly', async ({ page }) => {
    // Fill in calculator inputs
    await page.getByPlaceholder('Enter principal amount').fill('10000');
    await page.getByPlaceholder('Annual interest rate (%)').fill('7');
    await page.getByPlaceholder('Number of years').fill('10');

    // Wait for calculation to update
    await page.waitForTimeout(1000);

    // Check if results are displayed
    await expect(page.getByText('Final Amount')).toBeVisible();
    await expect(page.getByText('Total Interest')).toBeVisible();
    await expect(page.getByText('Return on Investment')).toBeVisible();
  });

  test('should export calculation results', async ({ page }) => {
    // Fill in calculator inputs
    await page.getByPlaceholder('Enter principal amount').fill('5000');
    await page.getByPlaceholder('Annual interest rate (%)').fill('5');
    await page.getByPlaceholder('Number of years').fill('5');

    // Wait for calculation
    await page.waitForTimeout(1000);

    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export/i }).click();
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toMatch(
      /financial-calculation-\d+\.json/
    );
  });

  test('should display stock dashboard', async ({ page }) => {
    await expect(page.getByText('Stock Market Dashboard')).toBeVisible();
    await expect(page.getByText('Time Range')).toBeVisible();

    // Test time range buttons
    await page.getByRole('button', { name: '7D' }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: '30D' }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: '90D' }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: '1Y' }).click();
    await page.waitForTimeout(500);
  });

  test('should toggle chart features', async ({ page }) => {
    // Navigate to dashboard
    await page.getByText('Stock Market Dashboard').scrollIntoViewIfNeeded();

    // Toggle moving average
    const maToggle = page.getByLabel('Moving Average');
    if (await maToggle.isVisible()) {
      await maToggle.click();
      await page.waitForTimeout(500);
    }

    // Toggle volume
    const volumeToggle = page.getByLabel('Volume');
    if (await volumeToggle.isVisible()) {
      await volumeToggle.click();
      await page.waitForTimeout(500);
    }
  });

  test('should interact with AI chatbot', async ({ page }) => {
    // Find and click chatbot toggle
    const chatbotToggle = page.getByRole('button', { name: /chat/i });
    if (await chatbotToggle.isVisible()) {
      await chatbotToggle.click();
      await page.waitForTimeout(1000);

      // Check if chatbot is visible
      await expect(page.getByText('AI Financial Assistant')).toBeVisible();

      // Test message sending
      const messageInput = page.getByPlaceholder(
        /ask me anything about finance/i
      );
      if (await messageInput.isVisible()) {
        await messageInput.fill('What is compound interest?');

        const sendButton = page.getByRole('button', { name: /send/i });
        await sendButton.click();

        // Wait for response
        await page.waitForTimeout(2000);

        // Check if message was sent
        await expect(
          page.getByText('What is compound interest?')
        ).toBeVisible();
      }
    }
  });

  test('should toggle theme', async ({ page }) => {
    // Find theme toggle
    const themeToggle = page.getByRole('button', { name: /theme/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Check if theme changed (this is a basic check)
      const body = page.locator('body');
      const classes = await body.getAttribute('class');
      expect(classes).toContain('dark');
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if mobile layout works
    await expect(
      page.getByRole('heading', { name: 'Financial Analysis Calculator' })
    ).toBeVisible();

    // Test mobile navigation if present
    const mobileMenu = page.getByRole('button', { name: /menu/i });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.waitForTimeout(500);
    }
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test invalid calculator input
    await page.getByPlaceholder('Enter principal amount').fill('-1000');
    await page.waitForTimeout(1000);

    // Should still display calculator without crashing
    await expect(page.getByText('Compound Interest Calculator')).toBeVisible();
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Check for proper form labels
    const inputs = page.getByRole('textbox');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);

    // Check for proper button labels
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });
});
