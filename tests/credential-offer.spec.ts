import { expect, test } from '@playwright/test';
import { login, tabBarClick } from './utils';

test.describe('Credential Offer Page', () => {
	test('should load credential offer page after navigating from home', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of humanity - OpenID4VCI flow - Auth1').click();
		await expect(page).toHaveURL('/en/credential-offer');
		await expect(page.getByText('Credential offer')).toBeVisible();
	});

	test('should load credential offer page after scan qr code', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.getByRole('link', { name: 'SCAN QR' }).click();
		await expect(page).toHaveURL('/en/scan');
		await page.getByRole('textbox').fill(`{
  "credential_configuration_ids": [
    "Auth1"
  ],
  "credential_issuer": "https://issuer1.zenswarm.forkbomb.eu/credential_issuer/"
}`);
		await page.getByRole('button', { name: 'SUBMIT' }).click();

		await expect(page).toHaveURL('/en/credential-offer');
		await expect(page.getByText('Credential offer')).toBeVisible();
	});

	test('should display credential offer form after loading', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of humanity - OpenID4VCI flow - Auth1').click();
		await expect(page).toHaveURL('/en/credential-offer');
		await expect(
			page
				.locator('ion-tabs div')
				.filter({ hasText: 'Proof of humanity Current' })
				.locator('d-heading')
		).toBeVisible();
		await expect(page.locator('form#schemaForm')).toBeVisible();
	});

	test('should submit credential offer form and show modal', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of humanity - OpenID4VCI flow - Auth1').click();

		const form = page.locator('form#schemaForm');
		await form.locator('input').nth(0).fill('a');
		await form.locator('input').nth(1).fill('b');
		await form.locator('input').nth(2).fill('c');

		await page.getByRole('button', { name: 'GET THIS CREDENTIAL' }).click();

		await expect(page.locator('#ion-overlay-5')).toBeVisible();
		await expect(page.locator('text=The credential is being generated')).toBeVisible();
	});

	test('should handle service response and navigate to credential detail', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of humanity - OpenID4VCI flow - Auth1').click();

		const form = page.locator('form#schemaForm');
		await form.locator('input').nth(0).fill('a');
		await form.locator('input').nth(1).fill('b');
		await form.locator('input').nth(2).fill('c');

		await page.getByRole('button', { name: 'GET THIS CREDENTIAL' }).click();

		await expect(page.locator('#ion-overlay-5')).toBeHidden();
		await expect(page).toHaveURL('/en/1/credential-detail');
	});

	test('should add activity after success', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of humanity - OpenID4VCI flow - Auth1').click();

		const form = page.locator('form#schemaForm');
		await form.locator('input').nth(0).fill('a');
		await form.locator('input').nth(1).fill('b');
		await form.locator('input').nth(2).fill('c');

		await page.getByRole('button', { name: 'GET THIS CREDENTIAL' }).click();

		await expect(page.locator('#ion-overlay-5')).toBeHidden();
		await expect(page).toHaveURL('/en/1/credential-detail');
		await tabBarClick('Activity', page);
		const activityLocator = page.locator('.itens-start');
		await expect(activityLocator.first()).toBeVisible();
	});

	test('should display an error if the credential issuer is out of service', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Broken Issuer!').click();

		await expect(page).toHaveURL('/en/home');
		await expect(
			page.locator('text=The credential issuer is currently offline, you may try again later')
		).toBeVisible();
	});

	test('should decline credential offer and return to home', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of humanity - OpenID4VCI flow - Auth1').click();

		await page.getByRole('link', { name: 'DECLINE' }).click();

		await expect(page).toHaveURL('/en/home');
	});
});
