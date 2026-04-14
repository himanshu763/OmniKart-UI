import { test, expect } from '@playwright/test';

const MOCK_RESPONSE = {
  results: [
    {
      product: {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        price: '₹24,990',
        productUrl: 'https://amazon.in/dp/B0C1',
      },
      platform: 'amazon',
      status: 'success',
    },
    {
      product: { title: 'T', price: '1', productUrl: 'https://flipkart.com/p/1' },
      platform: 'flipkart',
      status: 'skipped',
    },
  ],
  similarProducts: [
    {
      product: {
        title: 'Bose QuietComfort 45',
        price: '₹22,500',
        productUrl: 'https://flipkart.com/p/bose',
      },
      platform: 'flipkart',
      confidence: 0.88,
    },
  ],
};

test.describe('Happy path — product comparison', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the API so the test never hits a real backend
    await page.route('**/api/compare', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_RESPONSE),
      });
    });
  });

  test('page loads with correct title and search form', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/omnikart/i);
    await expect(page.getByRole('textbox', { name: /product url/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /compare prices/i })).toBeVisible();
  });

  test('submitting a URL shows at least one result card', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('textbox', { name: /product url/i }).fill('https://amazon.in/dp/B0C1');
    await page.getByRole('button', { name: /compare prices/i }).click();

    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 5000 });
  });

  test('primary product title is displayed after search', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('textbox', { name: /product url/i }).fill('https://amazon.in/dp/B0C1');
    await page.getByRole('button', { name: /compare prices/i }).click();

    await expect(page.getByText('Sony WH-1000XM5 Wireless Headphones')).toBeVisible({
      timeout: 5000,
    });
  });

  test('Visit Store link has correct href and opens in new tab', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('textbox', { name: /product url/i }).fill('https://amazon.in/dp/B0C1');
    await page.getByRole('button', { name: /compare prices/i }).click();

    const visitLink = page.getByRole('link', { name: /visit store/i });
    await expect(visitLink).toBeVisible({ timeout: 5000 });
    await expect(visitLink).toHaveAttribute('href', 'https://amazon.in/dp/B0C1');
    await expect(visitLink).toHaveAttribute('target', '_blank');
    await expect(visitLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('scanner status sidebar is visible after search', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('textbox', { name: /product url/i }).fill('https://amazon.in/dp/B0C1');
    await page.getByRole('button', { name: /compare prices/i }).click();

    await expect(page.getByText(/scanner status/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Error state', () => {
  test('shows error banner when API returns 500', async ({ page }) => {
    await page.route('**/api/compare', async (route) => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.goto('/');
    await page.getByRole('textbox', { name: /product url/i }).fill('https://amazon.in/dp/B0C1');
    await page.getByRole('button', { name: /compare prices/i }).click();

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('alert')).toContainText(/failed to fetch/i);
  });
});

test.describe('404 route', () => {
  test('unknown URL shows the Not Found page', async ({ page }) => {
    await page.goto('/definitely-does-not-exist');
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /back to search/i })).toBeVisible();
  });
});
