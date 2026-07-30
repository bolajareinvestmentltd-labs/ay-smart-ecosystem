const { test, expect } = require('@playwright/test');

test('hostel, register, dashboard load', async ({ page }) => {
  await page.goto('/hostel');
  await expect(page.locator('text=Hostel accommodation request')).toHaveCount(1);

  await page.goto('/register');
  await expect(page.locator('text=Create your AY')).toHaveCount(1);

  await page.goto('/dashboard');
  await expect(page.locator('text=Create a listing')).toHaveCount(1);
});
