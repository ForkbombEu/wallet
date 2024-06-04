import { expect, test } from '@playwright/test';
import { addCredentialsToLocalStorage, login, tabBarClick } from './utils';

test.describe('Wallet Page', () => {
	test('should load wallet page after login', async ({ page }) => {
		await login(page);
		await expect(page).toHaveURL('/en/wallet');
		await expect(page.getByText('WALLET', { exact: true }).first()).toBeVisible();
	});

	test('should display heading and description', async ({ page }) => {
		await login(page);
		await expect(page.locator('d-heading h1')).toContainText('My credentials');
		await expect(page.locator('d-text p')).toContainText('Explore and manage your credentials');
	});

	test('should show empty state when no credentials', async ({ page }) => {
		await login(page);
		await expect(
			page.locator('d-heading:has-text("There is no Credential in your wallet")')
		).toBeVisible();
		await expect(page.locator('d-text:has-text("Get your first credential")')).toBeVisible();
		await expect(page.locator('d-button:has-text("GET CREDENTIALS")')).toBeVisible();
	});

	test('should list credentials if available', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
		await tabBarClick('Home', page);
		await tabBarClick('Wallet', page);
		const credentialLocator = page.locator('d-credential-card');
		await expect(credentialLocator.first()).toBeVisible();
	});

	test('should navigate to credential detail on click', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
        await tabBarClick('Home', page);
		await tabBarClick('Wallet', page);
		const credentialLink = page.locator('a[href*="credential-detail"]').first();
		await credentialLink.click();
		await expect(page).toHaveURL(/\/credential-detail$/);
	});
});
