import { type Page, type Locator, type FrameLocator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { ScanQrButton } from '../components/ScanQrButton';
import { FormComponent } from '../components/FormComponent';

class CredentialOfferForm extends FormComponent {
	private readonly frameLocator: FrameLocator;

	constructor(public readonly page: Page) {
		super(page);
		this.frameLocator = this.page.frameLocator('#authorization_server');
	}
	async submitForm(): Promise<void> {
		await this.page.waitForTimeout(500)
		await this.frameLocator.locator('#execute').click();
	}
	async fillInputByName(fieldName: string, value: string): Promise<void> {
		await this.frameLocator.locator(`#root\\[${fieldName}\\]`).fill(value);
	}
}

export class CredentialOfferPage extends BasePage {
	path = '/en/credential-offer';
	pageTitle = 'Credential Offer';

	form: CredentialOfferForm;

	private readonly qrScanBtn: ScanQrButton;
	private readonly credentialOfferText: Locator;
	private readonly credentialIssuerOfflineText: Locator;
	private readonly continueButton: Locator;
	private readonly declineButton: Locator;
	private readonly frameLocator: FrameLocator;
	private readonly modalOverlay: Locator;

	constructor(public readonly page: Page) {
		super(page);

		this.form = new CredentialOfferForm(page);

		this.qrScanBtn = new ScanQrButton(page);
		this.credentialOfferText = this.page.getByText('Credential offer');
		this.credentialIssuerOfflineText = this.page.getByText(
			'The credential issuer is currently offline, you may try again later'
		);
		this.continueButton = this.page.locator('d-button:has-text("Continue")');
		this.declineButton = this.page.locator('d-button:has-text("Decline")');
		this.frameLocator = this.page.frameLocator('#authorization_server');
		this.modalOverlay = this.page.locator('#ion-overlay-5');
	}

	async navigate(credential = 'Voucher test') {
		await this.page.locator(`text=${credential}`).click();
		await this.page.waitForURL(/credential-offer/);
	}

	async verifyCredentialOfferVisible() {
		await expect(this.credentialOfferText).toBeVisible();
		await expect(this.continueButton).toBeVisible();
	}

	async verifyIsBrokenIssuer() {
		await expect(this.credentialIssuerOfflineText).toBeVisible();
	}

	async scanQr(qrCode: string) {
		await this.qrScanBtn.scanQr(qrCode);
	}

	async continueToAuthorization() {
		await this.continueButton.click();
	}

	async verifyModalVisible() {
		await expect(this.modalOverlay).toBeVisible();
	}

	async verifyModalHidden() {
		await expect(this.modalOverlay).toBeHidden();
	}

	async verifyIframeLoaded() {
		expect(this.frameLocator).toBeDefined();
	}

	async submitExternalForm(data: Record<string, string>) {
		await this.form.fillAndSubmit(data);
	}

	async declineOffer() {
		await this.declineButton.click();
	}

	async getACredential(credential = 'Voucher test', data = { voucher: 'ten' }) {
		await this.navigate(credential);
		await this.continueToAuthorization();
		await this.form.fillAndSubmit(data);
		await this.waitForUrlContains('/en/1/credential-detail');
		await this.clickButtonByName('close');
	}
}
