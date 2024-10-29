import { test } from './fixtures/testWithFixtures';
import { addCredentialsToLocalStorage, login } from './utils';
import { WalletPage } from './fixtures/pages/WalletPage';

test.describe('Credential Detail Page', () => {
	test.beforeEach(async ({ page, credentialDetailPage }) => {
		await login(page);
		await page.goto('/home');
		await addCredentialsToLocalStorage(page);
		await credentialDetailPage.navigate();
	});

	test.skip('should load credential detail page after login', async ({ credentialDetailPage }) => {
		await credentialDetailPage.isPageVisible();
	});

	test('should have not accessibility issues', async ({ credentialDetailPage }) => {
		await credentialDetailPage.hasNoAccessibilityIssues();
	});

	test('should display the credential name', async ({ credentialDetailPage }) => {
		await credentialDetailPage.verifyCredentialName();
	});

	test.skip('should display the credential description', async ({ credentialDetailPage }) => {
		await credentialDetailPage.verifyCredentialDescription();
	});

	test('should display the credential issuer', async ({ credentialDetailPage }) => {
		await credentialDetailPage.verifyCredentialIssuer();
	});

	test('should display the credential issuer url', async ({ credentialDetailPage }) => {
		await credentialDetailPage.verifyCredentialIssuerUrl();
	});

	test('should display the credential claims', async ({ credentialDetailPage }) => {
		await credentialDetailPage.verifyClaims();
	});

	test('should return to wallet on close', async ({ credentialDetailPage }) => {
		await credentialDetailPage.closeCredentialDetail();
		await credentialDetailPage.waitForUrlContains('/en/wallet');
	});

	test('should open modal on delete button pressed', async ({ credentialDetailPage }) => {
		await credentialDetailPage.deleteCredential();
		await credentialDetailPage.verifyDeleteModal();
	});

	test('should close modal on cancel button pressed', async ({ credentialDetailPage }) => {
		await credentialDetailPage.deleteCredential();
		await credentialDetailPage.cancelDelete();
		await credentialDetailPage.verifyDeleteModalHidden();
	});

	test('should delete credential on confirm button pressed', async ({
		page,
		credentialDetailPage
	}) => {
		const walletPage = new WalletPage(page);
		await credentialDetailPage.deleteCredential();
		await credentialDetailPage.confirmDelete();
		await credentialDetailPage.waitForUrlContains('/en/wallet');
		await walletPage.isPageVisible();
		await walletPage.verifyEmptyState();
	});
});
