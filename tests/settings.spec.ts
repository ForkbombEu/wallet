import { expect, test } from '@playwright/test';
import { login } from './utils';

test.describe('Settings', () => {
	test('should open and close settings modal', async ({ page }) => {
		await login(page);
		await page.locator('ion-tab-bar d-tab-button:has-text("Profile")').click();
		await page.getByRole('banner').locator('ion-button').click();
		await expect(page.locator('ion-modal')).toBeVisible();
		await page.locator('ion-button:has-text("Close")').click();
		await expect(page.locator('ion-modal')).not.toBeVisible();
	});

	test('should navigate to language settings', async ({ page }) => {
		await login(page);
		await page.locator('ion-tab-bar d-tab-button:has-text("Profile")').click();
		await page.getByRole('banner').locator('ion-button').click();
		await page.locator('d-button:has-text("Languages")').click();
		await expect(page).toHaveURL('/en/languages');
	});

	test('should logout from the app', async ({ page }) => {
		await login(page);
		await page.locator('ion-tab-bar d-tab-button:has-text("Profile")').click();
		await page.getByRole('banner').locator('ion-button').click();
		await page.locator('d-button:has-text("Log Out")').click();
		await expect(page).toHaveURL('/en/register-login');
	});

	test('should open app settings', async ({ page }) => {
		await login(page);
		await page.locator('ion-tab-bar d-tab-button:has-text("Profile")').click();
		await page.getByRole('banner').locator('ion-button').click();
		await page.locator('d-button:has-text("Notifications settings")').click();
		await expect(page.locator('ion-modal')).not.toBeVisible();
	});
});
