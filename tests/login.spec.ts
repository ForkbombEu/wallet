import { test, expect } from '@playwright/test';
import { RegisterLoginPage } from './fixtures/RegisterLoginPage';
import { LoginPage } from './fixtures/LoginPage';
import { PassphrasePage } from './fixtures/PassphrasePage';

test.describe('Register-login', () => {
	test('should navigate to registration page', async ({ page }) => {
		const registerLoginPage = new RegisterLoginPage(page);
		await registerLoginPage.navigate();
		await registerLoginPage.clickCreateAccount();
		await expect(page).toHaveURL('/en/login?registration=true');
	});

	test('should navigate to login page', async ({ page }) => {
		const registerLoginPage = new RegisterLoginPage(page);
		await registerLoginPage.navigate();
		await registerLoginPage.clickLogin();
		await expect(page).toHaveURL('/en/login');
	});
});

test.describe('Login Page', () => {
	test('should log in successfully', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.navigate();
		await loginPage.loginWithCredentials();
	});

	test('should show error for incorrect email/password', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.navigate();
		await loginPage.loginWithInvalidCredentials();
		await loginPage.verifyErrorMessages();
	});
});

test.describe('Login with Passphrase Page', () => {
	test('should show error with incorrect passphrase', async ({ page }) => {
		const loginPage = new LoginPage(page);
		const passphrasePage = new PassphrasePage(page);

		await loginPage.navigate();
		await loginPage.loginWithCredentials();
		await passphrasePage.enterPassphrase('incorrect passphrase that does not work');
		await passphrasePage.checkErrorMessage('Invalid input');

		await passphrasePage.enterPassphrase(
			'incorrect passphrase that does not work but it seems valid shape (length)'
		);
		await passphrasePage.checkErrorMessage('error while regenerating keyring');
	});

	test('should navigate to wallet after successful passphrase entry', async ({ page }) => {
		const loginPage = new LoginPage(page);
		const passphrasePage = new PassphrasePage(page);
		await page.goto('/');
		await page.getByRole('button', { name: 'Skip' }).click();
		await page.getByRole('link', { name: 'Login' }).click();
		await loginPage.loginWithCredentials();
		await passphrasePage.enterPassphrase();
		await page.waitForTimeout(3000);
		await passphrasePage.verifyKeyringAndDID();
		await expect(page).toHaveURL('/en/wallet');
	});
});
