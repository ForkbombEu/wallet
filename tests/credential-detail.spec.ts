import { expect, test } from '@playwright/test';
import { addCredentialsToLocalStorage, login, swipe, tabBarClick } from './utils';
import { CredentialDetailPage } from './fixtures/CredentialDetailPage';

test.describe.skip('Credential Detail Page', () => {
	let credentialDetailPage: CredentialDetailPage;

	test.beforeEach(async ({ page }) => {
		credentialDetailPage = new CredentialDetailPage(page);
		await login(page);
		await page.goto('/home');
	});

	test('should load credential detail page after login', async ({ page }) => {
		await credentialDetailPage.addCredentials();
		await credentialDetailPage.navigate();
		credentialDetailPage.isPageVisible()
		// credentialDetailPage.expectText('credential detail');
		// await tabBarClick('Home', page);
		// await tabBarClick('Wallet', page);
		// const credentialLink = page.locator('button[class*="relative"]').first();
		// await credentialLink.click();
		// await expect(page).toHaveURL(/\/credential-detail$/);
		// await expect(page.getByText('Credential detail')).toBeVisible();
	});

	// test('should have not accessibility issues', async () => {
	// 	credentialDetailPage.hasNoAccessibilityIssues();
	// });

	test('should display the credential name', async () => {
		await credentialDetailPage.addCredentials();
		await credentialDetailPage.navigate();

		credentialDetailPage.verifyCredentialName();
	});

	test('should display the credential description', async () => {
		await credentialDetailPage.addCredentials();
		await credentialDetailPage.navigate();
		credentialDetailPage.verifyCredentialDescription();
	});

	test('should display the credential issuer', async () => {
		await credentialDetailPage.addCredentials();
		await credentialDetailPage.navigate();
		credentialDetailPage.verifyCredentialIssuer();
	});

	test('should display the credential issuer url', async () => {
		await credentialDetailPage.addCredentials();
		await credentialDetailPage.navigate();
		credentialDetailPage.verifyCredentialIssuerUrl();
	});

	test('should display the credential claims', async () => {
		await credentialDetailPage.addCredentials();
		await credentialDetailPage.navigate();
		credentialDetailPage.verifyClaims();
	});

	test('should return to wallet on close', async () => {
		await credentialDetailPage.addCredentials();
		await credentialDetailPage.navigate();
		credentialDetailPage.closeCredentialDetail();
		credentialDetailPage.waitForUrlContains('/en/wallet');
	});

	// test('should delete the credential', async () => {
	// 	credentialDetailPage.deleteCredential();
	// });
});
