import { expect, test } from '@playwright/test';
import { swipe } from './utils';

test.describe('Onboarding Page', () => {
	test('should display all onboarding slides', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('text="DIDroom Wallet,"')).toBeVisible();
		await swipe(page);
		await expect(page.locator('text="Create your DID,"')).toBeVisible();
		await swipe(page);
		await expect(
			page.locator('text="Manage your verifiable credentials (VC) in one place,"')
		).toBeVisible();
	});

	test('should complete onboarding and navigate to register-login', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Skip' }).click();
		await expect(page).toHaveURL('/en/register-login');
		const isBoarded = await page.evaluate(() => localStorage.getItem('CapacitorStorage.isBoarded'));
		expect(isBoarded).toBe('true');
	});
});
