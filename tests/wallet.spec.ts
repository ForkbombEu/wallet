import { test } from './fixtures/testWithFixtures';
import { login } from './utils';
import { WalletPage } from './fixtures/pages/WalletPage';

test.describe('Wallet Page', () => {
	let walletPage: WalletPage;

	test.beforeEach(async ({ page }) => {
		walletPage = new WalletPage(page);
		await login(page);
	});

	test('should have not accessibility issues', async () => {
		await walletPage.hasNoAccessibilityIssues();
	});

	test('should load wallet page after login', async () => {
		await walletPage.isPageVisible();
	});

	test('should display heading and description', async () => {
		await walletPage.verifyCredentialsHeadingAndDescription();
	});

	test('should show empty state when no credentials', async () => {
		await walletPage.verifyEmptyState();
	});

	test('should list credentials if available', async () => {
		await walletPage.addCredentials();
		await walletPage.verifyCredentialsVisible();
	});

	test('should navigate to credential detail on click', async () => {
		await walletPage.addCredentials();
		await walletPage.clickFirstCredential();
	});
});
