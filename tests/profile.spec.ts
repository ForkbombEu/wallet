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
