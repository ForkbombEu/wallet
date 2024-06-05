import { expect, test } from '@playwright/test';
import { userEmail, userPassword, userSeed } from './utils';

test.describe('Register-login', () => {
	test('should navigate to registration page', async ({ page }) => {
		await page.goto('/register-login');
		await page.getByRole('link', { name: 'Create an account' }).click();
		await expect(page).toHaveURL('/en/login?registration=true');
	});

	test('should navigate to login page', async ({ page }) => {
		await page.goto('/register-login');
		await page.getByRole('link', { name: 'Login' }).click();
		await expect(page).toHaveURL('/en/login');
	});
});

test.describe('Login Page', () => {
	test('should log in successfully', async ({ page }) => {
		await page.goto('/login');
		await page.fill('input[name="email"]', userEmail);
		await page.fill('input[name="password"]', userPassword);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.waitForURL('/en/login/passphrase');
	});

	test('should show error for incorrect email/password', async ({ page }) => {
		await page.goto('/login');
		await page.fill('input[name="email"]', 'wrong@example.com');
		await page.fill('input[name="password"]', 'wrongpassword');
		await page.getByRole('button', { name: 'Next' }).click();
		const errorMessage = await page.locator('text="wrong email or password"');
		await expect(errorMessage).toBeVisible();
	});
});

test.describe('Login with Passphrase Page', () => {
	test('should show error with incorrect passphrase', async ({ page }) => {
		await page.goto('/en/login');
		await page.fill('input[name="email"]', userEmail);
		await page.fill('input[name="password"]', userPassword);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.waitForURL('/en/login/passphrase');
		await page.fill('input[name="seed"]', 'incorrect passphrase that does not work');
		await page.getByRole('button', { name: 'Login' }).first().click();
		const errorMessage = await page.locator('text="Invalid input"');
		await expect(errorMessage).toBeVisible();
		await page.fill(
			'input[name="seed"]',
			'incorrect passphrase that does not work but it seems valid shape (lenght)'
		);
		const errorMessageII = await page.locator('text="error while regenerating keyring"');
		await page.getByRole('button', { name: 'Login' }).first().click();
		await expect(errorMessageII).toBeVisible();
	});

	test('should navigate to wallet after successful passphrase entry', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Skip' }).click();
		await page.getByRole('link', { name: 'Login' }).click();
		await page.fill('input[name="email"]', userEmail);
		await page.fill('input[name="password"]', userPassword);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.waitForURL('/en/login/passphrase');
		await page.fill('input[name="seed"]', userSeed!);
		await page.getByRole('button', { name: 'Login' }).first().click();
		await page.waitForTimeout(3000);
		const keyring = await page.evaluate(() => localStorage.getItem('CapacitorStorage.keyring'));
		const did = await page.evaluate(() => localStorage.getItem('CapacitorStorage.did'));
		expect(keyring).not.toBeNull();
		expect(did).not.toBeNull();
		await expect(page).toHaveURL('/en/wallet');
	});
});
