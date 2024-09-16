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

	test('should load verification page after scanning QR', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
		await page.getByRole('link', { name: 'SCAN QR' }).click();
		await expect(page).toHaveURL('/en/scan');
		await page.getByRole('textbox').fill(verificationQR);
		await page.getByRole('button', { name: 'SUBMIT' }).click();
		await expect(page).toHaveURL('/en/verification');
		await expect(page.getByText('Verification', { exact: true })).toBeVisible();
	});

	test('should display error if no credentials', async ({ page }) => {
		await login(page);
		await page.getByRole('link', { name: 'SCAN QR' }).click();
		await expect(page).toHaveURL('/en/scan');
		await page.getByRole('textbox').fill(verificationQR);
		await page.getByRole('button', { name: 'SUBMIT' }).click();
		await expect(page.getByText('no credentials')).toBeVisible();
	});

	test('should display verification details', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
		await page.getByRole('link', { name: 'SCAN QR' }).click();
		await page.getByRole('textbox').fill(verificationQR);
		await page.getByRole('button', { name: 'SUBMIT' }).click();
		await expect(page.getByText('Verification', { exact: true })).toBeVisible();
		await expect(page.getByText('Is asking for verification')).toBeVisible();
		await expect(page.getByText('DIDroom_RelyingParty1')).toBeVisible();
		await expect(
			page.getByText('https://relying-party1.zenswarm.forkbomb.eu/relying_party/verify')
		).toBeVisible();
		await expect(page.getByText('Confirm data to be disclosed')).toBeVisible();
		await expect(page.getByText('Current given name')).toBeVisible();
	});

	test('should verify credential and show result', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
		await page.getByRole('link', { name: 'SCAN QR' }).click();
		await page.getByRole('textbox').fill(verificationQR);
		await page.getByRole('button', { name: 'SUBMIT' }).click();
		await page.getByRole('button', { name: 'VERIFY' }).click();
		await expect(page.locator('d-session-card')).toBeVisible();
	});

	test('should add activity after success', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
		await page.getByRole('link', { name: 'SCAN QR' }).click();
		await page.getByRole('textbox').fill(verificationQR);
		await page.getByRole('button', { name: 'SUBMIT' }).click();
		await page.getByRole('button', { name: 'VERIFY' }).click();
		await expect(page.locator('d-session-card')).toBeVisible();
		await tabBarClick('Activity', page);
		const activityLocator = page.locator('.itens-start');
		await expect(activityLocator.first()).toBeVisible();
	});

	test('should show error for expired verification', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
		await page.getByRole('link', { name: 'SCAN QR' }).click();
		await page.getByRole('textbox').fill(expiredVerificationQR);
		await page.getByRole('button', { name: 'SUBMIT' }).click();
		await expect(page.locator('ion-modal')).toBeVisible();
	});

	test('should decline verification and return to home', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
		await page.getByRole('link', { name: 'SCAN QR' }).click();
		await page.getByRole('textbox').fill(verificationQR);
		await page.getByRole('button', { name: 'SUBMIT' }).click();
		await page.getByRole('button', { name: 'DECLINE' }).click();
		await expect(page).toHaveURL('en/home');
	});
});
