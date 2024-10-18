import { type Activity } from '$lib/preferences/activity';
import type { Credential } from '$lib/preferences/credentials';
import type { Page } from '@playwright/test';

export const swipe = async (page: Page, x = 120, y = 150) => {
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

export const login = async (page: Page) => {
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

export type TabButton = 'Home' | 'Wallet' | 'Activity' | 'Profile';

export const tabBarClick = async (route: TabButton, page: Page) =>
	await page.locator(`ion-tab-bar d-tab-button:has-text("${route}")`).click();

// const ACTIVITY_PREFERENCES_KEY = 'activity';
// const CREDENTIALS_PREFERENCES_KEY = 'credentials';

// function addToLocalStorage<T>(key: string, data: T[]) {
// 	localStorage.setItem(`CapacitorStorage.${key}`, JSON.stringify(data));
// }

// function removeLocalStorage(key: string) {
// 	localStorage.removeItem(key);
// }

export async function addCredentialsToLocalStorage(page: Page) {
	await page.evaluate(() => {
		const CREDENTIALS_PREFERENCES_KEY = 'credentials';
		const credentials: Credential[] = [
			{
				issuerUrl: 'https://avatars.githubusercontent.com/u/',
				configuration_ids: ['Auth1'],
				display_name: 'Proof of humanity',
				sdJwt: 'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogInZjK3NkLWp3dCJ9.eyJfc2QiOiBb...',
				issuer: 'DIDroom_Issuer1',
				description: 'You can use this credential to prove your identity...',
				verified: false,
				expirationDate: 1720118613,
				logo: {
					alt_text: 'Forkbomb Logo',
					url: 'https://avatars.githubusercontent.com/u/96812851'
				},
				id: 1
			},
			{
				issuerUrl: 'https://avatars.githubusercontent.com/u/',
				configuration_ids: ['above16'],
				display_name: 'Above 16',
				sdJwt: 'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogInZjK3NkLWp3dCJ9.eyJfc2QiOiBb...',
				issuer: 'DIDroom_Issuer1',
				description: 'You can use this credential to prove that you are above 16 years old...',
				verified: false,
				expirationDate: 1720131677,
				logo: {
					alt_text: 'ZafeLoc Logo',
					url: 'https://blog.citizenkey.eu/public/Graphics/.ZafeLog__logo_s.png'
				},
				id: 2
			}
		];
		function addToLocalStorage<T>(key: string, data: T[]) {
			localStorage.setItem(`CapacitorStorage.${key}`, JSON.stringify(data));
		}
		return addToLocalStorage(CREDENTIALS_PREFERENCES_KEY, credentials);
	});
}

export async function addActivitiesToLocalStorage(page: Page) {
	await page.evaluate(() => {
		const ACTIVITY_PREFERENCES_KEY = 'activity';
		const activities: Activity[] = [
			{
				at: 1717526615,
				id: 1,
				type: 'credential'
			},
			{
				at: 1717539679,
				id: 2,
				type: 'credential'
			}
		];
		function addToLocalStorage<T>(key: string, data: T[]) {
			localStorage.setItem(`CapacitorStorage.${key}`, JSON.stringify(data));
		}
		return addToLocalStorage(ACTIVITY_PREFERENCES_KEY, activities);
	});
}

export async function removeCredentialsFromLocalStorage(page: Page) {
	await page.evaluate(() => {
		const CREDENTIALS_PREFERENCES_KEY = 'credentials';
		function removeLocalStorage(key: string) {
			localStorage.removeItem(key);
		}
		return removeLocalStorage(CREDENTIALS_PREFERENCES_KEY);
	});
}

export async function removeActivitiesFromLocalStorage(page: Page) {
	await page.evaluate(() => {
		const ACTIVITY_PREFERENCES_KEY = 'activity';
		function removeLocalStorage(key: string) {
			localStorage.removeItem(key);
		}
		return removeLocalStorage(ACTIVITY_PREFERENCES_KEY);
	});
}
