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

export const tabBarClick = async (route: 'Home' | 'Wallet' | 'Activity' | 'Profile', page: Page) =>
	await page.locator(`ion-tab-bar d-tab-button:has-text("${route}")`).click();

export function addCredentialsToLocalStorage() {
	const credentials = JSON.stringify([
		{
			configuration_ids: ['Auth1'],
			display_name: 'Proof of humanity',
			sdJwt:
				'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogInZjK3NkLWp3dCJ9.eyJfc2QiOiBbIjBEY1JXWURSSEg2WGVPakN2RXRzcndVMFJIdmNrcFhRa0FLbExJc0gxVUEiLCAiaE1PT0pITmZSNkp2RkZDNUwyeU9lNi02b3pjZHk2eW1MZlptQ2JUQW53MCIsICJRMlFWeWxubGZaN0doTWV5V3lNQjFmRTNmdDlnNmhRSVcySHRuQU56ODJRIl0sICJfc2RfYWxnIjogInNoYS0yNTYiLCAiZXhwIjogMTcyMDExODYxMywgImlhdCI6IDE3MTc1MjY2MTMsICJpc3MiOiAiaHR0cHM6Ly9pc3N1ZXIxLnplbnN3YXJtLmZvcmtib21iLmV1L2NyZWRlbnRpYWxfaXNzdWVyIiwgIm5iZiI6IDE3MTc1MjY2MTMsICJzdWIiOiAiZGlkOmR5bmU6c2FuZGJveC5zaWducm9vbTpDZ1hzNXhKZjlzZjVGRERzQkxrcmZkUEpKb1I1VHM5aURSWWJYdWtSYU5yViIsICJ0eXBlIjogIkF1dGgxIn0.or4oW2JgPZRB3G-V-awtkJsGLQhZwH2630Wlani35Pmj0JD7WnB2TxGZzs34oFRR1DM7FHkAESk-K-hPECc_KA~WyJYR3Nfc00xTEs4WWx1Q295LTVSVUNRIiwgImdpdmVuX25hbWUiLCAicCJd~WyJsQUxyZlRfRDc5U00wQzE1dTBCZkZnIiwgImZhbWlseV9uYW1lIiwgInAiXQ~WyIxckg0MzZuMThmVy1aTlA0VThOd1RnIiwgImlzX2h1bWFuIiwgInAiXQ~',
			issuer: 'DIDroom_Issuer1',
			description:
				'You can use this credential to prove your identity as name and surname, and to prove that you are a real human being.',
			verified: false,
			expirationDate: 1720118613,
			logo: {
				alt_text: 'Forkbomb Logo',
				url: 'https://avatars.githubusercontent.com/u/96812851'
			},
			id: 1
		},
		{
			configuration_ids: ['above16'],
			display_name: 'Above 16',
			sdJwt:
				'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogInZjK3NkLWp3dCJ9.eyJfc2QiOiBbIkR2OUhud2E2Z0FQQkJXcFBTZmtqakc5bTAtYXp5OVRYZzVqQ2FGOEgwX28iLCAicGZoVWEwVzJpODRkTmxDc3I0N1RzNC13dHNjeXYwUlFHeFVmd1VrUzJUOCIsICJGcVc3bVUwNHRLcjVqNzNKUGpjMnRVQ0lGR0xaREdWQTZLaVlqY0YybkNJIl0sICJfc2RfYWxnIjogInNoYS0yNTYiLCAiZXhwIjogMTcyMDEzMTY3NywgImlhdCI6IDE3MTc1Mzk2NzcsICJpc3MiOiAiaHR0cHM6Ly9pc3N1ZXIxLnplbnN3YXJtLmZvcmtib21iLmV1L2NyZWRlbnRpYWxfaXNzdWVyIiwgIm5iZiI6IDE3MTc1Mzk2NzcsICJzdWIiOiAiZGlkOmR5bmU6c2FuZGJveC5zaWducm9vbTpDZ1hzNXhKZjlzZjVGRERzQkxrcmZkUEpKb1I1VHM5aURSWWJYdWtSYU5yViIsICJ0eXBlIjogImFib3ZlMTYifQ.w4r3T7bf03VAWqaUotrm9SxCHjHXdEC5oo4rO0-QhU85qvQm_KsGkILhaMoz2L_ZZuGMQAOhYokX4DcSc2_pkA~WyI1NEZRVTE5SHRDRTQ4TC16WDZ3REZRIiwgImZhbWlseV9uYW1lIiwgImZmIl0~WyJMNUE5R05peldIRmpYUXkyU0JObzRBIiwgImdpdmVuX25hbWUiLCAiaWkiXQ~WyJUbGtVWGRMZTk3amx6YW9Yd2lBT1pBIiwgImlzX2Fib3ZlXzE2IiwgIjE2Il0~',
			issuer: 'DIDroom_Issuer1',
			description:
				'You can use this credential to prove that you are above 16 years old and your name.',
			verified: false,
			expirationDate: 1720131677,
			logo: {
				alt_text: 'ZafeLoc Logo',
				url: 'https://blog.citizenkey.eu/public/Graphics/.ZafeLog__logo_s.png'
			},
			id: 2
		}
	]);
	localStorage.setItem('CapacitorStorage.credentials', credentials);
}

export function addActivitiesToLocalStorage() {
	const activities = JSON.stringify([
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
	]);
	localStorage.setItem('CapacitorStorage.activity', activities);
}
