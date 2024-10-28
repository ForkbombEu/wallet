import { type Activity } from '$lib/preferences/activity';
import type { Credential } from '$lib/preferences/credentials';
import type { Page } from '@playwright/test';
import { PassphrasePage } from '../fixtures/pages/PassphrasePage';
import { LoginPage } from '../fixtures/pages/LoginPage';

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
	const passphrasePage = new PassphrasePage(page);
	const loginPage = new LoginPage(page);
	await page.goto('/');
	await page.getByRole('button', { name: 'Skip' }).click();
	await loginPage.navigate();
	await loginPage.loginWithCredentials();
	await passphrasePage.enterPassphrase();
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

// export async function addCredentialsToLocalStorage(page: Page) {
// 	const credentialOfferPage = new CredentialOfferPage(page);
// 	await page.goto('/en/home');
// 	await credentialOfferPage.navigate();
// 	await credentialOfferPage.continueToAuthorization();
// 	await credentialOfferPage.verifyIframeLoaded();
// 	await credentialOfferPage.submitExternalForm({ voucher: 'ten' });
// 	await credentialOfferPage.verifyModalHidden();
// 	await page.waitForTimeout(3000);
// 	await credentialOfferPage.waitForUrlContains('/en/1/credential-detail');
// 	await page.goto('/en/home');
// 	await credentialOfferPage.navigate();
// 	await credentialOfferPage.continueToAuthorization();
// 	await credentialOfferPage.verifyIframeLoaded();
// 	await credentialOfferPage.submitExternalForm({ voucher: 'twenty' });
// 	await credentialOfferPage.verifyModalHidden();
// 	await page.waitForTimeout(3000);
// 	await credentialOfferPage.waitForUrlContains('/en/2/credential-detail');
// 	await page.goto('/en/wallet');
// }

export async function addCredentialsToLocalStorage(page: Page) {
	await page.evaluate(() => {
		const CREDENTIALS_PREFERENCES_KEY = 'credentials';
		const credentials: Credential[] = [
			{
				configuration_ids: ['discount_from_voucher_test'],
				display_name: 'Voucher test',
				sdJwt:
					'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogInZjK3NkLWp3dCJ9.eyJfc2QiOiBbIlQ1TWRQVFVsMlBFeVBBUkc2Z2JDRGYxNnVyMDBhTm5EVHhLcHN1ZkN1N00iXSwgIl9zZF9hbGciOiAic2hhLTI1NiIsICJleHAiOiAxNzI5NzY4MjI2LCAiaWF0IjogMTcyOTY5NjIyNiwgImlzcyI6ICJodHRwczovL2NpLnRlc3QuZGlkcm9vbS5jb20vY3JlZGVudGlhbF9pc3N1ZXIiLCAibmJmIjogMTcyOTY5NjIyNiwgInN1YiI6ICJkaWQ6ZHluZTpzYW5kYm94LnNpZ25yb29tOkpBb21WN0tGM05qamFnQkVuVHJSTkcyOERqZXBYTTlYSEV5R05Zd0pTN2tlIiwgInR5cGUiOiAiZGlzY291bnRfZnJvbV92b3VjaGVyX3Rlc3QifQ.wtTMszYmQNWQmPE3kkJbHH7dn95pVb8iqvXJ66PQma-nq5sNN0dpimWYR8ZuPRIhrS1R88ZUqEn7WNJsATAIZw~WyIwYVdjRTFxdVE0aVZSWWVmYkZyR0lRIiwgImhhc19kaXNjb3VudF9mcm9tX3ZvdWNoZXIiLCAxMF0~',
				issuer: 'test ci',
				issuerUrl: 'https://ci.test.didroom.com/credential_issuer',
				description: '',
				verified: false,
				expirationDate: 1929768226,
				logo: {
					alt_text: 'Voucher test logo',
					url: 'https://storage.needpix.com/rsynced_images/discount-2540494_1280.png'
				},
				id: 1
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
