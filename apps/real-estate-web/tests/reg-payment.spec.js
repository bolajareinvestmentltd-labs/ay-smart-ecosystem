const { test, expect } = require('@playwright/test');

// Registration -> Payment flow with API mocking (no backend required)
// Requires the dev server to be running at http://localhost:3000

test.describe('Registration -> Payment (mocked API)', () => {
  test('user can register and complete a payment (APIs mocked)', async ({ page }) => {
    // Mock register endpoint
    await page.route('**/api/auth/register/', async (route, request) => {
      if (request.method().toUpperCase() !== 'POST') return route.continue();
      const body = { id: 123, username: 'testuser', email: 'testuser@example.com' };
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(body) });
    });

    // Mock payment initiate
    await page.route('**/api/payments/initiate/', async (route, request) => {
      if (request.method().toUpperCase() !== 'POST') return route.continue();
      const body = {
        id: 999,
        user: 123,
        plan: 'basic',
        amount: '3500',
        provider: 'paystack',
        provider_reference: 'mock-pay-ref-999',
        status: 'PENDING',
      };
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(body) });
    });

    // Mock payment verify
    await page.route('**/api/payments/verify/', async (route, request) => {
      if (request.method().toUpperCase() !== 'POST') return route.continue();
      const body = {
        id: 999,
        provider_reference: 'mock-pay-ref-999',
        status: 'SUCCESS',
      };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
    });

    // Go to register page and submit the form
    await page.goto('/register');
    await page.fill('input[placeholder="Full name"]', 'Playwright Tester');
    await page.fill('input[placeholder="Username"]', 'testuser');
    await page.fill('input[placeholder="Email address"]', 'testuser@example.com');
    await page.fill('input[placeholder="Active phone number"]', '+2348000000000');
    await page.fill('input[placeholder="Password"]', 'secret123');
    await page.fill('input[placeholder="Confirm password"]', 'secret123');
    await page.click('button:has-text("Create account")');

    // After successful register the app redirects to /auth/login
    await expect(page).toHaveURL(/.*\/auth\/login/);

    // Navigate to payments and complete a payment
    await page.goto('/payments');
    // Click the first Pay button
    await page.click('button:has-text("Pay with Paystack")');

    // Message should indicate completion
    await expect(page.locator('text=Payment completed')).toHaveCount(1);
  });
});
