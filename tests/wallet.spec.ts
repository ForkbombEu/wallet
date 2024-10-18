import { test } from '@playwright/test';
import { addCredentialsToLocalStorage, login, tabBarClick } from './utils';
import { WalletPage } from './fixtures/WalletPage';

test.describe('Wallet Page', () => {
	test('should load wallet page after login', async ({ page }) => {
		await login(page);
		const walletPage = new WalletPage(page);
		await walletPage.verifyWalletPage();
	});

	test('should display heading and description', async ({ page }) => {
		await login(page);
		const walletPage = new WalletPage(page);
		await walletPage.verifyCredentialsHeadingAndDescription();
	});

	test('should show empty state when no credentials', async ({ page }) => {
		await login(page);
		const walletPage = new WalletPage(page);
		await walletPage.verifyEmptyState();
	});

	test('should list credentials if available', async ({ page }) => {
		await login(page);
		await addCredentialsToLocalStorage(page);
		await tabBarClick('Home', page);
		await tabBarClick('Wallet', page);
		const walletPage = new WalletPage(page);
		await walletPage.verifyCredentialsVisible();
	});

	test('should navigate to credential detail on click', async ({ page }) => {
		await login(page);
		await addCredentialsToLocalStorage(page);
		await tabBarClick('Home', page);
		await tabBarClick('Wallet', page);
		const walletPage = new WalletPage(page);
		await walletPage.clickFirstCredential();
	});
});
