import { test } from '@playwright/test';
import { login, tabBarClick, userEmail, userPassword } from './utils';
import { CredentialOfferPage } from './fixtures/CredentialOfferPage';

test.describe('Credential Offer Page', () => {
	let credentialOfferPage: CredentialOfferPage;

	test.beforeEach(async ({ page }) => {
		await login(page);
		await tabBarClick('Home', page);
		credentialOfferPage = new CredentialOfferPage(page);
	});

	test('should have not accessibility issues', async () => {
		await credentialOfferPage.hasNoAccessibilityIssues();
	});

	test('should load credential offer page after navigating from home', async () => {
		await credentialOfferPage.navigate();
		await credentialOfferPage.verifyCredentialOfferVisible();
	});

	test('should load credential offer page after scan QR code', async () => {
		const qrCode =
			'openid-credential-offer://?credential_configuration_ids=email_PoP&credential_issuer=https%3A%2F%2Fissuer1.zenswarm.forkbomb.eu%2Fcredential_issuer';
		await credentialOfferPage.scanQr(qrCode);
		await credentialOfferPage.verifyCredentialOfferVisible();
	});

	test('should show error feedback if is broken issuer', async () => {
		const qrCode =
			'openid-credential-offer://?credential_configuration_ids=email_PoP&credential_issuer=https%3A%2F%2Fissuer1.zenswar.eu%2Fcredential_issuer';
		await credentialOfferPage.scanQr(qrCode);
		await credentialOfferPage.verifyIsBrokenIssuer();
	});

	test('should load iframe after clicking continue button', async () => {
		await credentialOfferPage.navigate();
		await credentialOfferPage.continueToAuthorization();
		await credentialOfferPage.verifyIframeLoaded();
	});

	test('should fill the iframe form and authenticate', async ({page}) => {
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

	test('should decline credential offer and return to home', async () => {
		await credentialOfferPage.navigate();
		await credentialOfferPage.declineOffer();
		await credentialOfferPage.waitForUrlContains('/en/home');
	});
});
