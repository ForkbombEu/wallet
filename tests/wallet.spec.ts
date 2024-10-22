import { test } from '@playwright/test';
import { addCredentialsToLocalStorage, login, tabBarClick } from './utils';
import { WalletPage } from './fixtures/WalletPage';

test.describe('Wallet Page', () => {
	let walletPage: WalletPage;
	
	test.beforeEach(async ({ page }) => {
		walletPage = new WalletPage(page);
		await login(page);
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

	test('should list credentials if available', async ({ page }) => {
		await addCredentialsToLocalStorage(page);
		await tabBarClick('Home', page);
		await tabBarClick('Wallet', page);
		await walletPage.verifyCredentialsVisible();
	});

	test('should navigate to credential detail on click', async ({ page }) => {
		await tabBarClick('Home', page);
		await tabBarClick('Wallet', page);
		await walletPage.clickFirstCredential();
	});
});
