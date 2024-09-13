import { expect, test } from '@playwright/test';
import { login, tabBarClick } from './utils';

test.describe('Credential Offer Page', () => {
	test('should load credential offer page after navigating from home', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of email possession').click();
		await expect(page).toHaveURL('/en/credential-offer');
		await expect(page.getByText('Credential offer')).toBeVisible();
	});

	test('should load credential offer page after scan qr code', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.getByRole('link', { name: 'SCAN QR' }).click();
		await expect(page).toHaveURL('/en/scan');
		await page
			.getByRole('textbox')
			.fill(
				'DIDroom4VP://?credential_configuration_ids=Auth1&credential_issuer=https%3A%2F%2Fissuer1.zenswarm.forkbomb.eu%2Fcredential_issuer%2F'
			);
		await page.getByRole('button', { name: 'SUBMIT' }).click();

		await expect(page).toHaveURL('/en/credential-offer');
		await expect(page.getByText('Credential offer')).toBeVisible();
	});

	test('should display credential offer form after loading', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of email possession').click();
		await expect(page).toHaveURL('/en/credential-offer');
		await expect(page.frameLocator('#authorization-server')).toBeTruthy();
		// await expect(page.locator('form#schemaForm')).toBeVisible();
	});

	test.skip('should submit credential offer form and show modal', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of email possession').click();

		const form = page.locator('form#schemaForm');
		await form.locator('input').nth(0).fill('a');
		await form.locator('input').nth(1).fill('b');
		await form.locator('input').nth(2).fill('c');

		await page.getByRole('button', { name: 'GET THIS CREDENTIAL' }).click();

		await expect(page.locator('#ion-overlay-5')).toBeVisible();
		await expect(page.locator('text=The credential is being generated')).toBeVisible();
	});

	test.skip('should handle service response and navigate to credential detail', async ({
		page
	}) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of email possession').click();

		const form = page.locator('form#schemaForm');
		await form.locator('input').nth(0).fill('a');
		await form.locator('input').nth(1).fill('b');
		await form.locator('input').nth(2).fill('c');

		await page.getByRole('button', { name: 'GET THIS CREDENTIAL' }).click();

		await expect(page.locator('#ion-overlay-5')).toBeHidden();
		await expect(page).toHaveURL('/en/1/credential-detail');
	});

	test.skip('should add activity after success', async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		await page.locator('text=Proof of email possession').click();

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

	test.skip('should display an error if the credential issuer is out of service', async ({
		page
	}) => {
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
		await page.locator('text=Proof of email possession').click();

		await page.getByRole('link', { name: 'DECLINE' }).click();

		await expect(page).toHaveURL('/en/home');
	});
});
