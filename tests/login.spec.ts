import { expect, test } from '@playwright/test';
import { randomEmail, randomString, swipe, userEmail, userPassword, userSeed } from './utils';

test.describe('Onboarding Page', () => {
	test('should display all onboarding slides', async ({ page }) => {
			await page.goto('/');
		await expect(page.locator('text="DIDroom Wallet,"')).toBeVisible();
		await swipe(page);
		await expect(page.locator('text="Create your DID,"')).toBeVisible();
		await swipe(page);
		await expect(
			page.locator('text="Manage your verifiable credentials (VC) in one place,"')
		).toBeVisible();
	});
});

test.describe('Onboarding Page', () => {
	test('should complete onboarding and navigate to home', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Skip' }).click();
		await expect(page).toHaveURL('/en/register-login');
		const isBoarded = await page.evaluate(() => localStorage.getItem('CapacitorStorage.isBoarded'));
		expect(isBoarded).toBe('true');
	});
});

test.describe('Register-login', () => {
	test('should navigate to registration page', async ({ page }) => {
		await page.goto('/register-login');

		await page.getByRole('link', { name: 'Create an account' }).click();
		await expect(page).toHaveURL('/en/login?registration=true');
	});
});

test.describe('register-login', () => {
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
});

test.describe('Unsuccessful Login', () => {
	test('should show error for incorrect email/password', async ({ page }) => {
		await page.goto('/login');
		await page.fill('input[name="email"]', 'wrong@example.com');
		await page.fill('input[name="password"]', 'wrongpassword');
		await page.getByRole('button', { name: 'Next' }).click();
		const errorMessage = await page.locator('text="wrong email or password"');
		await expect(errorMessage).toBeVisible();
	});
});

test.describe('Registration Flow', () => {
	test('should navigate to registration insert password page', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.fill('input[name="email"]', 'newuser@example.com');
		await page.getByRole('button', { name: 'Next' }).click();
		await expect(page).toHaveURL('/en/login/insert-password');
	});
});

test.describe('Insert Password Page', () => {
	test('should show error if passwords do not match', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.fill('input[name="email"]', 'newuser@example.com');
		await page.getByRole('button', { name: 'Next' }).click();
		await page.fill('input[name="password"]', 'password123');
		await page.fill('input[name="confirmPassword"]', 'password456');
		await page.getByRole('button', { name: 'Next' }).click();
		const errorMessage = await page.locator('text="Error: The passwords do not match"');
		await expect(errorMessage).toBeVisible();
	});
});

test.describe('Insert Password Page', () => {
	test('should navigate to questions page after successful registration', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.fill('input[name="email"]', randomEmail());
		await page.getByRole('button', { name: 'Next' }).click();
		const password = randomString(8)
		await page.fill('input[name="password"]', password);
		await page.fill('input[name="confirmPassword"]', password);
		await page.getByRole('button', { name: 'Next' }).click();
		await expect(page).toHaveURL('/en/login/questions');
	});
});

test.describe('Security Questions Page', () => {
	test('should show error if less than three questions are answered', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.fill('input[name="email"]', randomEmail());
		await page.getByRole('button', { name: 'Next' }).click();
		const password = randomString(8);
		await page.fill('input[name="password"]', password);
		await page.fill('input[name="confirmPassword"]', password);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.fill('input[name="whereParentsMet"]', 'Paris');
		const errorMessage = await page.locator('text="AT_LEAST_THREE_QUESTIONS"');
		await expect(errorMessage).toBeVisible();
	});
});

test.describe('Security Questions Page', () => {
	test('should complete security questions and generate keypair', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.fill('input[name="email"]', randomEmail());
		await page.getByRole('button', { name: 'Next' }).click();
		const password = randomString(8);
		await page.fill('input[name="password"]', password);
		await page.fill('input[name="confirmPassword"]', password);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.fill('input[name="whereParentsMet"]', 'Paris');
		await page.fill('input[name="nameFirstPet"]', 'Buddy');
		await page.fill('input[name="whereHomeTown"]', 'New York');
		await page.getByRole('button', { name: 'Next' }).first().click();
		const seedText = await page.locator('text="You have a keyring!"');
		await expect(seedText).toBeVisible();
		const keyring = await page.evaluate(() => localStorage.getItem('CapacitorStorage.keyring'));
		const did = await page.evaluate(() => localStorage.getItem('CapacitorStorage.did'));
		expect(keyring).not.toBeNull();
		expect(did).not.toBeNull();
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
		await page.fill('input[name="seed"]', 'incorrect passphrase that does not work but it seems valid shape (lenght)');
		const errorMessageII = await page.locator('text="error while regenerating keyring"');
		await page.getByRole('button', { name: 'Login' }).first().click();
		await expect(errorMessageII).toBeVisible();
	});
});

test.describe('Login with Passphrase Page', () => {
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
		await page.waitForTimeout(1000);
		const keyring = await page.evaluate(() => localStorage.getItem('CapacitorStorage.keyring'));
		const did = await page.evaluate(() => localStorage.getItem('CapacitorStorage.did'));
		expect(keyring).not.toBeNull();
		expect(did).not.toBeNull();
		await expect(page).toHaveURL('/en/wallet');
	});
});

