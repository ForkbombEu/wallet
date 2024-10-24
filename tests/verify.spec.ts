import { VerificationPage } from './fixtures/VerificationPage';
import { expect, test } from '@playwright/test';
import { addCredentialsToLocalStorage, login } from './utils';
import { CredentialOfferPage } from './fixtures/CredentialOfferPage';

test.describe('Verification Page', () => {
	const verificationQR = `didroom4vp://?sid=QJSBD&exp=1929761423&id=lp3onf9p6vl6jm4&t=fcm+registration+token+is+not+available+in+web&m=f&rp=https%3A%2F%2Frp.test.didroom.com%2Frelying_party&ru=http%3A%2F%2F127.0.0.1%3A8090%2Fapi%2Fcollections%2Ftemplates_public_data%2Frecords%3Ffilter%3D%2528id%253D%2522ryqlx8pybjy9j7o%2522%2529%26expand%3Dorganization`;

	const expiredVerificationQR = `didroom4vp://?sid=QJSBD&exp=1729761423&id=lp3onf9p6vl6jm4&t=fcm+registration+token+is+not+available+in+web&m=f&rp=https%3A%2F%2Frp.test.didroom.com%2Frelying_party&ru=http%3A%2F%2F127.0.0.1%3A8090%2Fapi%2Fcollections%2Ftemplates_public_data%2Frecords%3Ffilter%3D%2528id%253D%2522ryqlx8pybjy9j7o%2522%2529%26expand%3Dorganization`;

	let verificationPage: VerificationPage;

	test.beforeEach(async ({ page }) => {
		await login(page);
		verificationPage = new VerificationPage(page);
	});

	test.skip('should render verification page', async () => {
		await verificationPage.navigate();
		await verificationPage.isPageVisible();
	});

	test('should display error if no credentials', async () => {
		await verificationPage.scanQr(verificationQR);
		await verificationPage.expectVerificationError();
		// await verificationPage.expectErrorForNoCredentials();
	});

	test('should display verification details', async ({ page }) => {
		await page.goto('/en/home');
		const credentialOfferPage = new CredentialOfferPage(page);
		credentialOfferPage.getACredential();
		await page.goto('/en/home');
		await verificationPage.scanQr(verificationQR);
		await verificationPage.expectVerificationDetailsVisible([
			'https://rp.test.didroom.com/relying_party/verify',
			'Voucher discount'
		]);
	});

	test('should verify credential and show result', async ({ page }) => {
		await page.goto('/en/home');
		const credentialOfferPage = new CredentialOfferPage(page);
		credentialOfferPage.getACredential();
		await page.goto('/en/home');
		await verificationPage.scanQr(verificationQR);
		// await page.getByRole('button', { name: 'VERIFY' }).click();
		// await verificationPage.verify();
		// await expect(page.locator('d-session-card')).toBeVisible();
	});

	test.skip('should add activity after success', async ({ page }) => {
		await verificationPage.scanQr(verificationQR);
		await verificationPage.verify();
	});

	test.skip('should show error for expired verification', async () => {
		await verificationPage.scanQr(expiredVerificationQR);
		await verificationPage.expectVerificationError();
	});

	test('should decline verification and return to home', async ({ page }) => {
		await page.goto('/en/home');
		const credentialOfferPage = new CredentialOfferPage(page);
		credentialOfferPage.getACredential();
		await page.goto('/en/home');
		await verificationPage.scanQr(verificationQR);
		await verificationPage.decline();
		await expect(page).toHaveURL('/en/unlock');
	});
});
