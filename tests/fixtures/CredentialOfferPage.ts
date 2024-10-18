import { type Page, type Locator, type FrameLocator, expect } from '@playwright/test';

export class CredentialOfferPage {
	private readonly proofOfEmailBtn: Locator;
	private readonly qrScanBtn: Locator;
	private readonly submitQRBtn: Locator;
	private readonly credentialOfferText: Locator;
	private readonly credentialIssuerOfflineText: Locator;
	private readonly continueButton: Locator;
	private readonly declineButton: Locator;
	private readonly frameLocator: FrameLocator;
	private readonly emailField: Locator;
	private readonly passwordField: Locator;
	private readonly authenticateButton: Locator;
	private readonly modalOverlay: Locator;

	constructor(public readonly page: Page) {
		this.proofOfEmailBtn = this.page.locator('text=Proof of email possession');
		this.qrScanBtn = this.page.getByRole('link', { name: 'SCAN QR' });
		this.submitQRBtn = this.page.getByRole('button', { name: 'SUBMIT' });
		this.credentialOfferText = this.page.getByText('Credential offer');
		this.credentialIssuerOfflineText = this.page.getByText(
			'The credential issuer is currently offline, you may try again later'
		);
		this.continueButton = this.page.locator('d-button:has-text("Continue")');
		this.declineButton = this.page.locator('d-button:has-text("Decline")');
		this.frameLocator = this.page.frameLocator('#authorization_server');
		this.emailField = this.frameLocator.locator('#root\\[email\\]');
		this.passwordField = this.frameLocator.locator('#root\\[password\\]');
		this.authenticateButton = this.frameLocator.locator('#execute');
		this.modalOverlay = this.page.locator('#ion-overlay-5');
	}

	async gotoCredentialOfferPage() {
		await this.proofOfEmailBtn.click();
		await expect(this.page).toHaveURL('/en/credential-offer');
	}

	async verifyCredentialOfferVisible() {
		await expect(this.credentialOfferText).toBeVisible();
		await expect(this.continueButton).toBeVisible();
	}

	async verifyIsBrokenIssuer() {
		await expect(this.credentialIssuerOfflineText).toBeVisible();
	}

	async scanQRCode(qrCode: string) {
		await this.qrScanBtn.click();
		await expect(this.page).toHaveURL('/en/scan');
		await this.page.getByRole('textbox').fill(qrCode);
		await this.submitQRBtn.click();
		await expect(this.page).toHaveURL('/en/credential-offer');
	}

	async continueToAuthorization() {
		await this.continueButton.click();
		// await expect(this.frameLocator).toBeVisible();
	}

	async verifyModalVisible() {
		await expect(this.modalOverlay).toBeVisible();
	}

	async verifyModalHidden() {
		await expect(this.modalOverlay).toBeHidden();
	}

	async verifyIframeLoaded() {
		await expect(this.frameLocator).toBeDefined();
	}

	async submitCredentialForm(email: string, password: string) {
		await this.emailField.fill(email);
		await this.passwordField.fill(password);
		await this.authenticateButton.click();
	}

	async declineOffer() {
		await this.declineButton.click();
	}
}
