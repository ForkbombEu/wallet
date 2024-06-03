import type { Page } from '@playwright/test';

export const swipe = async (page: Page) => {
	const x = 50;
	const y = 50;
	await page.mouse.move(x, y);
	await page.mouse.down();
	await page.mouse.move(x + 1000, y);
	await page.mouse.up();
};

export const randomString = (length: number) => {
	const result = [];
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
	return result.join('');
};

export const randomEmail = () => {
	const randomStr = randomString(4);
	return `${randomStr}@${randomStr}.com`;
};

export const login = async (page: Page ) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Skip' }).click();
	await page.getByRole('link', { name: 'Login' }).click();
	await page.fill('input[name="email"]', userEmail);
	await page.fill('input[name="password"]', userPassword);
	await page.getByRole('button', { name: 'Next' }).click();
	await page.waitForURL('/en/login/passphrase');
	await page.fill('input[name="seed"]', userSeed!);
	await page.getByRole('button', { name: 'Login' }).first().click();
	await page.waitForURL('/en/wallet');
};

export const userEmail = process.env.USER_EMAIL!;
export const userPassword = process.env.USER_PASSWORD!;
export const userSeed = process.env.USER_SEED!;
