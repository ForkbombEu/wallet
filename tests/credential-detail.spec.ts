import { expect, test } from '@playwright/test';
import { addCredentialsToLocalStorage, login, swipe, tabBarClick } from './utils';

test.describe('Credential Detail Page', () => {
	test('should load credential detail page after login', async ({ page }) => {
		await login(page);
		await addCredentialsToLocalStorage(page);
		await tabBarClick('Home', page);
		await tabBarClick('Wallet', page);
		const credentialLink = page.locator('button[class*="relative"]').first();
		await credentialLink.click();
		await expect(page).toHaveURL(/\/credential-detail$/);
		await expect(page.getByText('Credential detail')).toBeVisible();
	});

	test.skip('should display the credential details', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
		await tabBarClick('Home', page);
		await tabBarClick('Wallet', page);
		const credentialLink = page.locator('a[href*="credential-detail"]').first();
		await credentialLink.click();
		await expect(page).toHaveURL(/\/credential-detail$/);
		const credentialCardTitle = page.getByText(
			'You can use this credential to prove your identity as name and surname, and to prove that you are a real human being.'
		);
		await expect(credentialCardTitle).toBeVisible();
	});
});
