import { VerificationPage } from './fixtures/VerificationPage';
import { expect, test } from '@playwright/test';
import { addCredentialsToLocalStorage, login, tabBarClick } from './utils';

test.describe.skip('Verification Page', () => {
	const verificationQR = `{
			"exp":1718791484,
			"id":"j3yaawjxeuyobut",
			"m":"f",
			"rp":"https://relying-party1.zenswarm.forkbomb.eu/relying_party/",
			"ru":"https://staging.admin.didroom.com/api/collections/templates_public_data/records?filter=%28id%3D%22pt74yxc7gqb8ryq%22%29&fields=schema",
			"sid":"KVKA6",
			"t":"cUBgTJeyS4u6hSzre5FjfP:APA91bHI4tobsMu-ZdyMl6e4EyBWCZG-vUyhL_cFTVjehKryXrh66i9I5t_9ZbgnjUcZDWW9zNrtrWj-VmLsSeth7lhexMNm7y4Lozf3LWM83GucuQ_K_GrO-YIzfcRCWhhCuG5q5xDb"
		}`;

	const expiredVerificationQR = `{
            "exp": 1609459200,
            "id": "83ox1ucuingjblb",
            "m": "f",
            "rp": "https://relying-party1.zenswarm.forkbomb.eu/relying_party/",
            "ru": "https://staging.admin.didroom.com/api/collections/templates_public_data/records?filter=%28id%3D%22pt74yxc7gqb8ryq%22%29&fields=schema",
            "sid": "XM9QN",
            "t": "caN0h_uNRlWCNT_gUyEDhv:APA91bEqtfEQU4kSlLf4xwW2YPTs2gG7_UiZa-_Fktoqui9eIJJ0BxFtLNr9lzNbmplsh3Ma5dw9mvqpwXpdlcNIISaTGJ7iTpncEW5dJCPZuMkwcOLV-bS8G394M83y1K1FVDkR1MsO"
        }`;

	let verificationPage: VerificationPage;

	test.beforeEach(async ({ page }) => {
		await login(page);
		verificationPage = new VerificationPage(page);
	});

	test('should render verification page', async () => {
		await verificationPage.navigate();
		await verificationPage.isPageVisible();
	});

	test('should display error if no credentials', async () => {
		await verificationPage.scanQr(verificationQR);
		await verificationPage.expectErrorForNoCredentials();
	});

	test('should display verification details', async () => {
		await verificationPage.scanQr(verificationQR);
		await verificationPage.expectVerificationDetailsVisible([
			'DIDroom_RelyingParty1',
			'https://relying-party1.zenswarm.forkbomb.eu/relying_party/verify',
			'Current given name'
		]);
	});

	test('should verify credential and show result', async () => {
		await verificationPage.scanQr(verificationQR);
		// await page.getByRole('button', { name: 'VERIFY' }).click();
		await verificationPage.verify();
		// await expect(page.locator('d-session-card')).toBeVisible();
	});

	test('should add activity after success', async ({ page }) => {
		await verificationPage.scanQr(verificationQR);
		await verificationPage.verify();
		// await expect(page.locator('d-session-card')).toBeVisible();
		// await tabBarClick('Activity', page);
		// const activityLocator = page.locator('.itens-start');
		// await expect(activityLocator.first()).toBeVisible();
	});

	test('should show error for expired verification', async ({ page }) => {
		await verificationPage.scanQr(expiredVerificationQR);
		await expect(page.locator('ion-modal')).toBeVisible();
	});

	test('should decline verification and return to home', async ({ page }) => {
		await verificationPage.scanQr(verificationQR);
		await verificationPage.decline();
		await expect(page).toHaveURL('en/home');
	});
});
