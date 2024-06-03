import { expect, test } from '@playwright/test';



test('ll', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
