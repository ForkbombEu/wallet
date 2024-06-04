import { expect, test } from '@playwright/test';
import { login } from './utils';

test.describe('Home Page', () => {
	test('should load home page after login', async ({ page }) => {
		await login(page);
		await expect(page).toHaveURL('/en/wallet');
		await page.locator('ion-tab-bar d-tab-button:has-text("Home")').click();
		await expect(page).toHaveURL('/en/home');
		await expect(page.locator('h1')).toContainText('Request credential');
	});

	test('should display list of services', async ({ page }) => {
		await login(page);
		await page.locator('ion-tab-bar d-tab-button:has-text("Home")').click();
        await expect(page).toHaveURL('/en/home');
		const serviceLocator = page.locator('d-credential-service');
		await expect(serviceLocator).toBeTruthy();
	});

	test('should navigate to credential offer page on service click', async ({ page }) => {
		// Use the login function to log in
		await login(page);
		await page.locator('ion-tab-bar d-tab-button:has-text("Home")').click();
        await expect(page).toHaveURL('/en/home');
		await page.locator('d-credential-service').first().click();
		await expect(page).toHaveURL('/en/credential-offer');
	});
});
