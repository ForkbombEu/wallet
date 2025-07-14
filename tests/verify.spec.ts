import { expect, test } from './fixtures/testWithFixtures';
import { login } from './utils';

test.describe.skip('Verification Page', () => {
	const verificationQR = `didroom4vp://?sid=QJSBD&exp=1929761423&id=lp3onf9p6vl6jm4&t=fcm+registration+token+is+not+available+in+web&m=f&rp=https%3A%2F%2Frp.test.didroom.com%2Frelying_party&ru=http%3A%2F%2F127.0.0.1%3A8090%2Fapi%2Fcollections%2Ftemplates_public_data%2Frecords%3Ffilter%3D%2528id%253D%2522ryqlx8pybjy9j7o%2522%2529%26expand%3Dorganization`;
	const expiredVerificationQR = `didroom4vp://?sid=QJSBD&exp=1529761423&id=lp3onf9p6vl6jm4&t=fcm+registration+token+is+not+available+in+web&m=f&rp=https%3A%2F%2Frp.test.didroom.com%2Frelying_party&ru=http%3A%2F%2F127.0.0.1%3A8090%2Fapi%2Fcollections%2Ftemplates_public_data%2Frecords%3Ffilter%3D%2528id%253D%2522ryqlx8pybjy9j7o%2522%2529%26expand%3Dorganization`;

	test.describe.configure({ retries: 2 });
	
	test.beforeEach(async ({ page }) => {
		await login(page);
		await page.goto('/en/home');
	});

	test('should display error if no credentials', async ({ verificationPage }) => {
		await verificationPage.scanQr(verificationQR);
		await verificationPage.expectErrorForNoCredentials();
	});

	test('should display verification details', async ({
		page,
		verificationPage,
		credentialOfferPage
	}) => {
		credentialOfferPage.getACredential();
		await page.goto('/en/home');
		await verificationPage.scanQr(verificationQR);
		await verificationPage.expectVerificationDetailsVisible([
			'https://rp.test.didroom.com/relying_party/verify',
			'Voucher discount'
		]);
	});

	test('should click on choose credentials and go to credential selection page', async ({
		page,
		verificationPage,
		credentialOfferPage
	}) => {
		credentialOfferPage.getACredential();
		await page.goto('/en/home');
		await verificationPage.scanQr(verificationQR);
		await verificationPage.verify();
		await verificationPage.waitForUrlContains('/en/verification/select-credential');
	});

	test.skip('should add activity after success', async ({ verificationPage }) => {
		await verificationPage.scanQr(verificationQR);
		await verificationPage.verify();
	});

	test('should show error for expired verification', async ({
		page,
		verificationPage,
		credentialOfferPage
	}) => {
		credentialOfferPage.getACredential();
		await page.goto('/en/home');
		await verificationPage.scanQr(expiredVerificationQR);
		await verificationPage.expectVerificationError();
	});

	test('should decline verification and return to home', async ({
		page,
		verificationPage,
		credentialOfferPage
	}) => {
		credentialOfferPage.getACredential();
		await page.goto('/en/home');
		await verificationPage.scanQr(verificationQR);
		await verificationPage.decline();
		await expect(page).toHaveURL('/en/unlock');
	});
});
