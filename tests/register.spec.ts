import { expect, test } from '@playwright/test';
import { randomEmail, randomString } from './utils';

test.describe.skip('Registration Flow', () => {
	test('should navigate to registration insert password page', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.locator('#ion-cb-0').click();
		await page.fill('input[name="email"]', 'newuser@example.com');
		await page.getByRole('button', { name: 'Next' }).click();
		await expect(page).toHaveURL('/en/login/insert-password');
	});

	test('should show error if passwords do not match', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.fill('input[name="email"]', 'newuser@example.com');
		await page.locator('#ion-cb-0').click();
		await page.getByRole('button', { name: 'Next' }).click();
		await page.fill('input[name="password"]', 'password123');
		await page.fill('input[name="confirmPassword"]', 'password456');
		await page.getByRole('button', { name: 'Next' }).click();
		const errorMessage = await page.locator('text="Error: The passwords do not match"');
		await expect(errorMessage).toBeVisible();
	});

	test('should navigate to questions page after successful registration', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.fill('input[name="email"]', randomEmail());
		await page.locator('#ion-cb-0').click();
		await page.getByRole('button', { name: 'Next' }).click();
		const password = randomString(8);
		await page.fill('input[name="password"]', password);
		await page.fill('input[name="confirmPassword"]', password);
		await page.getByRole('button', { name: 'Next' }).click();
		await expect(page).toHaveURL('/en/login/questions');
	});
});

test.describe.skip('Security Questions Page', () => {
	test('should show error if less than three questions are answered', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.fill('input[name="email"]', randomEmail());
		await page.locator('#ion-cb-0').click();
		await page.getByRole('button', { name: 'Next' }).click();
		const password = randomString(8);
		await page.fill('input[name="password"]', password);
		await page.fill('input[name="confirmPassword"]', password);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.fill('input[name="whereParentsMet"]', 'Paris');
		const errorMessage = await page.locator('text="AT_LEAST_THREE_QUESTIONS"');
		await expect(errorMessage).toBeVisible();
	});

	test.skip('should complete security questions and generate keypair', async ({ page }) => {
		await page.goto('/login?registration=true');
		await page.fill('input[name="email"]', randomEmail());
		await page.locator('#ion-cb-0').click();
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
