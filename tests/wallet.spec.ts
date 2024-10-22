import { test } from '@playwright/test';
import { addCredentialsToLocalStorage, login, tabBarClick } from './utils';
import { WalletPage } from './fixtures/WalletPage';

test.describe('Wallet Page', () => {
	let walletPage: WalletPage;
	test.beforeEach(async ({page}) => {
		await login(page);
		walletPage = new WalletPage(page);
	});

	test('should load wallet page after login', async ({ page }) => {
		await walletPage.verifyWalletPage();
	});

	test('should display heading and description', async ({ page }) => {
		await walletPage.verifyCredentialsHeadingAndDescription();
	});

	test('should show empty state when no credentials', async ({ page }) => {
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
