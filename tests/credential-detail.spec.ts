import { test } from '@playwright/test';
import { addCredentialsToLocalStorage, login } from './utils';
import { CredentialDetailPage } from './fixtures/CredentialDetailPage';
// import { CredentialOfferPage } from './fixtures/CredentialOfferPage';
import { WalletPage } from './fixtures/WalletPage';

test.describe('Credential Detail Page', () => {
	let credentialDetailPage: CredentialDetailPage;

	test.beforeEach(async ({ page }) => {
		credentialDetailPage = new CredentialDetailPage(page);
		// const credentialOfferPage = new CredentialOfferPage(page);
		await login(page);
		await page.goto('/home');
		await addCredentialsToLocalStorage(page);
		await credentialDetailPage.navigate();
	});

	test.skip('should load credential detail page after login', async () => {
		await credentialDetailPage.isPageVisible();
	});

	test('should have not accessibility issues', async () => {
		await credentialDetailPage.hasNoAccessibilityIssues();
	});

	test('should display the credential name', async () => {
		await credentialDetailPage.verifyCredentialName();
	});

	test.skip('should display the credential description', async () => {
		await credentialDetailPage.verifyCredentialDescription();
	});

	test('should display the credential issuer', async () => {
		await credentialDetailPage.verifyCredentialIssuer();
	});

	test('should display the credential issuer url', async () => {
		await credentialDetailPage.verifyCredentialIssuerUrl();
	});

	test('should display the credential claims', async () => {
		await credentialDetailPage.verifyClaims();
	});

	test('should return to wallet on close', async () => {
		await credentialDetailPage.closeCredentialDetail();
		await credentialDetailPage.waitForUrlContains('/en/wallet');
	});

	test('should open modal on delete button pressed', async () => {
		await credentialDetailPage.deleteCredential();
		await credentialDetailPage.verifyDeleteModal();
	});

	test('should close modal on cancel button pressed', async () => {
		await credentialDetailPage.deleteCredential();
		await credentialDetailPage.cancelDelete();
		await credentialDetailPage.verifyDeleteModalHidden();
	});

	test('should delete credential on confirm button pressed', async ({ page }) => {
		const walletPage = new WalletPage(page);
		await credentialDetailPage.deleteCredential();
		await credentialDetailPage.confirmDelete();
		await credentialDetailPage.waitForUrlContains('/en/wallet');
		await walletPage.isPageVisible();
		await walletPage.verifyEmptyState();
	});
});
