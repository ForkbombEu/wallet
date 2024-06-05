import { expect, test } from '@playwright/test';
import { login, userEmail } from './utils';

test.describe('Profile Page', () => {
	test('should load profile page after login', async ({ page }) => {
		await login(page);
		await expect(page).toHaveURL('/en/wallet');
		await page.locator('ion-tab-bar d-tab-button:has-text("Profile")').click();
		await expect(page).toHaveURL('/en/profile');
	});

	test('should display user details', async ({ page }) => {
		await login(page);
		await page.locator('ion-tab-bar d-tab-button:has-text("Profile")').click();
		await expect(page.locator('d-avatar')).toBeVisible();
		await expect(page.getByText(userEmail)).toBeVisible();
		await expect(page.getByText('did')).toBeVisible();
	});

	test('should display badges if user has organizations', async ({ page }) => {
		await login(page);
		await page.locator('ion-tab-bar d-tab-button:has-text("Profile")').click();
		const orgLocator = page.locator('d-avatar[alt]');
		if ((await orgLocator.count()) > 0) {
			await expect(page.locator('d-heading:has-text("Badges")')).toBeVisible();
			await expect(orgLocator).toBeVisible();
		}
	});

	test('should display app details component', async ({ page }) => {
		await login(page);
		await page.locator('ion-tab-bar d-tab-button:has-text("Profile")').click();
		await expect(page.getByText('Developed by Forkbomb BV')).toBeVisible();
	});
});
