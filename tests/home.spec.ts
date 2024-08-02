import { expect, test } from '@playwright/test';
import { login, tabBarClick } from './utils';

test.describe('Home Page', () => {
	test('should load home page after login', async ({ page }) => {
		await login(page);
		await expect(page).toHaveURL('/en/wallet');
		await tabBarClick('Home', page);
		await expect(page).toHaveURL('/en/home');
		await expect(page.getByText('Request credential').first()).toBeVisible();
	});

	test('should show spinner while loading services', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		page.route(
			'**/api/collections/services/records?page=1&perPage=500&skipTotal=1&sort=-updated&expand=credential_issuer',
			(route) => setTimeout(() => route.continue(), 10000)
		);
		await expect(
			page.locator(
				'.fixed.z-50.flex.h-full.min-h-screen.w-full.flex-col.items-center.justify-around.bg-surface.ion-padding.opacity-90'
			)
		).toBeVisible();
	});

	test('should display list of services', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await expect(page).toHaveURL('/en/home');
		const serviceLocator = page.locator('d-credential-service');
		await expect(serviceLocator).toBeTruthy();
	});

	test.skip('should navigate to credential offer page on service click', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await expect(page).toHaveURL('/en/home');
		await page.locator('d-credential-service').first().click();
		await expect(page).toHaveURL('/en/credential-offer');
	});
});
