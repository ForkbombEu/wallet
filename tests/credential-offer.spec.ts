import { test } from './fixtures/testWithFixtures';
import { login, tabBarClick } from './utils';

test.describe('Credential Offer Page', () => {
	test.beforeEach(async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
	});

	test('should have not accessibility issues', async ({ credentialOfferPage }) => {
		await credentialOfferPage.hasNoAccessibilityIssues();
	});

	test('should load credential offer page after navigating from home', async ({
		credentialOfferPage
	}) => {
		await credentialOfferPage.navigate();
		await credentialOfferPage.verifyCredentialOfferVisible();
	});

	test('should load credential offer page after scan QR code', async ({ credentialOfferPage }) => {
		const qrCode =
			'openid-credential-offer://?credential_configuration_ids=discount_from_voucher_test&credential_issuer=https%3A%2F%2Fci.test.didroom.com%2Fcredential_issuer';
		await credentialOfferPage.scanQr(qrCode);
		await credentialOfferPage.verifyCredentialOfferVisible();
	});

	test('should show error feedback if is broken issuer', async ({ credentialOfferPage }) => {
		const qrCode =
			'openid-credential-offer://?credential_configuration_ids=discount_from_voucher_test&credential_issuer=https%3A%2F%2Fnot.a.real.issuer.didroom.com%2Fcredential_issuer';
		await credentialOfferPage.scanQr(qrCode);
		await credentialOfferPage.verifyIsBrokenIssuer();
	});

	test('should load iframe after clicking continue button', async ({ credentialOfferPage }) => {
		await credentialOfferPage.navigate();
		await credentialOfferPage.continueToAuthorization();
		await credentialOfferPage.verifyIframeLoaded();
	});

	test('should fill the iframe form and authenticate', async ({ page, credentialOfferPage }) => {
		// credentialOfferPage.getACredential();
		await credentialOfferPage.navigate();
		await credentialOfferPage.continueToAuthorization();
		await credentialOfferPage.verifyIframeLoaded();
		await credentialOfferPage.submitExternalForm({ voucher: 'ten' });
		await credentialOfferPage.verifyModalHidden();
		await page.waitForTimeout(3000);
		await credentialOfferPage.waitForUrlContains('/en/1/credential-detail');
		// credentialOfferPage.expectText('credential detail');
	});

	test('should decline credential offer and return to home', async ({ credentialOfferPage }) => {
		await credentialOfferPage.navigate();
		await credentialOfferPage.declineOffer();
		await credentialOfferPage.waitForUrlContains('/en/home');
	});

	test('should return erro with ministry of defence qr code', async ({ credentialOfferPage }) => {
		const ministryOfDefence =
			'openid-credential-offer://?credential_offer=%7B%22credential_issuer%22%3A%22https%3A%2F%2Fministerie-agent.dev.impierce.com%2F%22%2C%22credential_configuration_ids%22%3A%5B%22openbadge_credential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22ebb90f2db21a4708b93217a686f91e134b370b350aae18dc25a382507b141c13%22%7D%7D%7D';
		await credentialOfferPage.scanQr(ministryOfDefence);
		await credentialOfferPage.verifyIsBrokenIssuer();
	});
});
