import type { Page } from "@playwright/test";

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
