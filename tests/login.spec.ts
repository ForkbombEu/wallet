import { test, expect } from '@playwright/test';
import { RegisterLoginPage } from './fixtures/pages/RegisterLoginPage';
import { LoginPage } from './fixtures/pages/LoginPage';
import { PassphrasePage } from './fixtures/pages/PassphrasePage';

test.describe('Register-login', () => {
	let registerLoginPage: RegisterLoginPage;
	
	test.beforeEach(async ({ page }) => {
		registerLoginPage = new RegisterLoginPage(page);
		await registerLoginPage.navigate();
	});
	
	test('should navigate to registration page', async () => {
		await registerLoginPage.clickCreateAccount();
		await registerLoginPage.waitForUrlContains('/en/login?registration=true');
	});

	test('should navigate to login page', async () => {
		await registerLoginPage.clickLogin();
		await registerLoginPage.waitForUrlContains('/en/login');
	});
});

test.describe('Login Page', () => {
	let loginPage: LoginPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		await loginPage.navigate();
	});

	test('should have not accessibility issues', async () => {
		await loginPage.hasNoAccessibilityIssues();
	});

	test('should log in successfully', async () => {
		await loginPage.loginWithCredentials();
	});

	test('should show error for incorrect email/password', async () => {
		await loginPage.loginWithInvalidCredentials();
		await loginPage.verifyErrorMessages();
	});
});

test.describe('Login with Passphrase Page', () => {
	let passphrasePage: PassphrasePage;

	test.beforeEach(async ({ page }) => {
		const loginPage = new LoginPage(page);
		passphrasePage = new PassphrasePage(page);
		await page.goto('/');
		await page.getByRole('button', { name: 'Skip' }).click();
		await loginPage.navigate();
		await loginPage.loginWithCredentials();
	});

	test('should have not accessibility issues', async () => {
		await passphrasePage.hasNoAccessibilityIssues();
	});

	test('should show error with incorrect passphrase', async ({ page }) => {
		await passphrasePage.enterPassphrase('incorrect passphrase that does not work');
		await passphrasePage.checkErrorMessage('Invalid input');

		await passphrasePage.enterPassphrase(
			'incorrect passphrase that does not work but it seems valid shape (length)'
		);
		await passphrasePage.checkErrorMessage('error while regenerating keyring');
	});

	test('should navigate to wallet after successful passphrase entry', async ({ page }) => {
		await passphrasePage.enterPassphrase();
		await page.waitForTimeout(3000);
		await passphrasePage.verifyKeyringAndDID();
		await expect(page).toHaveURL('/en/wallet');
	});
});