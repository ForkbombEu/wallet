import { expect, test, type Page } from '@playwright/test';

const swipe = async (page:Page) => {
	const x = 50;
	const y = 50;
	await page.mouse.move(x, y);
	await page.mouse.down();
	await page.mouse.move(x + 1000, y);
	await page.mouse.up();
};

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

		await page.fill('input[name="email"]', 'yy@dd.mm');
		await page.fill('input[name="password"]', '12345678');
		await page.getByRole('button', { name: 'Next' }).click();

		await expect(page).toHaveURL('/en/login/passphrase');
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
